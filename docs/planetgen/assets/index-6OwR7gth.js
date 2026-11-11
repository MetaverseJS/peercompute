var eg=Object.defineProperty;var tg=(n,e,t)=>e in n?eg(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var j=(n,e,t)=>tg(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Yu="171",rs={ROTATE:0,DOLLY:1,PAN:2},ng=0,jd=1,ig=2,Yp=1,jp=2,ui=3,En=0,on=1,Ln=2,zi=0,Zn=1,Oo=2,Kd=3,Qd=4,rg=5,hr=100,sg=101,ag=102,og=103,lg=104,cg=200,ug=201,dg=202,hg=203,Ic=204,Lc=205,fg=206,pg=207,mg=208,gg=209,vg=210,yg=211,xg=212,bg=213,_g=214,Uc=0,Nc=1,Fc=2,ps=3,Bc=4,Oc=5,zc=6,kc=7,ju=0,wg=1,Sg=2,ki=0,Mg=1,Eg=2,Tg=3,Ag=4,Cg=5,Rg=6,Pg=7,Kp=300,ms=301,gs=302,Gc=303,Vc=304,pl=306,Tn=1e3,pt=1001,Hc=1002,Dt=1003,Dg=1004,Ra=1005,it=1006,Pl=1007,pr=1008,Lt=1009,Qp=1010,Zp=1011,ua=1012,Ku=1013,xr=1014,mi=1015,ya=1016,Qu=1017,Zu=1018,vs=1020,Jp=35902,em=1021,tm=1022,St=1023,nm=1024,im=1025,ss=1026,ys=1027,rm=1028,Ju=1029,sm=1030,ed=1031,td=1033,yo=33776,xo=33777,bo=33778,_o=33779,Wc=35840,qc=35841,Xc=35842,$c=35843,Yc=36196,jc=37492,Kc=37496,Qc=37808,Zc=37809,Jc=37810,eu=37811,tu=37812,nu=37813,iu=37814,ru=37815,su=37816,au=37817,ou=37818,lu=37819,cu=37820,uu=37821,wo=36492,du=36494,hu=36495,am=36283,fu=36284,pu=36285,mu=36286,Ig=3200,Lg=3201,nd=0,Ug=1,Bt="",wn="srgb",xs="srgb-linear",zo="linear",at="srgb",Ar=7680,Zd=519,Ng=512,Fg=513,Bg=514,om=515,Og=516,zg=517,kg=518,Gg=519,gu=35044,Jd="300 es",gi=2e3,ko=2001;class Mr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const $t=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let eh=1234567;const Qs=Math.PI/180,da=180/Math.PI;function vi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return($t[n&255]+$t[n>>8&255]+$t[n>>16&255]+$t[n>>24&255]+"-"+$t[e&255]+$t[e>>8&255]+"-"+$t[e>>16&15|64]+$t[e>>24&255]+"-"+$t[t&63|128]+$t[t>>8&255]+"-"+$t[t>>16&255]+$t[t>>24&255]+$t[i&255]+$t[i>>8&255]+$t[i>>16&255]+$t[i>>24&255]).toLowerCase()}function We(n,e,t){return Math.max(e,Math.min(t,n))}function id(n,e){return(n%e+e)%e}function Vg(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Hg(n,e,t){return n!==e?(t-n)/(e-n):0}function Zs(n,e,t){return(1-t)*n+t*e}function Wg(n,e,t,i){return Zs(n,e,1-Math.exp(-t*i))}function qg(n,e=1){return e-Math.abs(id(n,e*2)-e)}function Xg(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function $g(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Yg(n,e){return n+Math.floor(Math.random()*(e-n+1))}function jg(n,e){return n+Math.random()*(e-n)}function Kg(n){return n*(.5-Math.random())}function Qg(n){n!==void 0&&(eh=n);let e=eh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Zg(n){return n*Qs}function Jg(n){return n*da}function ev(n){return(n&n-1)===0&&n!==0}function tv(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function nv(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function iv(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),d=a((e+i)/2),h=s((e-i)/2),f=a((e-i)/2),p=s((i-e)/2),g=a((i-e)/2);switch(r){case"XYX":n.set(o*d,l*h,l*f,o*c);break;case"YZY":n.set(l*f,o*d,l*h,o*c);break;case"ZXZ":n.set(l*h,l*f,o*d,o*c);break;case"XZX":n.set(o*d,l*g,l*p,o*c);break;case"YXY":n.set(l*p,o*d,l*g,o*c);break;case"ZYZ":n.set(l*g,l*p,o*d,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function qn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function st(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Go={DEG2RAD:Qs,RAD2DEG:da,generateUUID:vi,clamp:We,euclideanModulo:id,mapLinear:Vg,inverseLerp:Hg,lerp:Zs,damp:Wg,pingpong:qg,smoothstep:Xg,smootherstep:$g,randInt:Yg,randFloat:jg,randFloatSpread:Kg,seededRandom:Qg,degToRad:Zg,radToDeg:Jg,isPowerOfTwo:ev,ceilPowerOfTwo:tv,floorPowerOfTwo:nv,setQuaternionFromProperEuler:iv,normalize:st,denormalize:qn};class Ee{constructor(e=0,t=0){Ee.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ue{constructor(e,t,i,r,s,a,o,l,c){Ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=o,d[3]=t,d[4]=s,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],h=i[7],f=i[2],p=i[5],g=i[8],x=r[0],m=r[3],u=r[6],y=r[1],b=r[4],v=r[7],M=r[2],S=r[5],E=r[8];return s[0]=a*x+o*y+l*M,s[3]=a*m+o*b+l*S,s[6]=a*u+o*v+l*E,s[1]=c*x+d*y+h*M,s[4]=c*m+d*b+h*S,s[7]=c*u+d*v+h*E,s[2]=f*x+p*y+g*M,s[5]=f*m+p*b+g*S,s[8]=f*u+p*v+g*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*s*d+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*a-o*c,f=o*l-d*s,p=c*s-a*l,g=t*h+i*f+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=h*x,e[1]=(r*c-d*i)*x,e[2]=(o*i-r*a)*x,e[3]=f*x,e[4]=(d*t-r*l)*x,e[5]=(r*s-o*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Dl.makeScale(e,t)),this}rotate(e){return this.premultiply(Dl.makeRotation(-e)),this}translate(e,t){return this.premultiply(Dl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Dl=new Ue;function lm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Vo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function rv(){const n=Vo("canvas");return n.style.display="block",n}const th={};function jr(n){n in th||(th[n]=!0,console.warn(n))}function sv(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function av(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ov(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const nh=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ih=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function lv(){const n={enabled:!0,workingColorSpace:xs,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===at&&(r.r=yi(r.r),r.g=yi(r.g),r.b=yi(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===at&&(r.r=as(r.r),r.g=as(r.g),r.b=as(r.b))),r},fromWorkingColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},toWorkingColorSpace:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Bt?zo:this.spaces[r].transfer},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[xs]:{primaries:e,whitePoint:i,transfer:zo,toXYZ:nh,fromXYZ:ih,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:wn},outputColorSpaceConfig:{drawingBufferColorSpace:wn}},[wn]:{primaries:e,whitePoint:i,transfer:at,toXYZ:nh,fromXYZ:ih,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:wn}}}),n}const Je=lv();function yi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function as(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Cr;class cv{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Cr===void 0&&(Cr=Vo("canvas")),Cr.width=e.width,Cr.height=e.height;const i=Cr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Cr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Vo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=yi(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(yi(t[i]/255)*255):t[i]=yi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let uv=0;class cm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:uv++}),this.uuid=vi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Il(r[a].image)):s.push(Il(r[a]))}else s=Il(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Il(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?cv.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let dv=0;class ln extends Mr{constructor(e=ln.DEFAULT_IMAGE,t=ln.DEFAULT_MAPPING,i=pt,r=pt,s=it,a=pr,o=St,l=Lt,c=ln.DEFAULT_ANISOTROPY,d=Bt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:dv++}),this.uuid=vi(),this.name="",this.source=new cm(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Kp)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Tn:e.x=e.x-Math.floor(e.x);break;case pt:e.x=e.x<0?0:1;break;case Hc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Tn:e.y=e.y-Math.floor(e.y);break;case pt:e.y=e.y<0?0:1;break;case Hc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Kp;ln.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,i=0,r=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],d=l[4],h=l[8],f=l[1],p=l[5],g=l[9],x=l[2],m=l[6],u=l[10];if(Math.abs(d-f)<.01&&Math.abs(h-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,v=(p+1)/2,M=(u+1)/2,S=(d+f)/4,E=(h+x)/4,A=(g+m)/4;return b>v&&b>M?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=S/i,s=E/i):v>M?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=S/r,s=A/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=E/s,r=A/s),this.set(i,r,s,t),this}let y=Math.sqrt((m-g)*(m-g)+(h-x)*(h-x)+(f-d)*(f-d));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(h-x)/y,this.z=(f-d)/y,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class hv extends Mr{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:it,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new ln(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new cm(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class br extends hv{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class um extends ln{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class fv extends ln{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Dt,this.minFilter=Dt,this.wrapR=pt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $n{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],d=i[r+2],h=i[r+3];const f=s[a+0],p=s[a+1],g=s[a+2],x=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=x;return}if(h!==x||l!==f||c!==p||d!==g){let m=1-o;const u=l*f+c*p+d*g+h*x,y=u>=0?1:-1,b=1-u*u;if(b>Number.EPSILON){const M=Math.sqrt(b),S=Math.atan2(M,u*y);m=Math.sin(m*S)/M,o=Math.sin(o*S)/M}const v=o*y;if(l=l*m+f*v,c=c*m+p*v,d=d*m+g*v,h=h*m+x*v,m===1-o){const M=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=M,c*=M,d*=M,h*=M}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],d=i[r+3],h=s[a],f=s[a+1],p=s[a+2],g=s[a+3];return e[t]=o*g+d*h+l*p-c*f,e[t+1]=l*g+d*f+c*h-o*p,e[t+2]=c*g+d*p+o*f-l*h,e[t+3]=d*g-o*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(r/2),h=o(s/2),f=l(i/2),p=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=f*d*h+c*p*g,this._y=c*p*h-f*d*g,this._z=c*d*g+f*p*h,this._w=c*d*h-f*p*g;break;case"YXZ":this._x=f*d*h+c*p*g,this._y=c*p*h-f*d*g,this._z=c*d*g-f*p*h,this._w=c*d*h+f*p*g;break;case"ZXY":this._x=f*d*h-c*p*g,this._y=c*p*h+f*d*g,this._z=c*d*g+f*p*h,this._w=c*d*h-f*p*g;break;case"ZYX":this._x=f*d*h-c*p*g,this._y=c*p*h+f*d*g,this._z=c*d*g-f*p*h,this._w=c*d*h+f*p*g;break;case"YZX":this._x=f*d*h+c*p*g,this._y=c*p*h+f*d*g,this._z=c*d*g-f*p*h,this._w=c*d*h-f*p*g;break;case"XZY":this._x=f*d*h-c*p*g,this._y=c*p*h-f*d*g,this._z=c*d*g+f*p*h,this._w=c*d*h+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],h=t[10],f=i+o+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>h){const p=2*Math.sqrt(1+i-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-i-h);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+r*c-s*l,this._y=r*d+a*l+s*o-i*c,this._z=s*d+a*c+i*l-r*o,this._w=a*d-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),h=Math.sin((1-t)*d)/c,f=Math.sin(t*d)/c;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),d=2*(o*t-s*r),h=2*(s*i-a*t);return this.x=t+l*c+a*h-o*d,this.y=i+l*d+o*c-s*h,this.z=r+l*h+s*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ll.copy(this).projectOnVector(e),this.sub(Ll)}reflect(e){return this.sub(Ll.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ll=new D,rh=new $n;class xa{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,On):On.fromBufferAttribute(s,a),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Pa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Pa.copy(i.boundingBox)),Pa.applyMatrix4(e.matrixWorld),this.union(Pa)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(As),Da.subVectors(this.max,As),Rr.subVectors(e.a,As),Pr.subVectors(e.b,As),Dr.subVectors(e.c,As),Ti.subVectors(Pr,Rr),Ai.subVectors(Dr,Pr),ir.subVectors(Rr,Dr);let t=[0,-Ti.z,Ti.y,0,-Ai.z,Ai.y,0,-ir.z,ir.y,Ti.z,0,-Ti.x,Ai.z,0,-Ai.x,ir.z,0,-ir.x,-Ti.y,Ti.x,0,-Ai.y,Ai.x,0,-ir.y,ir.x,0];return!Ul(t,Rr,Pr,Dr,Da)||(t=[1,0,0,0,1,0,0,0,1],!Ul(t,Rr,Pr,Dr,Da))?!1:(Ia.crossVectors(Ti,Ai),t=[Ia.x,Ia.y,Ia.z],Ul(t,Rr,Pr,Dr,Da))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ri),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ri=[new D,new D,new D,new D,new D,new D,new D,new D],On=new D,Pa=new xa,Rr=new D,Pr=new D,Dr=new D,Ti=new D,Ai=new D,ir=new D,As=new D,Da=new D,Ia=new D,rr=new D;function Ul(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){rr.fromArray(n,s);const o=r.x*Math.abs(rr.x)+r.y*Math.abs(rr.y)+r.z*Math.abs(rr.z),l=e.dot(rr),c=t.dot(rr),d=i.dot(rr);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const pv=new xa,Cs=new D,Nl=new D;class ba{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):pv.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Cs.subVectors(e,this.center);const t=Cs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Cs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Nl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Cs.copy(e.center).add(Nl)),this.expandByPoint(Cs.copy(e.center).sub(Nl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const si=new D,Fl=new D,La=new D,Ci=new D,Bl=new D,Ua=new D,Ol=new D;class ml{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(si.copy(this.origin).addScaledVector(this.direction,t),si.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Fl.copy(e).add(t).multiplyScalar(.5),La.copy(t).sub(e).normalize(),Ci.copy(this.origin).sub(Fl);const s=e.distanceTo(t)*.5,a=-this.direction.dot(La),o=Ci.dot(this.direction),l=-Ci.dot(La),c=Ci.lengthSq(),d=Math.abs(1-a*a);let h,f,p,g;if(d>0)if(h=a*l-o,f=a*o-l,g=s*d,h>=0)if(f>=-g)if(f<=g){const x=1/d;h*=x,f*=x,p=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Fl).addScaledVector(La,f),p}intersectSphere(e,t){si.subVectors(e.center,this.origin);const i=si.dot(this.direction),r=si.dot(si)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),d>=0?(s=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(s=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,si)!==null}intersectTriangle(e,t,i,r,s){Bl.subVectors(t,e),Ua.subVectors(i,e),Ol.crossVectors(Bl,Ua);let a=this.direction.dot(Ol),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ci.subVectors(this.origin,e);const l=o*this.direction.dot(Ua.crossVectors(Ci,Ua));if(l<0)return null;const c=o*this.direction.dot(Bl.cross(Ci));if(c<0||l+c>a)return null;const d=-o*Ci.dot(Ol);return d<0?null:this.at(d/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,i,r,s,a,o,l,c,d,h,f,p,g,x,m){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,d,h,f,p,g,x,m)}set(e,t,i,r,s,a,o,l,c,d,h,f,p,g,x,m){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=d,u[10]=h,u[14]=f,u[3]=p,u[7]=g,u[11]=x,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Ir.setFromMatrixColumn(e,0).length(),s=1/Ir.setFromMatrixColumn(e,1).length(),a=1/Ir.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*d,p=a*h,g=o*d,x=o*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=f-x*c,t[9]=-o*l,t[2]=x-f*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*d,p=l*h,g=c*d,x=c*h;t[0]=f+x*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*h,t[5]=a*d,t[9]=-o,t[2]=p*o-g,t[6]=x+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*d,p=l*h,g=c*d,x=c*h;t[0]=f-x*o,t[4]=-a*h,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*d,t[9]=x-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*d,p=a*h,g=o*d,x=o*h;t[0]=l*d,t[4]=g*c-p,t[8]=f*c+x,t[1]=l*h,t[5]=x*c+f,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,p=a*c,g=o*l,x=o*c;t[0]=l*d,t[4]=x-f*h,t[8]=g*h+p,t[1]=h,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=p*h+g,t[10]=f-x*h}else if(e.order==="XZY"){const f=a*l,p=a*c,g=o*l,x=o*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=f*h+x,t[5]=a*d,t[9]=p*h-g,t[2]=g*h-p,t[6]=o*d,t[10]=x*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mv,e,gv)}lookAt(e,t,i){const r=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Ri.crossVectors(i,yn),Ri.lengthSq()===0&&(Math.abs(i.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Ri.crossVectors(i,yn)),Ri.normalize(),Na.crossVectors(yn,Ri),r[0]=Ri.x,r[4]=Na.x,r[8]=yn.x,r[1]=Ri.y,r[5]=Na.y,r[9]=yn.y,r[2]=Ri.z,r[6]=Na.z,r[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],h=i[5],f=i[9],p=i[13],g=i[2],x=i[6],m=i[10],u=i[14],y=i[3],b=i[7],v=i[11],M=i[15],S=r[0],E=r[4],A=r[8],w=r[12],_=r[1],R=r[5],U=r[9],L=r[13],O=r[2],V=r[6],k=r[10],H=r[14],z=r[3],Y=r[7],ne=r[11],le=r[15];return s[0]=a*S+o*_+l*O+c*z,s[4]=a*E+o*R+l*V+c*Y,s[8]=a*A+o*U+l*k+c*ne,s[12]=a*w+o*L+l*H+c*le,s[1]=d*S+h*_+f*O+p*z,s[5]=d*E+h*R+f*V+p*Y,s[9]=d*A+h*U+f*k+p*ne,s[13]=d*w+h*L+f*H+p*le,s[2]=g*S+x*_+m*O+u*z,s[6]=g*E+x*R+m*V+u*Y,s[10]=g*A+x*U+m*k+u*ne,s[14]=g*w+x*L+m*H+u*le,s[3]=y*S+b*_+v*O+M*z,s[7]=y*E+b*R+v*V+M*Y,s[11]=y*A+b*U+v*k+M*ne,s[15]=y*w+b*L+v*H+M*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],f=e[10],p=e[14],g=e[3],x=e[7],m=e[11],u=e[15];return g*(+s*l*h-r*c*h-s*o*f+i*c*f+r*o*p-i*l*p)+x*(+t*l*p-t*c*f+s*a*f-r*a*p+r*c*d-s*l*d)+m*(+t*c*h-t*o*p-s*a*h+i*a*p+s*o*d-i*c*d)+u*(-r*o*d-t*l*h+t*o*f+r*a*h-i*a*f+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],f=e[10],p=e[11],g=e[12],x=e[13],m=e[14],u=e[15],y=h*m*c-x*f*c+x*l*p-o*m*p-h*l*u+o*f*u,b=g*f*c-d*m*c-g*l*p+a*m*p+d*l*u-a*f*u,v=d*x*c-g*h*c+g*o*p-a*x*p-d*o*u+a*h*u,M=g*h*l-d*x*l-g*o*f+a*x*f+d*o*m-a*h*m,S=t*y+i*b+r*v+s*M;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return e[0]=y*E,e[1]=(x*f*s-h*m*s-x*r*p+i*m*p+h*r*u-i*f*u)*E,e[2]=(o*m*s-x*l*s+x*r*c-i*m*c-o*r*u+i*l*u)*E,e[3]=(h*l*s-o*f*s-h*r*c+i*f*c+o*r*p-i*l*p)*E,e[4]=b*E,e[5]=(d*m*s-g*f*s+g*r*p-t*m*p-d*r*u+t*f*u)*E,e[6]=(g*l*s-a*m*s-g*r*c+t*m*c+a*r*u-t*l*u)*E,e[7]=(a*f*s-d*l*s+d*r*c-t*f*c-a*r*p+t*l*p)*E,e[8]=v*E,e[9]=(g*h*s-d*x*s-g*i*p+t*x*p+d*i*u-t*h*u)*E,e[10]=(a*x*s-g*o*s+g*i*c-t*x*c-a*i*u+t*o*u)*E,e[11]=(d*o*s-a*h*s-d*i*c+t*h*c+a*i*p-t*o*p)*E,e[12]=M*E,e[13]=(d*x*r-g*h*r+g*i*f-t*x*f-d*i*m+t*h*m)*E,e[14]=(g*o*r-a*x*r-g*i*l+t*x*l+a*i*m-t*o*m)*E,e[15]=(a*h*r-d*o*r+d*i*l-t*h*l-a*i*f+t*o*f)*E,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,d=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,d*o+i,d*l-r*a,0,c*l-r*o,d*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,d=a+a,h=o+o,f=s*c,p=s*d,g=s*h,x=a*d,m=a*h,u=o*h,y=l*c,b=l*d,v=l*h,M=i.x,S=i.y,E=i.z;return r[0]=(1-(x+u))*M,r[1]=(p+v)*M,r[2]=(g-b)*M,r[3]=0,r[4]=(p-v)*S,r[5]=(1-(f+u))*S,r[6]=(m+y)*S,r[7]=0,r[8]=(g+b)*E,r[9]=(m-y)*E,r[10]=(1-(f+x))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Ir.set(r[0],r[1],r[2]).length();const a=Ir.set(r[4],r[5],r[6]).length(),o=Ir.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],zn.copy(this);const c=1/s,d=1/a,h=1/o;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=d,zn.elements[5]*=d,zn.elements[6]*=d,zn.elements[8]*=h,zn.elements[9]*=h,zn.elements[10]*=h,t.setFromRotationMatrix(zn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=gi){const l=this.elements,c=2*s/(t-e),d=2*s/(i-r),h=(t+e)/(t-e),f=(i+r)/(i-r);let p,g;if(o===gi)p=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===ko)p=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=gi){const l=this.elements,c=1/(t-e),d=1/(i-r),h=1/(a-s),f=(t+e)*c,p=(i+r)*d;let g,x;if(o===gi)g=(a+s)*h,x=-2*h;else if(o===ko)g=s*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ir=new D,zn=new ot,mv=new D(0,0,0),gv=new D(1,1,1),Ri=new D,Na=new D,yn=new D,sh=new ot,ah=new $n;class Yn{constructor(e=0,t=0,i=0,r=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],d=r[9],h=r[2],f=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return sh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ah.setFromEuler(this),this.setFromQuaternion(ah,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class rd{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let vv=0;const oh=new D,Lr=new $n,ai=new ot,Fa=new D,Rs=new D,yv=new D,xv=new $n,lh=new D(1,0,0),ch=new D(0,1,0),uh=new D(0,0,1),dh={type:"added"},bv={type:"removed"},Ur={type:"childadded",child:null},zl={type:"childremoved",child:null};class Mt extends Mr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vv++}),this.uuid=vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Mt.DEFAULT_UP.clone();const e=new D,t=new Yn,i=new $n,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new Ue}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=Mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rd,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Lr.setFromAxisAngle(e,t),this.quaternion.multiply(Lr),this}rotateOnWorldAxis(e,t){return Lr.setFromAxisAngle(e,t),this.quaternion.premultiply(Lr),this}rotateX(e){return this.rotateOnAxis(lh,e)}rotateY(e){return this.rotateOnAxis(ch,e)}rotateZ(e){return this.rotateOnAxis(uh,e)}translateOnAxis(e,t){return oh.copy(e).applyQuaternion(this.quaternion),this.position.add(oh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(lh,e)}translateY(e){return this.translateOnAxis(ch,e)}translateZ(e){return this.translateOnAxis(uh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Fa.copy(e):Fa.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(Rs,Fa,this.up):ai.lookAt(Fa,Rs,this.up),this.quaternion.setFromRotationMatrix(ai),r&&(ai.extractRotation(r.matrixWorld),Lr.setFromRotationMatrix(ai),this.quaternion.premultiply(Lr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dh),Ur.child=e,this.dispatchEvent(Ur),Ur.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bv),zl.child=e,this.dispatchEvent(zl),zl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dh),Ur.child=e,this.dispatchEvent(Ur),Ur.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rs,e,yv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Rs,xv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),h=a(e.shapes),f=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Mt.DEFAULT_UP=new D(0,1,0);Mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new D,oi=new D,kl=new D,li=new D,Nr=new D,Fr=new D,hh=new D,Gl=new D,Vl=new D,Hl=new D,Wl=new yt,ql=new yt,Xl=new yt;class Un{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),kn.subVectors(e,t),r.cross(kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){kn.subVectors(r,t),oi.subVectors(i,t),kl.subVectors(e,t);const a=kn.dot(kn),o=kn.dot(oi),l=kn.dot(kl),c=oi.dot(oi),d=oi.dot(kl),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-o*d)*f,g=(a*d-o*l)*f;return s.set(1-p-g,g,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,li)===null?!1:li.x>=0&&li.y>=0&&li.x+li.y<=1}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,li)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,li.x),l.addScaledVector(a,li.y),l.addScaledVector(o,li.z),l)}static getInterpolatedAttribute(e,t,i,r,s,a){return Wl.setScalar(0),ql.setScalar(0),Xl.setScalar(0),Wl.fromBufferAttribute(e,t),ql.fromBufferAttribute(e,i),Xl.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Wl,s.x),a.addScaledVector(ql,s.y),a.addScaledVector(Xl,s.z),a}static isFrontFacing(e,t,i,r){return kn.subVectors(i,t),oi.subVectors(e,t),kn.cross(oi).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),kn.cross(oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Un.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Un.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Un.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Un.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Un.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Nr.subVectors(r,i),Fr.subVectors(s,i),Gl.subVectors(e,i);const l=Nr.dot(Gl),c=Fr.dot(Gl);if(l<=0&&c<=0)return t.copy(i);Vl.subVectors(e,r);const d=Nr.dot(Vl),h=Fr.dot(Vl);if(d>=0&&h<=d)return t.copy(r);const f=l*h-d*c;if(f<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(i).addScaledVector(Nr,a);Hl.subVectors(e,s);const p=Nr.dot(Hl),g=Fr.dot(Hl);if(g>=0&&p<=g)return t.copy(s);const x=p*c-l*g;if(x<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Fr,o);const m=d*g-p*h;if(m<=0&&h-d>=0&&p-g>=0)return hh.subVectors(s,r),o=(h-d)/(h-d+(p-g)),t.copy(r).addScaledVector(hh,o);const u=1/(m+x+f);return a=x*u,o=f*u,t.copy(i).addScaledVector(Nr,a).addScaledVector(Fr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const dm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},Ba={h:0,s:0,l:0};function $l(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Se{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Je.workingColorSpace){if(e=id(e,1),t=We(t,0,1),i=We(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=$l(a,s,e+1/3),this.g=$l(a,s,e),this.b=$l(a,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,t=wn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=wn){const i=dm[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}copyLinearToSRGB(e){return this.r=as(e.r),this.g=as(e.g),this.b=as(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=wn){return Je.fromWorkingColorSpace(Yt.copy(this),e),Math.round(We(Yt.r*255,0,255))*65536+Math.round(We(Yt.g*255,0,255))*256+Math.round(We(Yt.b*255,0,255))}getHexString(e=wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace(Yt.copy(this),t);const i=Yt.r,r=Yt.g,s=Yt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=d<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace(Yt.copy(this),t),e.r=Yt.r,e.g=Yt.g,e.b=Yt.b,e}getStyle(e=wn){Je.fromWorkingColorSpace(Yt.copy(this),e);const t=Yt.r,i=Yt.g,r=Yt.b;return e!==wn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(Ba);const i=Zs(Pi.h,Ba.h,t),r=Zs(Pi.s,Ba.s,t),s=Zs(Pi.l,Ba.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Yt=new Se;Se.NAMES=dm;let _v=0;class Si extends Mr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_v++}),this.uuid=vi(),this.name="",this.type="Material",this.blending=Zn,this.side=En,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ic,this.blendDst=Lc,this.blendEquation=hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Se(0,0,0),this.blendAlpha=0,this.depthFunc=ps,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ar,this.stencilZFail=Ar,this.stencilZPass=Ar,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Zn&&(i.blending=this.blending),this.side!==En&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ic&&(i.blendSrc=this.blendSrc),this.blendDst!==Lc&&(i.blendDst=this.blendDst),this.blendEquation!==hr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ps&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zd&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ar&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ar&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ar&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class hm extends Si{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Se(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=ju,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new D,Oa=new Ee;class It{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=gu,this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Oa.fromBufferAttribute(this,t),Oa.applyMatrix3(e),this.setXY(t,Oa.x,Oa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=qn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=st(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qn(t,this.array)),t}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qn(t,this.array)),t}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qn(t,this.array)),t}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),i=st(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array),s=st(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==gu&&(e.usage=this.usage),e}}class fm extends It{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class pm extends It{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class cn extends It{constructor(e,t,i){super(new Float32Array(e),t,i)}}let wv=0;const Pn=new ot,Yl=new Mt,Br=new D,xn=new xa,Ps=new xa,Ft=new D;class Jt extends Mr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wv++}),this.uuid=vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(lm(e)?pm:fm)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ue().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,i){return Pn.makeTranslation(e,t,i),this.applyMatrix4(Pn),this}scale(e,t,i){return Pn.makeScale(e,t,i),this.applyMatrix4(Pn),this}lookAt(e){return Yl.lookAt(e),Yl.updateMatrix(),this.applyMatrix4(Yl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Br).negate(),this.translate(Br.x,Br.y,Br.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new cn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];xn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ba);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(xn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(xn.min,Ps.min),xn.expandByPoint(Ft),Ft.addVectors(xn.max,Ps.max),xn.expandByPoint(Ft)):(xn.expandByPoint(Ps.min),xn.expandByPoint(Ps.max))}xn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Ft.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ft));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Ft.fromBufferAttribute(o,c),l&&(Br.fromBufferAttribute(e,c),Ft.add(Br)),r=Math.max(r,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new It(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let A=0;A<i.count;A++)o[A]=new D,l[A]=new D;const c=new D,d=new D,h=new D,f=new Ee,p=new Ee,g=new Ee,x=new D,m=new D;function u(A,w,_){c.fromBufferAttribute(i,A),d.fromBufferAttribute(i,w),h.fromBufferAttribute(i,_),f.fromBufferAttribute(s,A),p.fromBufferAttribute(s,w),g.fromBufferAttribute(s,_),d.sub(c),h.sub(c),p.sub(f),g.sub(f);const R=1/(p.x*g.y-g.x*p.y);isFinite(R)&&(x.copy(d).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(R),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(R),o[A].add(x),o[w].add(x),o[_].add(x),l[A].add(m),l[w].add(m),l[_].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let A=0,w=y.length;A<w;++A){const _=y[A],R=_.start,U=_.count;for(let L=R,O=R+U;L<O;L+=3)u(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const b=new D,v=new D,M=new D,S=new D;function E(A){M.fromBufferAttribute(r,A),S.copy(M);const w=o[A];b.copy(w),b.sub(M.multiplyScalar(M.dot(w))).normalize(),v.crossVectors(S,w);const R=v.dot(l[A])<0?-1:1;a.setXYZW(A,b.x,b.y,b.z,R)}for(let A=0,w=y.length;A<w;++A){const _=y[A],R=_.start,U=_.count;for(let L=R,O=R+U;L<O;L+=3)E(e.getX(L+0)),E(e.getX(L+1)),E(e.getX(L+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new It(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new D,s=new D,a=new D,o=new D,l=new D,c=new D,d=new D,h=new D;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),x=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(d),l.add(d),c.add(d),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,s),h.subVectors(r,s),d.cross(h),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ft.fromBufferAttribute(e,t),Ft.normalize(),e.setXYZ(t,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,h=o.normalized,f=new c.constructor(l.length*d);let p=0,g=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?p=l[x]*o.data.stride+o.offset:p=l[x]*d;for(let u=0;u<d;u++)f[g++]=c[p++]}return new It(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Jt,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let d=0,h=c.length;d<h;d++){const f=c[d],p=e(f,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let f=0,p=h.length;f<p;f++)d.push(h[f].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const fh=new ot,sr=new ml,za=new ba,ph=new D,ka=new D,Ga=new D,Va=new D,jl=new D,Ha=new D,mh=new D,Wa=new D;class Gt extends Mt{constructor(e=new Jt,t=new hm){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Ha.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=o[l],h=s[l];d!==0&&(jl.fromBufferAttribute(h,e),a?Ha.addScaledVector(jl,d):Ha.addScaledVector(jl.sub(t),d))}t.add(Ha)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),za.copy(i.boundingSphere),za.applyMatrix4(s),sr.copy(e.ray).recast(e.near),!(za.containsPoint(sr.origin)===!1&&(sr.intersectSphere(za,ph)===null||sr.origin.distanceToSquared(ph)>(e.far-e.near)**2))&&(fh.copy(s).invert(),sr.copy(e.ray).applyMatrix4(fh),!(i.boundingBox!==null&&sr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,sr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const m=f[g],u=a[m.materialIndex],y=Math.max(m.start,p.start),b=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=y,M=b;v<M;v+=3){const S=o.getX(v),E=o.getX(v+1),A=o.getX(v+2);r=qa(this,u,e,i,c,d,h,S,E,A),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let m=g,u=x;m<u;m+=3){const y=o.getX(m),b=o.getX(m+1),v=o.getX(m+2);r=qa(this,a,e,i,c,d,h,y,b,v),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,x=f.length;g<x;g++){const m=f[g],u=a[m.materialIndex],y=Math.max(m.start,p.start),b=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=y,M=b;v<M;v+=3){const S=v,E=v+1,A=v+2;r=qa(this,u,e,i,c,d,h,S,E,A),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=g,u=x;m<u;m+=3){const y=m,b=m+1,v=m+2;r=qa(this,a,e,i,c,d,h,y,b,v),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Sv(n,e,t,i,r,s,a,o){let l;if(e.side===on?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===En,o),l===null)return null;Wa.copy(o),Wa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Wa);return c<t.near||c>t.far?null:{distance:c,point:Wa.clone(),object:n}}function qa(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,ka),n.getVertexPosition(l,Ga),n.getVertexPosition(c,Va);const d=Sv(n,e,t,i,ka,Ga,Va,mh);if(d){const h=new D;Un.getBarycoord(mh,ka,Ga,Va,h),r&&(d.uv=Un.getInterpolatedAttribute(r,o,l,c,h,new Ee)),s&&(d.uv1=Un.getInterpolatedAttribute(s,o,l,c,h,new Ee)),a&&(d.normal=Un.getInterpolatedAttribute(a,o,l,c,h,new D),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new D,materialIndex:0};Un.getNormal(ka,Ga,Va,f.normal),d.face=f,d.barycoord=h}return d}class _a extends Jt{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],d=[],h=[];let f=0,p=0;g("z","y","x",-1,-1,i,t,e,a,s,0),g("z","y","x",1,-1,i,t,-e,a,s,1),g("x","z","y",1,1,e,i,t,r,a,2),g("x","z","y",1,-1,e,i,-t,r,a,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new cn(c,3)),this.setAttribute("normal",new cn(d,3)),this.setAttribute("uv",new cn(h,2));function g(x,m,u,y,b,v,M,S,E,A,w){const _=v/E,R=M/A,U=v/2,L=M/2,O=S/2,V=E+1,k=A+1;let H=0,z=0;const Y=new D;for(let ne=0;ne<k;ne++){const le=ne*R-L;for(let oe=0;oe<V;oe++){const ge=oe*_-U;Y[x]=ge*y,Y[m]=le*b,Y[u]=O,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[m]=0,Y[u]=S>0?1:-1,d.push(Y.x,Y.y,Y.z),h.push(oe/E),h.push(1-ne/A),H+=1}}for(let ne=0;ne<A;ne++)for(let le=0;le<E;le++){const oe=f+le+V*ne,ge=f+le+V*(ne+1),X=f+(le+1)+V*(ne+1),K=f+(le+1)+V*ne;l.push(oe,ge,K),l.push(ge,X,K),z+=6}o.addGroup(p,z,w),p+=z,f+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _a(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function bs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function nn(n){const e={};for(let t=0;t<n.length;t++){const i=bs(n[t]);for(const r in i)e[r]=i[r]}return e}function Mv(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function mm(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Ev={clone:bs,merge:nn};var Tv=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Av=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vt extends Si{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tv,this.fragmentShader=Av,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=bs(e.uniforms),this.uniformsGroups=Mv(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class gm extends Mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=gi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Di=new D,gh=new Ee,vh=new Ee;class In extends gm{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=da*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return da*2*Math.atan(Math.tan(Qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,gh,vh),t.subVectors(vh,gh)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qs*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Or=-90,zr=1;class Cv extends Mt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new In(Or,zr,e,t);r.layers=this.layers,this.add(r);const s=new In(Or,zr,e,t);s.layers=this.layers,this.add(s);const a=new In(Or,zr,e,t);a.layers=this.layers,this.add(a);const o=new In(Or,zr,e,t);o.layers=this.layers,this.add(o);const l=new In(Or,zr,e,t);l.layers=this.layers,this.add(l);const c=new In(Or,zr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===gi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ko)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,d),e.setRenderTarget(h,f,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class vm extends ln{constructor(e,t,i,r,s,a,o,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:ms,super(e,t,i,r,s,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Rv extends br{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new vm(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:it}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new _a(5,5,5),s=new Vt({name:"CubemapFromEquirect",uniforms:bs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:on,blending:zi});s.uniforms.tEquirect.value=t;const a=new Gt(r,s),o=t.minFilter;return t.minFilter===pr&&(t.minFilter=it),new Cv(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}class sd{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Se(e),this.near=t,this.far=i}clone(){return new sd(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Pv extends Mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Dv{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=gu,this.updateRanges=[],this.version=0,this.uuid=vi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const tn=new D;class Ho{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=qn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=st(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=st(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=qn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=qn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=qn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=qn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),i=st(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=st(t,this.array),i=st(i,this.array),r=st(r,this.array),s=st(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new It(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ho(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class ym extends Si{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let kr;const Ds=new D,Gr=new D,Vr=new D,Hr=new Ee,Is=new Ee,xm=new ot,Xa=new D,Ls=new D,$a=new D,yh=new Ee,Kl=new Ee,xh=new Ee;class Iv extends Mt{constructor(e=new ym){if(super(),this.isSprite=!0,this.type="Sprite",kr===void 0){kr=new Jt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Dv(t,5);kr.setIndex([0,1,2,0,2,3]),kr.setAttribute("position",new Ho(i,3,0,!1)),kr.setAttribute("uv",new Ho(i,2,3,!1))}this.geometry=kr,this.material=e,this.center=new Ee(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gr.setFromMatrixScale(this.matrixWorld),xm.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Vr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gr.multiplyScalar(-Vr.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;Ya(Xa.set(-.5,-.5,0),Vr,a,Gr,r,s),Ya(Ls.set(.5,-.5,0),Vr,a,Gr,r,s),Ya($a.set(.5,.5,0),Vr,a,Gr,r,s),yh.set(0,0),Kl.set(1,0),xh.set(1,1);let o=e.ray.intersectTriangle(Xa,Ls,$a,!1,Ds);if(o===null&&(Ya(Ls.set(-.5,.5,0),Vr,a,Gr,r,s),Kl.set(0,1),o=e.ray.intersectTriangle(Xa,$a,Ls,!1,Ds),o===null))return;const l=e.ray.origin.distanceTo(Ds);l<e.near||l>e.far||t.push({distance:l,point:Ds.clone(),uv:Un.getInterpolation(Ds,Xa,Ls,$a,yh,Kl,xh,new Ee),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Ya(n,e,t,i,r,s){Hr.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(Is.x=s*Hr.x-r*Hr.y,Is.y=r*Hr.x+s*Hr.y):Is.copy(Hr),n.copy(e),n.x+=Is.x,n.y+=Is.y,n.applyMatrix4(xm)}class ti extends ln{constructor(e=null,t=1,i=1,r,s,a,o,l,c=Dt,d=Dt,h,f){super(null,a,o,l,c,d,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wo extends It{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ql=new D,Lv=new D,Uv=new Ue;class cr{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ql.subVectors(i,t).cross(Lv.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ql),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Uv.getNormalMatrix(e),r=this.coplanarPoint(Ql).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ar=new ba,ja=new D;class ad{constructor(e=new cr,t=new cr,i=new cr,r=new cr,s=new cr,a=new cr){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=gi){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],d=r[5],h=r[6],f=r[7],p=r[8],g=r[9],x=r[10],m=r[11],u=r[12],y=r[13],b=r[14],v=r[15];if(i[0].setComponents(l-s,f-c,m-p,v-u).normalize(),i[1].setComponents(l+s,f+c,m+p,v+u).normalize(),i[2].setComponents(l+a,f+d,m+g,v+y).normalize(),i[3].setComponents(l-a,f-d,m-g,v-y).normalize(),i[4].setComponents(l-o,f-h,m-x,v-b).normalize(),t===gi)i[5].setComponents(l+o,f+h,m+x,v+b).normalize();else if(t===ko)i[5].setComponents(o,h,x,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ar.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ar.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ar)}intersectsSprite(e){return ar.center.set(0,0,0),ar.radius=.7071067811865476,ar.applyMatrix4(e.matrixWorld),this.intersectsSphere(ar)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(ja.x=r.normal.x>0?e.max.x:e.min.x,ja.y=r.normal.y>0?e.max.y:e.min.y,ja.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ja)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class od extends Si{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Se(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const qo=new D,Xo=new D,bh=new ot,Us=new ml,Ka=new ba,Zl=new D,_h=new D;class Nv extends Mt{constructor(e=new Jt,t=new od){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)qo.fromBufferAttribute(t,r-1),Xo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=qo.distanceTo(Xo);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ka.copy(i.boundingSphere),Ka.applyMatrix4(r),Ka.radius+=s,e.ray.intersectsSphere(Ka)===!1)return;bh.copy(r).invert(),Us.copy(e.ray).applyMatrix4(bh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,f=i.attributes.position;if(d!==null){const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let x=p,m=g-1;x<m;x+=c){const u=d.getX(x),y=d.getX(x+1),b=Qa(this,e,Us,l,u,y);b&&t.push(b)}if(this.isLineLoop){const x=d.getX(g-1),m=d.getX(p),u=Qa(this,e,Us,l,x,m);u&&t.push(u)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let x=p,m=g-1;x<m;x+=c){const u=Qa(this,e,Us,l,x,x+1);u&&t.push(u)}if(this.isLineLoop){const x=Qa(this,e,Us,l,g-1,p);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Qa(n,e,t,i,r,s){const a=n.geometry.attributes.position;if(qo.fromBufferAttribute(a,r),Xo.fromBufferAttribute(a,s),t.distanceSqToSegment(qo,Xo,Zl,_h)>i)return;Zl.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Zl);if(!(l<e.near||l>e.far))return{distance:l,point:_h.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const wh=new D,Sh=new D;class bm extends Nv{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)wh.fromBufferAttribute(t,r),Sh.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+wh.distanceTo(Sh);e.setAttribute("lineDistance",new cn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class _m extends Si{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Se(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Mh=new ot,vu=new ml,Za=new ba,Ja=new D;class Fv extends Mt{constructor(e=new Jt,t=new _m){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Za.copy(i.boundingSphere),Za.applyMatrix4(r),Za.radius+=s,e.ray.intersectsSphere(Za)===!1)return;Mh.copy(r).invert(),vu.copy(e.ray).applyMatrix4(Mh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=f,x=p;g<x;g++){const m=c.getX(g);Ja.fromBufferAttribute(h,m),Eh(Ja,m,l,r,e,t,this)}}else{const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=f,x=p;g<x;g++)Ja.fromBufferAttribute(h,g),Eh(Ja,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Eh(n,e,t,i,r,s,a){const o=vu.distanceSqToPoint(n);if(o<t){const l=new D;vu.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Qr extends Mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}class wm extends ln{constructor(e,t,i,r,s,a,o,l,c,d=ss){if(d!==ss&&d!==ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===ss&&(i=xr),i===void 0&&d===ys&&(i=vs),super(null,r,s,a,o,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Dt,this.minFilter=l!==void 0?l:Dt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ld extends Jt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],a=[];o(r),c(i),d(),this.setAttribute("position",new cn(s,3)),this.setAttribute("normal",new cn(s.slice(),3)),this.setAttribute("uv",new cn(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const b=new D,v=new D,M=new D;for(let S=0;S<t.length;S+=3)p(t[S+0],b),p(t[S+1],v),p(t[S+2],M),l(b,v,M,y)}function l(y,b,v,M){const S=M+1,E=[];for(let A=0;A<=S;A++){E[A]=[];const w=y.clone().lerp(v,A/S),_=b.clone().lerp(v,A/S),R=S-A;for(let U=0;U<=R;U++)U===0&&A===S?E[A][U]=w:E[A][U]=w.clone().lerp(_,U/R)}for(let A=0;A<S;A++)for(let w=0;w<2*(S-A)-1;w++){const _=Math.floor(w/2);w%2===0?(f(E[A][_+1]),f(E[A+1][_]),f(E[A][_])):(f(E[A][_+1]),f(E[A+1][_+1]),f(E[A+1][_]))}}function c(y){const b=new D;for(let v=0;v<s.length;v+=3)b.x=s[v+0],b.y=s[v+1],b.z=s[v+2],b.normalize().multiplyScalar(y),s[v+0]=b.x,s[v+1]=b.y,s[v+2]=b.z}function d(){const y=new D;for(let b=0;b<s.length;b+=3){y.x=s[b+0],y.y=s[b+1],y.z=s[b+2];const v=m(y)/2/Math.PI+.5,M=u(y)/Math.PI+.5;a.push(v,1-M)}g(),h()}function h(){for(let y=0;y<a.length;y+=6){const b=a[y+0],v=a[y+2],M=a[y+4],S=Math.max(b,v,M),E=Math.min(b,v,M);S>.9&&E<.1&&(b<.2&&(a[y+0]+=1),v<.2&&(a[y+2]+=1),M<.2&&(a[y+4]+=1))}}function f(y){s.push(y.x,y.y,y.z)}function p(y,b){const v=y*3;b.x=e[v+0],b.y=e[v+1],b.z=e[v+2]}function g(){const y=new D,b=new D,v=new D,M=new D,S=new Ee,E=new Ee,A=new Ee;for(let w=0,_=0;w<s.length;w+=9,_+=6){y.set(s[w+0],s[w+1],s[w+2]),b.set(s[w+3],s[w+4],s[w+5]),v.set(s[w+6],s[w+7],s[w+8]),S.set(a[_+0],a[_+1]),E.set(a[_+2],a[_+3]),A.set(a[_+4],a[_+5]),M.copy(y).add(b).add(v).divideScalar(3);const R=m(M);x(S,_+0,y,R),x(E,_+2,b,R),x(A,_+4,v,R)}}function x(y,b,v,M){M<0&&y.x===1&&(a[b]=y.x-1),v.x===0&&v.z===0&&(a[b]=M/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function u(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ld(e.vertices,e.indices,e.radius,e.details)}}class Ji extends ld{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ji(e.radius,e.detail)}}class Ss extends Jt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,d=l+1,h=e/o,f=t/l,p=[],g=[],x=[],m=[];for(let u=0;u<d;u++){const y=u*f-a;for(let b=0;b<c;b++){const v=b*h-s;g.push(v,-y,0),x.push(0,0,1),m.push(b/o),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let y=0;y<o;y++){const b=y+c*u,v=y+c*(u+1),M=y+1+c*(u+1),S=y+1+c*u;p.push(b,v,S),p.push(v,M,S)}this.setIndex(p),this.setAttribute("position",new cn(g,3)),this.setAttribute("normal",new cn(x,3)),this.setAttribute("uv",new cn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ss(e.width,e.height,e.widthSegments,e.heightSegments)}}class cd extends Jt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const d=[],h=new D,f=new D,p=[],g=[],x=[],m=[];for(let u=0;u<=i;u++){const y=[],b=u/i;let v=0;u===0&&a===0?v=.5/t:u===i&&l===Math.PI&&(v=-.5/t);for(let M=0;M<=t;M++){const S=M/t;h.x=-e*Math.cos(r+S*s)*Math.sin(a+b*o),h.y=e*Math.cos(a+b*o),h.z=e*Math.sin(r+S*s)*Math.sin(a+b*o),g.push(h.x,h.y,h.z),f.copy(h).normalize(),x.push(f.x,f.y,f.z),m.push(S+v,1-b),y.push(c++)}d.push(y)}for(let u=0;u<i;u++)for(let y=0;y<t;y++){const b=d[u][y+1],v=d[u][y],M=d[u+1][y],S=d[u+1][y+1];(u!==0||a>0)&&p.push(b,v,S),(u!==i-1||l<Math.PI)&&p.push(v,M,S)}this.setIndex(p),this.setAttribute("position",new cn(g,3)),this.setAttribute("normal",new cn(x,3)),this.setAttribute("uv",new cn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cd(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Bv extends Si{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Se(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ov extends Si{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new Se(16777215),this.specular=new Se(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Se(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nd,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=ju,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class zv extends Si{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ig,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class kv extends Si{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Sm extends Mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Se(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Gv extends Sm{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Se(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Jl=new ot,Th=new D,Ah=new D;class Vv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ad,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Th.setFromMatrixPosition(e.matrixWorld),t.position.copy(Th),Ah.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ah),t.updateMatrixWorld(),Jl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jl),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Jl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Mm extends gm{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Hv extends Vv{constructor(){super(new Mm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Wv extends Sm{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Mt.DEFAULT_UP),this.updateMatrix(),this.target=new Mt,this.shadow=new Hv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Em extends Jt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class qv extends In{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ch(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Ch();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Ch(){return performance.now()}const Rh=new ot;class yu{constructor(e,t,i=0,r=1/0){this.ray=new ml(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new rd,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Rh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Rh),this}intersectObject(e,t=!0,i=[]){return xu(e,this,i,t),i.sort(Ph),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)xu(e[r],this,i,t);return i.sort(Ph),i}}function Ph(n,e){return n.distance-e.distance}function xu(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let a=0,o=s.length;a<o;a++)xu(s[a],e,t,!0)}}class $v extends Mr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}function Dh(n,e,t,i){const r=Yv(i);switch(t){case em:return n*e;case nm:return n*e;case im:return n*e*2;case rm:return n*e/r.components*r.byteLength;case Ju:return n*e/r.components*r.byteLength;case sm:return n*e*2/r.components*r.byteLength;case ed:return n*e*2/r.components*r.byteLength;case tm:return n*e*3/r.components*r.byteLength;case St:return n*e*4/r.components*r.byteLength;case td:return n*e*4/r.components*r.byteLength;case yo:case xo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case bo:case _o:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case qc:case $c:return Math.max(n,16)*Math.max(e,8)/4;case Wc:case Xc:return Math.max(n,8)*Math.max(e,8)/2;case Yc:case jc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Kc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Qc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Zc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case eu:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case tu:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case nu:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case iu:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case ru:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case su:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case au:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ou:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case lu:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case cu:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case uu:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case wo:case du:case hu:return Math.ceil(n/4)*Math.ceil(e/4)*16;case am:case fu:return Math.ceil(n/4)*Math.ceil(e/4)*8;case pu:case mu:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yv(n){switch(n){case Lt:case Qp:return{byteLength:1,components:1};case ua:case Zp:case ya:return{byteLength:2,components:1};case Qu:case Zu:return{byteLength:2,components:4};case xr:case Ku:case mi:return{byteLength:4,components:1};case Jp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Yu}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Yu);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Tm(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function jv(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,h=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const d=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,d);else{h.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<h.length;p++){const g=h[f],x=h[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,h[f]=x)}h.length=f+1;for(let p=0,g=h.length;p<g;p++){const x=h[p];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var Kv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qv=`#ifdef USE_ALPHAHASH
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
#endif`,Zv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ey=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ty=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ny=`#ifdef USE_AOMAP
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
#endif`,iy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ry=`#ifdef USE_BATCHING
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
#endif`,sy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ay=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,oy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ly=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,cy=`#ifdef USE_IRIDESCENCE
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
#endif`,uy=`#ifdef USE_BUMPMAP
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
#endif`,dy=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,hy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,py=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,my=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,gy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yy=`#if defined( USE_COLOR_ALPHA )
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
#endif`,xy=`#define PI 3.141592653589793
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
} // validated`,by=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,_y=`vec3 transformedNormal = objectNormal;
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
#endif`,wy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Sy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,My=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ey=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ty="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ay=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cy=`#ifdef USE_ENVMAP
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
#endif`,Ry=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Py=`#ifdef USE_ENVMAP
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
#endif`,Dy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Iy=`#ifdef USE_ENVMAP
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
#endif`,Ly=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Uy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ny=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Fy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,By=`#ifdef USE_GRADIENTMAP
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
}`,Oy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ky=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gy=`uniform bool receiveShadow;
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
#endif`,Vy=`#ifdef USE_ENVMAP
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
#endif`,Hy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Xy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$y=`PhysicalMaterial material;
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
#endif`,Yy=`struct PhysicalMaterial {
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
}`,jy=`
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
#endif`,Ky=`#if defined( RE_IndirectDiffuse )
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
#endif`,Qy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Jy=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ex=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tx=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,nx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ix=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,sx=`#if defined( USE_POINTS_UV )
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
#endif`,ax=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ox=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,cx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ux=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dx=`#ifdef USE_MORPHTARGETS
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
#endif`,hx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,px=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,mx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yx=`#ifdef USE_NORMALMAP
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
#endif`,xx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_x=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ex=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ax=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Px=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ix=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Lx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Ux=`float getShadowMask() {
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
}`,Nx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fx=`#ifdef USE_SKINNING
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
#endif`,Bx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ox=`#ifdef USE_SKINNING
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
#endif`,zx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hx=`#ifdef USE_TRANSMISSION
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
#endif`,Wx=`#ifdef USE_TRANSMISSION
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
#endif`,qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$x=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kx=`uniform sampler2D t2D;
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
}`,Qx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eb=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tb=`#include <common>
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
}`,nb=`#if DEPTH_PACKING == 3200
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
}`,ib=`#define DISTANCE
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
}`,rb=`#define DISTANCE
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
}`,sb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ab=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ob=`uniform float scale;
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
}`,lb=`uniform vec3 diffuse;
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
}`,cb=`#include <common>
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
}`,ub=`uniform vec3 diffuse;
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
}`,db=`#define LAMBERT
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
}`,hb=`#define LAMBERT
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
}`,fb=`#define MATCAP
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
}`,pb=`#define MATCAP
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
}`,mb=`#define NORMAL
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
}`,gb=`#define NORMAL
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
}`,vb=`#define PHONG
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
}`,yb=`#define PHONG
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
}`,xb=`#define STANDARD
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
}`,bb=`#define STANDARD
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
}`,_b=`#define TOON
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
}`,wb=`#define TOON
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
}`,Sb=`uniform float size;
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
}`,Mb=`uniform vec3 diffuse;
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
}`,Eb=`#include <common>
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
}`,Tb=`uniform vec3 color;
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
}`,Ab=`uniform float rotation;
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
}`,Cb=`uniform vec3 diffuse;
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
}`,ke={alphahash_fragment:Kv,alphahash_pars_fragment:Qv,alphamap_fragment:Zv,alphamap_pars_fragment:Jv,alphatest_fragment:ey,alphatest_pars_fragment:ty,aomap_fragment:ny,aomap_pars_fragment:iy,batching_pars_vertex:ry,batching_vertex:sy,begin_vertex:ay,beginnormal_vertex:oy,bsdfs:ly,iridescence_fragment:cy,bumpmap_pars_fragment:uy,clipping_planes_fragment:dy,clipping_planes_pars_fragment:hy,clipping_planes_pars_vertex:fy,clipping_planes_vertex:py,color_fragment:my,color_pars_fragment:gy,color_pars_vertex:vy,color_vertex:yy,common:xy,cube_uv_reflection_fragment:by,defaultnormal_vertex:_y,displacementmap_pars_vertex:wy,displacementmap_vertex:Sy,emissivemap_fragment:My,emissivemap_pars_fragment:Ey,colorspace_fragment:Ty,colorspace_pars_fragment:Ay,envmap_fragment:Cy,envmap_common_pars_fragment:Ry,envmap_pars_fragment:Py,envmap_pars_vertex:Dy,envmap_physical_pars_fragment:Vy,envmap_vertex:Iy,fog_vertex:Ly,fog_pars_vertex:Uy,fog_fragment:Ny,fog_pars_fragment:Fy,gradientmap_pars_fragment:By,lightmap_pars_fragment:Oy,lights_lambert_fragment:zy,lights_lambert_pars_fragment:ky,lights_pars_begin:Gy,lights_toon_fragment:Hy,lights_toon_pars_fragment:Wy,lights_phong_fragment:qy,lights_phong_pars_fragment:Xy,lights_physical_fragment:$y,lights_physical_pars_fragment:Yy,lights_fragment_begin:jy,lights_fragment_maps:Ky,lights_fragment_end:Qy,logdepthbuf_fragment:Zy,logdepthbuf_pars_fragment:Jy,logdepthbuf_pars_vertex:ex,logdepthbuf_vertex:tx,map_fragment:nx,map_pars_fragment:ix,map_particle_fragment:rx,map_particle_pars_fragment:sx,metalnessmap_fragment:ax,metalnessmap_pars_fragment:ox,morphinstance_vertex:lx,morphcolor_vertex:cx,morphnormal_vertex:ux,morphtarget_pars_vertex:dx,morphtarget_vertex:hx,normal_fragment_begin:fx,normal_fragment_maps:px,normal_pars_fragment:mx,normal_pars_vertex:gx,normal_vertex:vx,normalmap_pars_fragment:yx,clearcoat_normal_fragment_begin:xx,clearcoat_normal_fragment_maps:bx,clearcoat_pars_fragment:_x,iridescence_pars_fragment:wx,opaque_fragment:Sx,packing:Mx,premultiplied_alpha_fragment:Ex,project_vertex:Tx,dithering_fragment:Ax,dithering_pars_fragment:Cx,roughnessmap_fragment:Rx,roughnessmap_pars_fragment:Px,shadowmap_pars_fragment:Dx,shadowmap_pars_vertex:Ix,shadowmap_vertex:Lx,shadowmask_pars_fragment:Ux,skinbase_vertex:Nx,skinning_pars_vertex:Fx,skinning_vertex:Bx,skinnormal_vertex:Ox,specularmap_fragment:zx,specularmap_pars_fragment:kx,tonemapping_fragment:Gx,tonemapping_pars_fragment:Vx,transmission_fragment:Hx,transmission_pars_fragment:Wx,uv_pars_fragment:qx,uv_pars_vertex:Xx,uv_vertex:$x,worldpos_vertex:Yx,background_vert:jx,background_frag:Kx,backgroundCube_vert:Qx,backgroundCube_frag:Zx,cube_vert:Jx,cube_frag:eb,depth_vert:tb,depth_frag:nb,distanceRGBA_vert:ib,distanceRGBA_frag:rb,equirect_vert:sb,equirect_frag:ab,linedashed_vert:ob,linedashed_frag:lb,meshbasic_vert:cb,meshbasic_frag:ub,meshlambert_vert:db,meshlambert_frag:hb,meshmatcap_vert:fb,meshmatcap_frag:pb,meshnormal_vert:mb,meshnormal_frag:gb,meshphong_vert:vb,meshphong_frag:yb,meshphysical_vert:xb,meshphysical_frag:bb,meshtoon_vert:_b,meshtoon_frag:wb,points_vert:Sb,points_frag:Mb,shadow_vert:Eb,shadow_frag:Tb,sprite_vert:Ab,sprite_frag:Cb},ce={common:{diffuse:{value:new Se(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Se(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Se(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new Se(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},jn={basic:{uniforms:nn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:ke.meshbasic_vert,fragmentShader:ke.meshbasic_frag},lambert:{uniforms:nn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Se(0)}}]),vertexShader:ke.meshlambert_vert,fragmentShader:ke.meshlambert_frag},phong:{uniforms:nn([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Se(0)},specular:{value:new Se(1118481)},shininess:{value:30}}]),vertexShader:ke.meshphong_vert,fragmentShader:ke.meshphong_frag},standard:{uniforms:nn([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Se(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag},toon:{uniforms:nn([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Se(0)}}]),vertexShader:ke.meshtoon_vert,fragmentShader:ke.meshtoon_frag},matcap:{uniforms:nn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:ke.meshmatcap_vert,fragmentShader:ke.meshmatcap_frag},points:{uniforms:nn([ce.points,ce.fog]),vertexShader:ke.points_vert,fragmentShader:ke.points_frag},dashed:{uniforms:nn([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ke.linedashed_vert,fragmentShader:ke.linedashed_frag},depth:{uniforms:nn([ce.common,ce.displacementmap]),vertexShader:ke.depth_vert,fragmentShader:ke.depth_frag},normal:{uniforms:nn([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:ke.meshnormal_vert,fragmentShader:ke.meshnormal_frag},sprite:{uniforms:nn([ce.sprite,ce.fog]),vertexShader:ke.sprite_vert,fragmentShader:ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ke.background_vert,fragmentShader:ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:ke.backgroundCube_vert,fragmentShader:ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ke.cube_vert,fragmentShader:ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ke.equirect_vert,fragmentShader:ke.equirect_frag},distanceRGBA:{uniforms:nn([ce.common,ce.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ke.distanceRGBA_vert,fragmentShader:ke.distanceRGBA_frag},shadow:{uniforms:nn([ce.lights,ce.fog,{color:{value:new Se(0)},opacity:{value:1}}]),vertexShader:ke.shadow_vert,fragmentShader:ke.shadow_frag}};jn.physical={uniforms:nn([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new Se(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new Se(0)},specularColor:{value:new Se(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:ke.meshphysical_vert,fragmentShader:ke.meshphysical_frag};const eo={r:0,b:0,g:0},or=new Yn,Rb=new ot;function Pb(n,e,t,i,r,s,a){const o=new Se(0);let l=s===!0?0:1,c,d,h=null,f=0,p=null;function g(b){let v=b.isScene===!0?b.background:null;return v&&v.isTexture&&(v=(b.backgroundBlurriness>0?t:e).get(v)),v}function x(b){let v=!1;const M=g(b);M===null?u(o,l):M&&M.isColor&&(u(M,1),v=!0);const S=n.xr.getEnvironmentBlendMode();S==="additive"?i.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(b,v){const M=g(v);M&&(M.isCubeTexture||M.mapping===pl)?(d===void 0&&(d=new Gt(new _a(1,1,1),new Vt({name:"BackgroundCubeMaterial",uniforms:bs(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),or.copy(v.backgroundRotation),or.x*=-1,or.y*=-1,or.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(or.y*=-1,or.z*=-1),d.material.uniforms.envMap.value=M,d.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Rb.makeRotationFromEuler(or)),d.material.toneMapped=Je.getTransfer(M.colorSpace)!==at,(h!==M||f!==M.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,h=M,f=M.version,p=n.toneMapping),d.layers.enableAll(),b.unshift(d,d.geometry,d.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new Gt(new Ss(2,2),new Vt({name:"BackgroundMaterial",uniforms:bs(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:En,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Je.getTransfer(M.colorSpace)!==at,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||f!==M.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,f=M.version,p=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function u(b,v){b.getRGB(eo,mm(n)),i.buffers.color.setClear(eo.r,eo.g,eo.b,v,a)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose()),c!==void 0&&(c.geometry.dispose(),c.material.dispose())}return{getClearColor:function(){return o},setClearColor:function(b,v=1){o.set(b),l=v,u(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,u(o,l)},render:x,addToRenderList:m,dispose:y}}function Db(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(_,R,U,L,O){let V=!1;const k=h(L,U,R);s!==k&&(s=k,c(s.object)),V=p(_,L,U,O),V&&g(_,L,U,O),O!==null&&e.update(O,n.ELEMENT_ARRAY_BUFFER),(V||a)&&(a=!1,v(_,R,U,L),O!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return n.createVertexArray()}function c(_){return n.bindVertexArray(_)}function d(_){return n.deleteVertexArray(_)}function h(_,R,U){const L=U.wireframe===!0;let O=i[_.id];O===void 0&&(O={},i[_.id]=O);let V=O[R.id];V===void 0&&(V={},O[R.id]=V);let k=V[L];return k===void 0&&(k=f(l()),V[L]=k),k}function f(_){const R=[],U=[],L=[];for(let O=0;O<t;O++)R[O]=0,U[O]=0,L[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:U,attributeDivisors:L,object:_,attributes:{},index:null}}function p(_,R,U,L){const O=s.attributes,V=R.attributes;let k=0;const H=U.getAttributes();for(const z in H)if(H[z].location>=0){const ne=O[z];let le=V[z];if(le===void 0&&(z==="instanceMatrix"&&_.instanceMatrix&&(le=_.instanceMatrix),z==="instanceColor"&&_.instanceColor&&(le=_.instanceColor)),ne===void 0||ne.attribute!==le||le&&ne.data!==le.data)return!0;k++}return s.attributesNum!==k||s.index!==L}function g(_,R,U,L){const O={},V=R.attributes;let k=0;const H=U.getAttributes();for(const z in H)if(H[z].location>=0){let ne=V[z];ne===void 0&&(z==="instanceMatrix"&&_.instanceMatrix&&(ne=_.instanceMatrix),z==="instanceColor"&&_.instanceColor&&(ne=_.instanceColor));const le={};le.attribute=ne,ne&&ne.data&&(le.data=ne.data),O[z]=le,k++}s.attributes=O,s.attributesNum=k,s.index=L}function x(){const _=s.newAttributes;for(let R=0,U=_.length;R<U;R++)_[R]=0}function m(_){u(_,0)}function u(_,R){const U=s.newAttributes,L=s.enabledAttributes,O=s.attributeDivisors;U[_]=1,L[_]===0&&(n.enableVertexAttribArray(_),L[_]=1),O[_]!==R&&(n.vertexAttribDivisor(_,R),O[_]=R)}function y(){const _=s.newAttributes,R=s.enabledAttributes;for(let U=0,L=R.length;U<L;U++)R[U]!==_[U]&&(n.disableVertexAttribArray(U),R[U]=0)}function b(_,R,U,L,O,V,k){k===!0?n.vertexAttribIPointer(_,R,U,O,V):n.vertexAttribPointer(_,R,U,L,O,V)}function v(_,R,U,L){x();const O=L.attributes,V=U.getAttributes(),k=R.defaultAttributeValues;for(const H in V){const z=V[H];if(z.location>=0){let Y=O[H];if(Y===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(Y=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(Y=_.instanceColor)),Y!==void 0){const ne=Y.normalized,le=Y.itemSize,oe=e.get(Y);if(oe===void 0)continue;const ge=oe.buffer,X=oe.type,K=oe.bytesPerElement,ie=X===n.INT||X===n.UNSIGNED_INT||Y.gpuType===Ku;if(Y.isInterleavedBufferAttribute){const ee=Y.data,ve=ee.stride,fe=Y.offset;if(ee.isInstancedInterleavedBuffer){for(let Ge=0;Ge<z.locationSize;Ge++)u(z.location+Ge,ee.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Ge=0;Ge<z.locationSize;Ge++)m(z.location+Ge);n.bindBuffer(n.ARRAY_BUFFER,ge);for(let Ge=0;Ge<z.locationSize;Ge++)b(z.location+Ge,le/z.locationSize,X,ne,ve*K,(fe+le/z.locationSize*Ge)*K,ie)}else{if(Y.isInstancedBufferAttribute){for(let ee=0;ee<z.locationSize;ee++)u(z.location+ee,Y.meshPerAttribute);_.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ee=0;ee<z.locationSize;ee++)m(z.location+ee);n.bindBuffer(n.ARRAY_BUFFER,ge);for(let ee=0;ee<z.locationSize;ee++)b(z.location+ee,le/z.locationSize,X,ne,le*K,le/z.locationSize*ee*K,ie)}}else if(k!==void 0){const ne=k[H];if(ne!==void 0)switch(ne.length){case 2:n.vertexAttrib2fv(z.location,ne);break;case 3:n.vertexAttrib3fv(z.location,ne);break;case 4:n.vertexAttrib4fv(z.location,ne);break;default:n.vertexAttrib1fv(z.location,ne)}}}}y()}function M(){A();for(const _ in i){const R=i[_];for(const U in R){const L=R[U];for(const O in L)d(L[O].object),delete L[O];delete R[U]}delete i[_]}}function S(_){if(i[_.id]===void 0)return;const R=i[_.id];for(const U in R){const L=R[U];for(const O in L)d(L[O].object),delete L[O];delete R[U]}delete i[_.id]}function E(_){for(const R in i){const U=i[R];if(U[_.id]===void 0)continue;const L=U[_.id];for(const O in L)d(L[O].object),delete L[O];delete U[_.id]}}function A(){w(),a=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:A,resetDefaultState:w,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:m,disableUnusedAttributes:y}}function Ib(n,e,t){let i;function r(c){i=c}function s(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function a(c,d,h){h!==0&&(n.drawArraysInstanced(i,c,d,h),t.update(d,i,h))}function o(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,h);let p=0;for(let g=0;g<h;g++)p+=d[g];t.update(p,i,1)}function l(c,d,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],d[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,d,0,f,0,h);let g=0;for(let x=0;x<h;x++)g+=d[x]*f[x];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Lb(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(E){return!(E!==St&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(E){const A=E===ya&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==Lt&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==mi&&!A)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,S=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:v,vertexTextures:M,maxSamples:S}}function Ub(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new cr,o=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=d(h,f,0)},this.setState=function(h,f,p){const g=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,u=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?d(null):c();else{const y=s?0:i,b=y*4;let v=u.clippingState||null;l.value=v,v=d(g,f,b,p);for(let M=0;M!==b;++M)v[M]=t[M];u.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,f,p,g){const x=h!==null?h.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const u=p+x*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<u)&&(m=new Float32Array(u));for(let b=0,v=p;b!==x;++b,v+=4)a.copy(h[b]).applyMatrix4(y,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function Nb(n){let e=new WeakMap;function t(a,o){return o===Gc?a.mapping=ms:o===Vc&&(a.mapping=gs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Gc||o===Vc)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Rv(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Zr=4,Ih=[.125,.215,.35,.446,.526,.582],fr=20,ec=new Mm,Lh=new Se;let tc=null,nc=0,ic=0,rc=!1;const ur=(1+Math.sqrt(5))/2,Wr=1/ur,Uh=[new D(-ur,Wr,0),new D(ur,Wr,0),new D(-Wr,0,ur),new D(Wr,0,ur),new D(0,ur,-Wr),new D(0,ur,Wr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class Nh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){tc=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(tc,nc,ic),this._renderer.xr.enabled=rc,e.scissorTest=!1,to(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ms||e.mapping===gs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),tc=this._renderer.getRenderTarget(),nc=this._renderer.getActiveCubeFace(),ic=this._renderer.getActiveMipmapLevel(),rc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:it,minFilter:it,generateMipmaps:!1,type:ya,format:St,colorSpace:xs,depthBuffer:!1},r=Fh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fh(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Fb(s)),this._blurMaterial=Bb(s,e,t)}return r}_compileMaterial(e){const t=new Gt(this._lodPlanes[0],e);this._renderer.compile(t,ec)}_sceneToCubeUV(e,t,i,r){const o=new In(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Lh),d.toneMapping=ki,d.autoClear=!1;const p=new hm({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1}),g=new Gt(new _a,p);let x=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,x=!0):(p.color.copy(Lh),x=!0);for(let u=0;u<6;u++){const y=u%3;y===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):y===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const b=this._cubeSize;to(r,y*b,u>2?b:0,b,b),d.setRenderTarget(r),x&&d.render(g,o),d.render(e,o)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=f,d.autoClear=h,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===ms||e.mapping===gs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bh());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Gt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;to(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,ec)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Uh[(r-s-1)%Uh.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new Gt(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*fr-1),x=s/g,m=isFinite(s)?1+Math.floor(d*x):fr;m>fr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${fr}`);const u=[];let y=0;for(let E=0;E<fr;++E){const A=E/x,w=Math.exp(-A*A/2);u.push(w),E===0?y+=w:E<m&&(y+=2*w)}for(let E=0;E<u.length;E++)u[E]=u[E]/y;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:b}=this;f.dTheta.value=g,f.mipInt.value=b-i;const v=this._sizeLods[r],M=3*v*(r>b-Zr?r-b+Zr:0),S=4*(this._cubeSize-v);to(t,M,S,3*v,2*v),l.setRenderTarget(t),l.render(h,ec)}}function Fb(n){const e=[],t=[],i=[];let r=n;const s=n-Zr+1+Ih.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-Zr?l=Ih[a-n+Zr-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,h=1+c,f=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,g=6,x=3,m=2,u=1,y=new Float32Array(x*g*p),b=new Float32Array(m*g*p),v=new Float32Array(u*g*p);for(let S=0;S<p;S++){const E=S%3*2/3-1,A=S>2?0:-1,w=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];y.set(w,x*g*S),b.set(f,m*g*S);const _=[S,S,S,S,S,S];v.set(_,u*g*S)}const M=new Jt;M.setAttribute("position",new It(y,x)),M.setAttribute("uv",new It(b,m)),M.setAttribute("faceIndex",new It(v,u)),e.push(M),r>Zr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Fh(n,e,t){const i=new br(n,e,t);return i.texture.mapping=pl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function to(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Bb(n,e,t){const i=new Float32Array(fr),r=new D(0,1,0);return new Vt({name:"SphericalGaussianBlur",defines:{n:fr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ud(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Bh(){return new Vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ud(),fragmentShader:`

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
		`,blending:zi,depthTest:!1,depthWrite:!1})}function Oh(){return new Vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ud(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zi,depthTest:!1,depthWrite:!1})}function ud(){return`

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
	`}function Ob(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Gc||l===Vc,d=l===ms||l===gs;if(c||d){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Nh(n)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||d&&p&&r(p)?(t===null&&(t=new Nh(n)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function zb(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&jr("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function kb(n,e,t,i){const r={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const p in f)e.update(f[p],n.ARRAY_BUFFER)}function c(h){const f=[],p=h.index,g=h.attributes.position;let x=0;if(p!==null){const y=p.array;x=p.version;for(let b=0,v=y.length;b<v;b+=3){const M=y[b+0],S=y[b+1],E=y[b+2];f.push(M,S,S,E,E,M)}}else if(g!==void 0){const y=g.array;x=g.version;for(let b=0,v=y.length/3-1;b<v;b+=3){const M=b+0,S=b+1,E=b+2;f.push(M,S,S,E,E,M)}}else return;const m=new(lm(f)?pm:fm)(f,1);m.version=x;const u=s.get(h);u&&e.remove(u),s.set(h,m)}function d(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function Gb(n,e,t){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,p){n.drawElements(i,p,s,f*a),t.update(p,i,1)}function c(f,p,g){g!==0&&(n.drawElementsInstanced(i,p,s,f*a,g),t.update(p,i,g))}function d(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,g);let m=0;for(let u=0;u<g;u++)m+=p[u];t.update(m,i,1)}function h(f,p,g,x){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/a,p[u],x[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,x,0,g);let u=0;for(let y=0;y<g;y++)u+=p[y]*x[y];t.update(u,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Vb(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Hb(n,e,t){const i=new WeakMap,r=new yt;function s(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let f=i.get(o);if(f===void 0||f.count!==h){let w=function(){E.dispose(),i.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const p=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],u=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let b=0;p===!0&&(b=1),g===!0&&(b=2),x===!0&&(b=3);let v=o.attributes.position.count*b,M=1;v>e.maxTextureSize&&(M=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const S=new Float32Array(v*M*4*h),E=new um(S,v,M,h);E.type=mi,E.needsUpdate=!0;const A=b*4;for(let _=0;_<h;_++){const R=m[_],U=u[_],L=y[_],O=v*M*4*_;for(let V=0;V<R.count;V++){const k=V*A;p===!0&&(r.fromBufferAttribute(R,V),S[O+k+0]=r.x,S[O+k+1]=r.y,S[O+k+2]=r.z,S[O+k+3]=0),g===!0&&(r.fromBufferAttribute(U,V),S[O+k+4]=r.x,S[O+k+5]=r.y,S[O+k+6]=r.z,S[O+k+7]=0),x===!0&&(r.fromBufferAttribute(L,V),S[O+k+8]=r.x,S[O+k+9]=r.y,S[O+k+10]=r.z,S[O+k+11]=L.itemSize===4?r.w:1)}}f={count:h,texture:E,size:new Ee(v,M)},i.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let x=0;x<c.length;x++)p+=c[x];const g=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function Wb(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const Am=new ln,zh=new wm(1,1),Cm=new um,Rm=new fv,Pm=new vm,kh=[],Gh=[],Vh=new Float32Array(16),Hh=new Float32Array(9),Wh=new Float32Array(4);function Ms(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=kh[r];if(s===void 0&&(s=new Float32Array(r),kh[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Ut(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Nt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function gl(n,e){let t=Gh[e];t===void 0&&(t=new Int32Array(e),Gh[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function qb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Xb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2fv(this.addr,e),Nt(t,e)}}function $b(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;n.uniform3fv(this.addr,e),Nt(t,e)}}function Yb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4fv(this.addr,e),Nt(t,e)}}function jb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Nt(t,e)}else{if(Ut(t,i))return;Wh.set(i),n.uniformMatrix2fv(this.addr,!1,Wh),Nt(t,i)}}function Kb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Nt(t,e)}else{if(Ut(t,i))return;Hh.set(i),n.uniformMatrix3fv(this.addr,!1,Hh),Nt(t,i)}}function Qb(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ut(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Nt(t,e)}else{if(Ut(t,i))return;Vh.set(i),n.uniformMatrix4fv(this.addr,!1,Vh),Nt(t,i)}}function Zb(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Jb(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2iv(this.addr,e),Nt(t,e)}}function e_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3iv(this.addr,e),Nt(t,e)}}function t_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4iv(this.addr,e),Nt(t,e)}}function n_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function i_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;n.uniform2uiv(this.addr,e),Nt(t,e)}}function r_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;n.uniform3uiv(this.addr,e),Nt(t,e)}}function s_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;n.uniform4uiv(this.addr,e),Nt(t,e)}}function a_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(zh.compareFunction=om,s=zh):s=Am,t.setTexture2D(e||s,r)}function o_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Rm,r)}function l_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Pm,r)}function c_(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Cm,r)}function u_(n){switch(n){case 5126:return qb;case 35664:return Xb;case 35665:return $b;case 35666:return Yb;case 35674:return jb;case 35675:return Kb;case 35676:return Qb;case 5124:case 35670:return Zb;case 35667:case 35671:return Jb;case 35668:case 35672:return e_;case 35669:case 35673:return t_;case 5125:return n_;case 36294:return i_;case 36295:return r_;case 36296:return s_;case 35678:case 36198:case 36298:case 36306:case 35682:return a_;case 35679:case 36299:case 36307:return o_;case 35680:case 36300:case 36308:case 36293:return l_;case 36289:case 36303:case 36311:case 36292:return c_}}function d_(n,e){n.uniform1fv(this.addr,e)}function h_(n,e){const t=Ms(e,this.size,2);n.uniform2fv(this.addr,t)}function f_(n,e){const t=Ms(e,this.size,3);n.uniform3fv(this.addr,t)}function p_(n,e){const t=Ms(e,this.size,4);n.uniform4fv(this.addr,t)}function m_(n,e){const t=Ms(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function g_(n,e){const t=Ms(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function v_(n,e){const t=Ms(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function y_(n,e){n.uniform1iv(this.addr,e)}function x_(n,e){n.uniform2iv(this.addr,e)}function b_(n,e){n.uniform3iv(this.addr,e)}function __(n,e){n.uniform4iv(this.addr,e)}function w_(n,e){n.uniform1uiv(this.addr,e)}function S_(n,e){n.uniform2uiv(this.addr,e)}function M_(n,e){n.uniform3uiv(this.addr,e)}function E_(n,e){n.uniform4uiv(this.addr,e)}function T_(n,e,t){const i=this.cache,r=e.length,s=gl(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Am,s[a])}function A_(n,e,t){const i=this.cache,r=e.length,s=gl(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Rm,s[a])}function C_(n,e,t){const i=this.cache,r=e.length,s=gl(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Pm,s[a])}function R_(n,e,t){const i=this.cache,r=e.length,s=gl(t,r);Ut(i,s)||(n.uniform1iv(this.addr,s),Nt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Cm,s[a])}function P_(n){switch(n){case 5126:return d_;case 35664:return h_;case 35665:return f_;case 35666:return p_;case 35674:return m_;case 35675:return g_;case 35676:return v_;case 5124:case 35670:return y_;case 35667:case 35671:return x_;case 35668:case 35672:return b_;case 35669:case 35673:return __;case 5125:return w_;case 36294:return S_;case 36295:return M_;case 36296:return E_;case 35678:case 36198:case 36298:case 36306:case 35682:return T_;case 35679:case 36299:case 36307:return A_;case 35680:case 36300:case 36308:case 36293:return C_;case 36289:case 36303:case 36311:case 36292:return R_}}class D_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=u_(t.type)}}class I_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=P_(t.type)}}class L_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const sc=/(\w+)(\])?(\[|\.)?/g;function qh(n,e){n.seq.push(e),n.map[e.id]=e}function U_(n,e,t){const i=n.name,r=i.length;for(sc.lastIndex=0;;){const s=sc.exec(i),a=sc.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){qh(t,c===void 0?new D_(o,n,e):new I_(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new L_(o),qh(t,h)),t=h}}}class So{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);U_(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function Xh(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const N_=37297;let F_=0;function B_(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const $h=new Ue;function O_(n){Je._getMatrix($h,Je.workingColorSpace,n);const e=`mat3( ${$h.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(n)){case zo:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Yh(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+B_(n.getShaderSource(e),a)}else return r}function z_(n,e){const t=O_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function k_(n,e){let t;switch(e){case Mg:t="Linear";break;case Eg:t="Reinhard";break;case Tg:t="Cineon";break;case Ag:t="ACESFilmic";break;case Rg:t="AgX";break;case Pg:t="Neutral";break;case Cg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const no=new D;function G_(){Je.getLuminanceCoefficients(no);const n=no.x.toFixed(4),e=no.y.toFixed(4),t=no.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xs).join(`
`)}function H_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function W_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Xs(n){return n!==""}function jh(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Kh(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const q_=/^[ \t]*#include +<([\w\d./]+)>/gm;function bu(n){return n.replace(q_,$_)}const X_=new Map;function $_(n,e){let t=ke[e];if(t===void 0){const i=X_.get(e);if(i!==void 0)t=ke[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return bu(t)}const Y_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qh(n){return n.replace(Y_,j_)}function j_(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Zh(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function K_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Yp?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===jp?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ui&&(e="SHADOWMAP_TYPE_VSM"),e}function Q_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ms:case gs:e="ENVMAP_TYPE_CUBE";break;case pl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Z_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case gs:e="ENVMAP_MODE_REFRACTION";break}return e}function J_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case ju:e="ENVMAP_BLENDING_MULTIPLY";break;case wg:e="ENVMAP_BLENDING_MIX";break;case Sg:e="ENVMAP_BLENDING_ADD";break}return e}function e1(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function t1(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=K_(t),c=Q_(t),d=Z_(t),h=J_(t),f=e1(t),p=V_(t),g=H_(s),x=r.createProgram();let m,u,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Xs).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Xs).join(`
`),u.length>0&&(u+=`
`)):(m=[Zh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xs).join(`
`),u=[Zh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?ke.tonemapping_pars_fragment:"",t.toneMapping!==ki?k_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ke.colorspace_pars_fragment,z_("linearToOutputTexel",t.outputColorSpace),G_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xs).join(`
`)),a=bu(a),a=jh(a,t),a=Kh(a,t),o=bu(o),o=jh(o,t),o=Kh(o,t),a=Qh(a),o=Qh(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",t.glslVersion===Jd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Jd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const b=y+m+a,v=y+u+o,M=Xh(r,r.VERTEX_SHADER,b),S=Xh(r,r.FRAGMENT_SHADER,v);r.attachShader(x,M),r.attachShader(x,S),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function E(R){if(n.debug.checkShaderErrors){const U=r.getProgramInfoLog(x).trim(),L=r.getShaderInfoLog(M).trim(),O=r.getShaderInfoLog(S).trim();let V=!0,k=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(V=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,M,S);else{const H=Yh(r,M,"vertex"),z=Yh(r,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+U+`
`+H+`
`+z)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(L===""||O==="")&&(k=!1);k&&(R.diagnostics={runnable:V,programLog:U,vertexShader:{log:L,prefix:m},fragmentShader:{log:O,prefix:u}})}r.deleteShader(M),r.deleteShader(S),A=new So(r,x),w=W_(r,x)}let A;this.getUniforms=function(){return A===void 0&&E(this),A};let w;this.getAttributes=function(){return w===void 0&&E(this),w};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(x,N_)),_},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=F_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=M,this.fragmentShader=S,this}let n1=0;class i1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new r1(e),t.set(e,i)),i}}class r1{constructor(e){this.id=n1++,this.code=e,this.usedTimes=0}}function s1(n,e,t,i,r,s,a){const o=new rd,l=new i1,c=new Set,d=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,_,R,U,L){const O=U.fog,V=L.geometry,k=w.isMeshStandardMaterial?U.environment:null,H=(w.isMeshStandardMaterial?t:e).get(w.envMap||k),z=H&&H.mapping===pl?H.image.height:null,Y=g[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const ne=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,le=ne!==void 0?ne.length:0;let oe=0;V.morphAttributes.position!==void 0&&(oe=1),V.morphAttributes.normal!==void 0&&(oe=2),V.morphAttributes.color!==void 0&&(oe=3);let ge,X,K,ie;if(Y){const rt=jn[Y];ge=rt.vertexShader,X=rt.fragmentShader}else ge=w.vertexShader,X=w.fragmentShader,l.update(w),K=l.getVertexShaderID(w),ie=l.getFragmentShaderID(w);const ee=n.getRenderTarget(),ve=n.state.buffers.depth.getReversed(),fe=L.isInstancedMesh===!0,Ge=L.isBatchedMesh===!0,ft=!!w.map,je=!!w.matcap,xt=!!H,I=!!w.aoMap,An=!!w.lightMap,Xe=!!w.bumpMap,$e=!!w.normalMap,Ce=!!w.displacementMap,ut=!!w.emissiveMap,Re=!!w.metalnessMap,P=!!w.roughnessMap,T=w.anisotropy>0,G=w.clearcoat>0,Z=w.dispersion>0,te=w.iridescence>0,Q=w.sheen>0,Te=w.transmission>0,he=T&&!!w.anisotropyMap,xe=G&&!!w.clearcoatMap,Ke=G&&!!w.clearcoatNormalMap,se=G&&!!w.clearcoatRoughnessMap,be=te&&!!w.iridescenceMap,Ie=te&&!!w.iridescenceThicknessMap,Ne=Q&&!!w.sheenColorMap,_e=Q&&!!w.sheenRoughnessMap,Ye=!!w.specularMap,ze=!!w.specularColorMap,ct=!!w.specularIntensityMap,N=Te&&!!w.transmissionMap,ue=Te&&!!w.thicknessMap,$=!!w.gradientMap,J=!!w.alphaMap,me=w.alphaTest>0,pe=!!w.alphaHash,Oe=!!w.extensions;let mt=ki;w.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(mt=n.toneMapping);const Xt={shaderID:Y,shaderType:w.type,shaderName:w.name,vertexShader:ge,fragmentShader:X,defines:w.defines,customVertexShaderID:K,customFragmentShaderID:ie,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ge,batchingColor:Ge&&L._colorsTexture!==null,instancing:fe,instancingColor:fe&&L.instanceColor!==null,instancingMorph:fe&&L.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ee===null?n.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:xs,alphaToCoverage:!!w.alphaToCoverage,map:ft,matcap:je,envMap:xt,envMapMode:xt&&H.mapping,envMapCubeUVHeight:z,aoMap:I,lightMap:An,bumpMap:Xe,normalMap:$e,displacementMap:f&&Ce,emissiveMap:ut,normalMapObjectSpace:$e&&w.normalMapType===Ug,normalMapTangentSpace:$e&&w.normalMapType===nd,metalnessMap:Re,roughnessMap:P,anisotropy:T,anisotropyMap:he,clearcoat:G,clearcoatMap:xe,clearcoatNormalMap:Ke,clearcoatRoughnessMap:se,dispersion:Z,iridescence:te,iridescenceMap:be,iridescenceThicknessMap:Ie,sheen:Q,sheenColorMap:Ne,sheenRoughnessMap:_e,specularMap:Ye,specularColorMap:ze,specularIntensityMap:ct,transmission:Te,transmissionMap:N,thicknessMap:ue,gradientMap:$,opaque:w.transparent===!1&&w.blending===Zn&&w.alphaToCoverage===!1,alphaMap:J,alphaTest:me,alphaHash:pe,combine:w.combine,mapUv:ft&&x(w.map.channel),aoMapUv:I&&x(w.aoMap.channel),lightMapUv:An&&x(w.lightMap.channel),bumpMapUv:Xe&&x(w.bumpMap.channel),normalMapUv:$e&&x(w.normalMap.channel),displacementMapUv:Ce&&x(w.displacementMap.channel),emissiveMapUv:ut&&x(w.emissiveMap.channel),metalnessMapUv:Re&&x(w.metalnessMap.channel),roughnessMapUv:P&&x(w.roughnessMap.channel),anisotropyMapUv:he&&x(w.anisotropyMap.channel),clearcoatMapUv:xe&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:_e&&x(w.sheenRoughnessMap.channel),specularMapUv:Ye&&x(w.specularMap.channel),specularColorMapUv:ze&&x(w.specularColorMap.channel),specularIntensityMapUv:ct&&x(w.specularIntensityMap.channel),transmissionMapUv:N&&x(w.transmissionMap.channel),thicknessMapUv:ue&&x(w.thicknessMap.channel),alphaMapUv:J&&x(w.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&($e||T),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!V.attributes.uv&&(ft||J),fog:!!O,useFog:w.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:ve,skinning:L.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:oe,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:mt,decodeVideoTexture:ft&&w.map.isVideoTexture===!0&&Je.getTransfer(w.map.colorSpace)===at,decodeVideoTextureEmissive:ut&&w.emissiveMap.isVideoTexture===!0&&Je.getTransfer(w.emissiveMap.colorSpace)===at,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Ln,flipSided:w.side===on,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Oe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&w.extensions.multiDraw===!0||Ge)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Xt.vertexUv1s=c.has(1),Xt.vertexUv2s=c.has(2),Xt.vertexUv3s=c.has(3),c.clear(),Xt}function u(w){const _=[];if(w.shaderID?_.push(w.shaderID):(_.push(w.customVertexShaderID),_.push(w.customFragmentShaderID)),w.defines!==void 0)for(const R in w.defines)_.push(R),_.push(w.defines[R]);return w.isRawShaderMaterial===!1&&(y(_,w),b(_,w),_.push(n.outputColorSpace)),_.push(w.customProgramCacheKey),_.join()}function y(w,_){w.push(_.precision),w.push(_.outputColorSpace),w.push(_.envMapMode),w.push(_.envMapCubeUVHeight),w.push(_.mapUv),w.push(_.alphaMapUv),w.push(_.lightMapUv),w.push(_.aoMapUv),w.push(_.bumpMapUv),w.push(_.normalMapUv),w.push(_.displacementMapUv),w.push(_.emissiveMapUv),w.push(_.metalnessMapUv),w.push(_.roughnessMapUv),w.push(_.anisotropyMapUv),w.push(_.clearcoatMapUv),w.push(_.clearcoatNormalMapUv),w.push(_.clearcoatRoughnessMapUv),w.push(_.iridescenceMapUv),w.push(_.iridescenceThicknessMapUv),w.push(_.sheenColorMapUv),w.push(_.sheenRoughnessMapUv),w.push(_.specularMapUv),w.push(_.specularColorMapUv),w.push(_.specularIntensityMapUv),w.push(_.transmissionMapUv),w.push(_.thicknessMapUv),w.push(_.combine),w.push(_.fogExp2),w.push(_.sizeAttenuation),w.push(_.morphTargetsCount),w.push(_.morphAttributeCount),w.push(_.numDirLights),w.push(_.numPointLights),w.push(_.numSpotLights),w.push(_.numSpotLightMaps),w.push(_.numHemiLights),w.push(_.numRectAreaLights),w.push(_.numDirLightShadows),w.push(_.numPointLightShadows),w.push(_.numSpotLightShadows),w.push(_.numSpotLightShadowsWithMaps),w.push(_.numLightProbes),w.push(_.shadowMapType),w.push(_.toneMapping),w.push(_.numClippingPlanes),w.push(_.numClipIntersection),w.push(_.depthPacking)}function b(w,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reverseDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),w.push(o.mask)}function v(w){const _=g[w.type];let R;if(_){const U=jn[_];R=Ev.clone(U.uniforms)}else R=w.uniforms;return R}function M(w,_){let R;for(let U=0,L=d.length;U<L;U++){const O=d[U];if(O.cacheKey===_){R=O,++R.usedTimes;break}}return R===void 0&&(R=new t1(n,_,w,s),d.push(R)),R}function S(w){if(--w.usedTimes===0){const _=d.indexOf(w);d[_]=d[d.length-1],d.pop(),w.destroy()}}function E(w){l.remove(w)}function A(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:v,acquireProgram:M,releaseProgram:S,releaseShaderCache:E,programs:d,dispose:A}}function a1(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,l){n.get(a)[o]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function o1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Jh(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function ef(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(h,f,p,g,x,m){let u=n[e];return u===void 0?(u={id:h.id,object:h,geometry:f,material:p,groupOrder:g,renderOrder:h.renderOrder,z:x,group:m},n[e]=u):(u.id=h.id,u.object=h,u.geometry=f,u.material=p,u.groupOrder=g,u.renderOrder=h.renderOrder,u.z=x,u.group=m),e++,u}function o(h,f,p,g,x,m){const u=a(h,f,p,g,x,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):t.push(u)}function l(h,f,p,g,x,m){const u=a(h,f,p,g,x,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):t.unshift(u)}function c(h,f){t.length>1&&t.sort(h||o1),i.length>1&&i.sort(f||Jh),r.length>1&&r.sort(f||Jh)}function d(){for(let h=e,f=n.length;h<f;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:d,sort:c}}function l1(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new ef,n.set(i,[a])):r>=s.length?(a=new ef,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function c1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Se};break;case"SpotLight":t={position:new D,direction:new D,color:new Se,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Se,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Se,groundColor:new Se};break;case"RectAreaLight":t={color:new Se,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function u1(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let d1=0;function h1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function f1(n){const e=new c1,t=u1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new ot,a=new ot;function o(c){let d=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,g=0,x=0,m=0,u=0,y=0,b=0,v=0,M=0,S=0,E=0;c.sort(h1);for(let w=0,_=c.length;w<_;w++){const R=c[w],U=R.color,L=R.intensity,O=R.distance,V=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=U.r*L,h+=U.g*L,f+=U.b*L;else if(R.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(R.sh.coefficients[k],L);E++}else if(R.isDirectionalLight){const k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const H=R.shadow,z=t.get(R);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,i.directionalShadow[p]=z,i.directionalShadowMap[p]=V,i.directionalShadowMatrix[p]=R.shadow.matrix,y++}i.directional[p]=k,p++}else if(R.isSpotLight){const k=e.get(R);k.position.setFromMatrixPosition(R.matrixWorld),k.color.copy(U).multiplyScalar(L),k.distance=O,k.coneCos=Math.cos(R.angle),k.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),k.decay=R.decay,i.spot[x]=k;const H=R.shadow;if(R.map&&(i.spotLightMap[M]=R.map,M++,H.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[x]=H.matrix,R.castShadow){const z=t.get(R);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,i.spotShadow[x]=z,i.spotShadowMap[x]=V,v++}x++}else if(R.isRectAreaLight){const k=e.get(R);k.color.copy(U).multiplyScalar(L),k.halfWidth.set(R.width*.5,0,0),k.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=k,m++}else if(R.isPointLight){const k=e.get(R);if(k.color.copy(R.color).multiplyScalar(R.intensity),k.distance=R.distance,k.decay=R.decay,R.castShadow){const H=R.shadow,z=t.get(R);z.shadowIntensity=H.intensity,z.shadowBias=H.bias,z.shadowNormalBias=H.normalBias,z.shadowRadius=H.radius,z.shadowMapSize=H.mapSize,z.shadowCameraNear=H.camera.near,z.shadowCameraFar=H.camera.far,i.pointShadow[g]=z,i.pointShadowMap[g]=V,i.pointShadowMatrix[g]=R.shadow.matrix,b++}i.point[g]=k,g++}else if(R.isHemisphereLight){const k=e.get(R);k.skyColor.copy(R.color).multiplyScalar(L),k.groundColor.copy(R.groundColor).multiplyScalar(L),i.hemi[u]=k,u++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ce.LTC_FLOAT_1,i.rectAreaLTC2=ce.LTC_FLOAT_2):(i.rectAreaLTC1=ce.LTC_HALF_1,i.rectAreaLTC2=ce.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=f;const A=i.hash;(A.directionalLength!==p||A.pointLength!==g||A.spotLength!==x||A.rectAreaLength!==m||A.hemiLength!==u||A.numDirectionalShadows!==y||A.numPointShadows!==b||A.numSpotShadows!==v||A.numSpotMaps!==M||A.numLightProbes!==E)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=m,i.point.length=g,i.hemi.length=u,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=v+M-S,i.spotLightMap.length=M,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=E,A.directionalLength=p,A.pointLength=g,A.spotLength=x,A.rectAreaLength=m,A.hemiLength=u,A.numDirectionalShadows=y,A.numPointShadows=b,A.numSpotShadows=v,A.numSpotMaps=M,A.numLightProbes=E,i.version=d1++)}function l(c,d){let h=0,f=0,p=0,g=0,x=0;const m=d.matrixWorldInverse;for(let u=0,y=c.length;u<y;u++){const b=c[u];if(b.isDirectionalLight){const v=i.directional[h];v.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),h++}else if(b.isSpotLight){const v=i.spot[p];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(m),p++}else if(b.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(b.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(b.width*.5,0,0),v.halfHeight.set(0,b.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(b.isPointLight){const v=i.point[f];v.position.setFromMatrixPosition(b.matrixWorld),v.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){const v=i.hemi[x];v.direction.setFromMatrixPosition(b.matrixWorld),v.direction.transformDirection(m),x++}}}return{setup:o,setupView:l,state:i}}function tf(n){const e=new f1(n),t=[],i=[];function r(d){c.camera=d,t.length=0,i.length=0}function s(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function p1(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new tf(n),e.set(r,[o])):s>=a.length?(o=new tf(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const m1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,g1=`uniform sampler2D shadow_pass;
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
}`;function v1(n,e,t){let i=new ad;const r=new Ee,s=new Ee,a=new yt,o=new zv({depthPacking:Lg}),l=new kv,c={},d=t.maxTextureSize,h={[En]:on,[on]:En,[Ln]:Ln},f=new Vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:m1,fragmentShader:g1}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new Jt;g.setAttribute("position",new It(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Gt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yp;let u=this.type;this.render=function(S,E,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const w=n.getRenderTarget(),_=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),U=n.state;U.setBlending(zi),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const L=u!==ui&&this.type===ui,O=u===ui&&this.type!==ui;for(let V=0,k=S.length;V<k;V++){const H=S[V],z=H.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;r.copy(z.mapSize);const Y=z.getFrameExtents();if(r.multiply(Y),s.copy(z.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/Y.x),r.x=s.x*Y.x,z.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/Y.y),r.y=s.y*Y.y,z.mapSize.y=s.y)),z.map===null||L===!0||O===!0){const le=this.type!==ui?{minFilter:Dt,magFilter:Dt}:{};z.map!==null&&z.map.dispose(),z.map=new br(r.x,r.y,le),z.map.texture.name=H.name+".shadowMap",z.camera.updateProjectionMatrix()}n.setRenderTarget(z.map),n.clear();const ne=z.getViewportCount();for(let le=0;le<ne;le++){const oe=z.getViewport(le);a.set(s.x*oe.x,s.y*oe.y,s.x*oe.z,s.y*oe.w),U.viewport(a),z.updateMatrices(H,le),i=z.getFrustum(),v(E,A,z.camera,H,this.type)}z.isPointLightShadow!==!0&&this.type===ui&&y(z,A),z.needsUpdate=!1}u=this.type,m.needsUpdate=!1,n.setRenderTarget(w,_,R)};function y(S,E){const A=e.update(x);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new br(r.x,r.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,n.setRenderTarget(S.mapPass),n.clear(),n.renderBufferDirect(E,null,A,f,x,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,n.setRenderTarget(S.map),n.clear(),n.renderBufferDirect(E,null,A,p,x,null)}function b(S,E,A,w){let _=null;const R=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(R!==void 0)_=R;else if(_=A.isPointLight===!0?l:o,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const U=_.uuid,L=E.uuid;let O=c[U];O===void 0&&(O={},c[U]=O);let V=O[L];V===void 0&&(V=_.clone(),O[L]=V,E.addEventListener("dispose",M)),_=V}if(_.visible=E.visible,_.wireframe=E.wireframe,w===ui?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:h[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,A.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const U=n.properties.get(_);U.light=A}return _}function v(S,E,A,w,_){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&_===ui)&&(!S.frustumCulled||i.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);const L=e.update(S),O=S.material;if(Array.isArray(O)){const V=L.groups;for(let k=0,H=V.length;k<H;k++){const z=V[k],Y=O[z.materialIndex];if(Y&&Y.visible){const ne=b(S,Y,w,_);S.onBeforeShadow(n,S,E,A,L,ne,z),n.renderBufferDirect(A,null,L,ne,S,z),S.onAfterShadow(n,S,E,A,L,ne,z)}}}else if(O.visible){const V=b(S,O,w,_);S.onBeforeShadow(n,S,E,A,L,V,null),n.renderBufferDirect(A,null,L,V,S,null),S.onAfterShadow(n,S,E,A,L,V,null)}}const U=S.children;for(let L=0,O=U.length;L<O;L++)v(U[L],E,A,w,_)}function M(S){S.target.removeEventListener("dispose",M);for(const A in c){const w=c[A],_=S.target.uuid;_ in w&&(w[_].dispose(),delete w[_])}}}const y1={[Uc]:Nc,[Fc]:zc,[Bc]:kc,[ps]:Oc,[Nc]:Uc,[zc]:Fc,[kc]:Bc,[Oc]:ps};function x1(n,e){function t(){let N=!1;const ue=new yt;let $=null;const J=new yt(0,0,0,0);return{setMask:function(me){$!==me&&!N&&(n.colorMask(me,me,me,me),$=me)},setLocked:function(me){N=me},setClear:function(me,pe,Oe,mt,Xt){Xt===!0&&(me*=mt,pe*=mt,Oe*=mt),ue.set(me,pe,Oe,mt),J.equals(ue)===!1&&(n.clearColor(me,pe,Oe,mt),J.copy(ue))},reset:function(){N=!1,$=null,J.set(-1,0,0,0)}}}function i(){let N=!1,ue=!1,$=null,J=null,me=null;return{setReversed:function(pe){if(ue!==pe){const Oe=e.get("EXT_clip_control");ue?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT);const mt=me;me=null,this.setClear(mt)}ue=pe},getReversed:function(){return ue},setTest:function(pe){pe?ee(n.DEPTH_TEST):ve(n.DEPTH_TEST)},setMask:function(pe){$!==pe&&!N&&(n.depthMask(pe),$=pe)},setFunc:function(pe){if(ue&&(pe=y1[pe]),J!==pe){switch(pe){case Uc:n.depthFunc(n.NEVER);break;case Nc:n.depthFunc(n.ALWAYS);break;case Fc:n.depthFunc(n.LESS);break;case ps:n.depthFunc(n.LEQUAL);break;case Bc:n.depthFunc(n.EQUAL);break;case Oc:n.depthFunc(n.GEQUAL);break;case zc:n.depthFunc(n.GREATER);break;case kc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=pe}},setLocked:function(pe){N=pe},setClear:function(pe){me!==pe&&(ue&&(pe=1-pe),n.clearDepth(pe),me=pe)},reset:function(){N=!1,$=null,J=null,me=null,ue=!1}}}function r(){let N=!1,ue=null,$=null,J=null,me=null,pe=null,Oe=null,mt=null,Xt=null;return{setTest:function(rt){N||(rt?ee(n.STENCIL_TEST):ve(n.STENCIL_TEST))},setMask:function(rt){ue!==rt&&!N&&(n.stencilMask(rt),ue=rt)},setFunc:function(rt,Fn,ii){($!==rt||J!==Fn||me!==ii)&&(n.stencilFunc(rt,Fn,ii),$=rt,J=Fn,me=ii)},setOp:function(rt,Fn,ii){(pe!==rt||Oe!==Fn||mt!==ii)&&(n.stencilOp(rt,Fn,ii),pe=rt,Oe=Fn,mt=ii)},setLocked:function(rt){N=rt},setClear:function(rt){Xt!==rt&&(n.clearStencil(rt),Xt=rt)},reset:function(){N=!1,ue=null,$=null,J=null,me=null,pe=null,Oe=null,mt=null,Xt=null}}}const s=new t,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let d={},h={},f=new WeakMap,p=[],g=null,x=!1,m=null,u=null,y=null,b=null,v=null,M=null,S=null,E=new Se(0,0,0),A=0,w=!1,_=null,R=null,U=null,L=null,O=null;const V=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,H=0;const z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(z)[1]),k=H>=1):z.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),k=H>=2);let Y=null,ne={};const le=n.getParameter(n.SCISSOR_BOX),oe=n.getParameter(n.VIEWPORT),ge=new yt().fromArray(le),X=new yt().fromArray(oe);function K(N,ue,$,J){const me=new Uint8Array(4),pe=n.createTexture();n.bindTexture(N,pe),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Oe=0;Oe<$;Oe++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(ue,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,me):n.texImage2D(ue+Oe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,me);return pe}const ie={};ie[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),ie[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ie[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(n.DEPTH_TEST),a.setFunc(ps),Xe(!1),$e(jd),ee(n.CULL_FACE),I(zi);function ee(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function ve(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function fe(N,ue){return h[N]!==ue?(n.bindFramebuffer(N,ue),h[N]=ue,N===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ue),N===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ue),!0):!1}function Ge(N,ue){let $=p,J=!1;if(N){$=f.get(ue),$===void 0&&($=[],f.set(ue,$));const me=N.textures;if($.length!==me.length||$[0]!==n.COLOR_ATTACHMENT0){for(let pe=0,Oe=me.length;pe<Oe;pe++)$[pe]=n.COLOR_ATTACHMENT0+pe;$.length=me.length,J=!0}}else $[0]!==n.BACK&&($[0]=n.BACK,J=!0);J&&n.drawBuffers($)}function ft(N){return g!==N?(n.useProgram(N),g=N,!0):!1}const je={[hr]:n.FUNC_ADD,[sg]:n.FUNC_SUBTRACT,[ag]:n.FUNC_REVERSE_SUBTRACT};je[og]=n.MIN,je[lg]=n.MAX;const xt={[cg]:n.ZERO,[ug]:n.ONE,[dg]:n.SRC_COLOR,[Ic]:n.SRC_ALPHA,[vg]:n.SRC_ALPHA_SATURATE,[mg]:n.DST_COLOR,[fg]:n.DST_ALPHA,[hg]:n.ONE_MINUS_SRC_COLOR,[Lc]:n.ONE_MINUS_SRC_ALPHA,[gg]:n.ONE_MINUS_DST_COLOR,[pg]:n.ONE_MINUS_DST_ALPHA,[yg]:n.CONSTANT_COLOR,[xg]:n.ONE_MINUS_CONSTANT_COLOR,[bg]:n.CONSTANT_ALPHA,[_g]:n.ONE_MINUS_CONSTANT_ALPHA};function I(N,ue,$,J,me,pe,Oe,mt,Xt,rt){if(N===zi){x===!0&&(ve(n.BLEND),x=!1);return}if(x===!1&&(ee(n.BLEND),x=!0),N!==rg){if(N!==m||rt!==w){if((u!==hr||v!==hr)&&(n.blendEquation(n.FUNC_ADD),u=hr,v=hr),rt)switch(N){case Zn:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Oo:n.blendFunc(n.ONE,n.ONE);break;case Kd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qd:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Zn:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Oo:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Kd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qd:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}y=null,b=null,M=null,S=null,E.set(0,0,0),A=0,m=N,w=rt}return}me=me||ue,pe=pe||$,Oe=Oe||J,(ue!==u||me!==v)&&(n.blendEquationSeparate(je[ue],je[me]),u=ue,v=me),($!==y||J!==b||pe!==M||Oe!==S)&&(n.blendFuncSeparate(xt[$],xt[J],xt[pe],xt[Oe]),y=$,b=J,M=pe,S=Oe),(mt.equals(E)===!1||Xt!==A)&&(n.blendColor(mt.r,mt.g,mt.b,Xt),E.copy(mt),A=Xt),m=N,w=!1}function An(N,ue){N.side===Ln?ve(n.CULL_FACE):ee(n.CULL_FACE);let $=N.side===on;ue&&($=!$),Xe($),N.blending===Zn&&N.transparent===!1?I(zi):I(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),s.setMask(N.colorWrite);const J=N.stencilWrite;o.setTest(J),J&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),ut(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ee(n.SAMPLE_ALPHA_TO_COVERAGE):ve(n.SAMPLE_ALPHA_TO_COVERAGE)}function Xe(N){_!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),_=N)}function $e(N){N!==ng?(ee(n.CULL_FACE),N!==R&&(N===jd?n.cullFace(n.BACK):N===ig?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ve(n.CULL_FACE),R=N}function Ce(N){N!==U&&(k&&n.lineWidth(N),U=N)}function ut(N,ue,$){N?(ee(n.POLYGON_OFFSET_FILL),(L!==ue||O!==$)&&(n.polygonOffset(ue,$),L=ue,O=$)):ve(n.POLYGON_OFFSET_FILL)}function Re(N){N?ee(n.SCISSOR_TEST):ve(n.SCISSOR_TEST)}function P(N){N===void 0&&(N=n.TEXTURE0+V-1),Y!==N&&(n.activeTexture(N),Y=N)}function T(N,ue,$){$===void 0&&(Y===null?$=n.TEXTURE0+V-1:$=Y);let J=ne[$];J===void 0&&(J={type:void 0,texture:void 0},ne[$]=J),(J.type!==N||J.texture!==ue)&&(Y!==$&&(n.activeTexture($),Y=$),n.bindTexture(N,ue||ie[N]),J.type=N,J.texture=ue)}function G(){const N=ne[Y];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Z(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Te(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function he(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xe(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ke(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function se(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function be(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ie(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ne(N){ge.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),ge.copy(N))}function _e(N){X.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),X.copy(N))}function Ye(N,ue){let $=c.get(ue);$===void 0&&($=new WeakMap,c.set(ue,$));let J=$.get(N);J===void 0&&(J=n.getUniformBlockIndex(ue,N.name),$.set(N,J))}function ze(N,ue){const J=c.get(ue).get(N);l.get(ue)!==J&&(n.uniformBlockBinding(ue,J,N.__bindingPointIndex),l.set(ue,J))}function ct(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},Y=null,ne={},h={},f=new WeakMap,p=[],g=null,x=!1,m=null,u=null,y=null,b=null,v=null,M=null,S=null,E=new Se(0,0,0),A=0,w=!1,_=null,R=null,U=null,L=null,O=null,ge.set(0,0,n.canvas.width,n.canvas.height),X.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ee,disable:ve,bindFramebuffer:fe,drawBuffers:Ge,useProgram:ft,setBlending:I,setMaterial:An,setFlipSided:Xe,setCullFace:$e,setLineWidth:Ce,setPolygonOffset:ut,setScissorTest:Re,activeTexture:P,bindTexture:T,unbindTexture:G,compressedTexImage2D:Z,compressedTexImage3D:te,texImage2D:be,texImage3D:Ie,updateUBOMapping:Ye,uniformBlockBinding:ze,texStorage2D:Ke,texStorage3D:se,texSubImage2D:Q,texSubImage3D:Te,compressedTexSubImage2D:he,compressedTexSubImage3D:xe,scissor:Ne,viewport:_e,reset:ct}}function b1(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ee,d=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,T){return p?new OffscreenCanvas(P,T):Vo("canvas")}function x(P,T,G){let Z=1;const te=Re(P);if((te.width>G||te.height>G)&&(Z=G/Math.max(te.width,te.height)),Z<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const Q=Math.floor(Z*te.width),Te=Math.floor(Z*te.height);h===void 0&&(h=g(Q,Te));const he=T?g(Q,Te):h;return he.width=Q,he.height=Te,he.getContext("2d").drawImage(P,0,0,Q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+Q+"x"+Te+")."),he}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),P;return P}function m(P){return P.generateMipmaps}function u(P){n.generateMipmap(P)}function y(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(P,T,G,Z,te=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Q=T;if(T===n.RED&&(G===n.FLOAT&&(Q=n.R32F),G===n.HALF_FLOAT&&(Q=n.R16F),G===n.UNSIGNED_BYTE&&(Q=n.R8)),T===n.RED_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.R8UI),G===n.UNSIGNED_SHORT&&(Q=n.R16UI),G===n.UNSIGNED_INT&&(Q=n.R32UI),G===n.BYTE&&(Q=n.R8I),G===n.SHORT&&(Q=n.R16I),G===n.INT&&(Q=n.R32I)),T===n.RG&&(G===n.FLOAT&&(Q=n.RG32F),G===n.HALF_FLOAT&&(Q=n.RG16F),G===n.UNSIGNED_BYTE&&(Q=n.RG8)),T===n.RG_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RG8UI),G===n.UNSIGNED_SHORT&&(Q=n.RG16UI),G===n.UNSIGNED_INT&&(Q=n.RG32UI),G===n.BYTE&&(Q=n.RG8I),G===n.SHORT&&(Q=n.RG16I),G===n.INT&&(Q=n.RG32I)),T===n.RGB_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),G===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),G===n.UNSIGNED_INT&&(Q=n.RGB32UI),G===n.BYTE&&(Q=n.RGB8I),G===n.SHORT&&(Q=n.RGB16I),G===n.INT&&(Q=n.RGB32I)),T===n.RGBA_INTEGER&&(G===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),G===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),G===n.UNSIGNED_INT&&(Q=n.RGBA32UI),G===n.BYTE&&(Q=n.RGBA8I),G===n.SHORT&&(Q=n.RGBA16I),G===n.INT&&(Q=n.RGBA32I)),T===n.RGB&&G===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),T===n.RGBA){const Te=te?zo:Je.getTransfer(Z);G===n.FLOAT&&(Q=n.RGBA32F),G===n.HALF_FLOAT&&(Q=n.RGBA16F),G===n.UNSIGNED_BYTE&&(Q=Te===at?n.SRGB8_ALPHA8:n.RGBA8),G===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),G===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function v(P,T){let G;return P?T===null||T===xr||T===vs?G=n.DEPTH24_STENCIL8:T===mi?G=n.DEPTH32F_STENCIL8:T===ua&&(G=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===xr||T===vs?G=n.DEPTH_COMPONENT24:T===mi?G=n.DEPTH_COMPONENT32F:T===ua&&(G=n.DEPTH_COMPONENT16),G}function M(P,T){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Dt&&P.minFilter!==it?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function S(P){const T=P.target;T.removeEventListener("dispose",S),A(T),T.isVideoTexture&&d.delete(T)}function E(P){const T=P.target;T.removeEventListener("dispose",E),_(T)}function A(P){const T=i.get(P);if(T.__webglInit===void 0)return;const G=P.source,Z=f.get(G);if(Z){const te=Z[T.__cacheKey];te.usedTimes--,te.usedTimes===0&&w(P),Object.keys(Z).length===0&&f.delete(G)}i.remove(P)}function w(P){const T=i.get(P);n.deleteTexture(T.__webglTexture);const G=P.source,Z=f.get(G);delete Z[T.__cacheKey],a.memory.textures--}function _(P){const T=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(T.__webglFramebuffer[Z]))for(let te=0;te<T.__webglFramebuffer[Z].length;te++)n.deleteFramebuffer(T.__webglFramebuffer[Z][te]);else n.deleteFramebuffer(T.__webglFramebuffer[Z]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[Z])}else{if(Array.isArray(T.__webglFramebuffer))for(let Z=0;Z<T.__webglFramebuffer.length;Z++)n.deleteFramebuffer(T.__webglFramebuffer[Z]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let Z=0;Z<T.__webglColorRenderbuffer.length;Z++)T.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[Z]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const G=P.textures;for(let Z=0,te=G.length;Z<te;Z++){const Q=i.get(G[Z]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),a.memory.textures--),i.remove(G[Z])}i.remove(P)}let R=0;function U(){R=0}function L(){const P=R;return P>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+r.maxTextures),R+=1,P}function O(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function V(P,T){const G=i.get(P);if(P.isVideoTexture&&Ce(P),P.isRenderTargetTexture===!1&&P.version>0&&G.__version!==P.version){const Z=P.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(G,P,T);return}}t.bindTexture(n.TEXTURE_2D,G.__webglTexture,n.TEXTURE0+T)}function k(P,T){const G=i.get(P);if(P.version>0&&G.__version!==P.version){X(G,P,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,G.__webglTexture,n.TEXTURE0+T)}function H(P,T){const G=i.get(P);if(P.version>0&&G.__version!==P.version){X(G,P,T);return}t.bindTexture(n.TEXTURE_3D,G.__webglTexture,n.TEXTURE0+T)}function z(P,T){const G=i.get(P);if(P.version>0&&G.__version!==P.version){K(G,P,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,G.__webglTexture,n.TEXTURE0+T)}const Y={[Tn]:n.REPEAT,[pt]:n.CLAMP_TO_EDGE,[Hc]:n.MIRRORED_REPEAT},ne={[Dt]:n.NEAREST,[Dg]:n.NEAREST_MIPMAP_NEAREST,[Ra]:n.NEAREST_MIPMAP_LINEAR,[it]:n.LINEAR,[Pl]:n.LINEAR_MIPMAP_NEAREST,[pr]:n.LINEAR_MIPMAP_LINEAR},le={[Ng]:n.NEVER,[Gg]:n.ALWAYS,[Fg]:n.LESS,[om]:n.LEQUAL,[Bg]:n.EQUAL,[kg]:n.GEQUAL,[Og]:n.GREATER,[zg]:n.NOTEQUAL};function oe(P,T){if(T.type===mi&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===it||T.magFilter===Pl||T.magFilter===Ra||T.magFilter===pr||T.minFilter===it||T.minFilter===Pl||T.minFilter===Ra||T.minFilter===pr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,Y[T.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,Y[T.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,Y[T.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,ne[T.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,ne[T.minFilter]),T.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,le[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Dt||T.minFilter!==Ra&&T.minFilter!==pr||T.type===mi&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,r.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function ge(P,T){let G=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",S));const Z=T.source;let te=f.get(Z);te===void 0&&(te={},f.set(Z,te));const Q=O(T);if(Q!==P.__cacheKey){te[Q]===void 0&&(te[Q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,G=!0),te[Q].usedTimes++;const Te=te[P.__cacheKey];Te!==void 0&&(te[P.__cacheKey].usedTimes--,Te.usedTimes===0&&w(T)),P.__cacheKey=Q,P.__webglTexture=te[Q].texture}return G}function X(P,T,G){let Z=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Z=n.TEXTURE_3D);const te=ge(P,T),Q=T.source;t.bindTexture(Z,P.__webglTexture,n.TEXTURE0+G);const Te=i.get(Q);if(Q.version!==Te.__version||te===!0){t.activeTexture(n.TEXTURE0+G);const he=Je.getPrimaries(Je.workingColorSpace),xe=T.colorSpace===Bt?null:Je.getPrimaries(T.colorSpace),Ke=T.colorSpace===Bt||he===xe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let se=x(T.image,!1,r.maxTextureSize);se=ut(T,se);const be=s.convert(T.format,T.colorSpace),Ie=s.convert(T.type);let Ne=b(T.internalFormat,be,Ie,T.colorSpace,T.isVideoTexture);oe(Z,T);let _e;const Ye=T.mipmaps,ze=T.isVideoTexture!==!0,ct=Te.__version===void 0||te===!0,N=Q.dataReady,ue=M(T,se);if(T.isDepthTexture)Ne=v(T.format===ys,T.type),ct&&(ze?t.texStorage2D(n.TEXTURE_2D,1,Ne,se.width,se.height):t.texImage2D(n.TEXTURE_2D,0,Ne,se.width,se.height,0,be,Ie,null));else if(T.isDataTexture)if(Ye.length>0){ze&&ct&&t.texStorage2D(n.TEXTURE_2D,ue,Ne,Ye[0].width,Ye[0].height);for(let $=0,J=Ye.length;$<J;$++)_e=Ye[$],ze?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,_e.width,_e.height,be,Ie,_e.data):t.texImage2D(n.TEXTURE_2D,$,Ne,_e.width,_e.height,0,be,Ie,_e.data);T.generateMipmaps=!1}else ze?(ct&&t.texStorage2D(n.TEXTURE_2D,ue,Ne,se.width,se.height),N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,se.width,se.height,be,Ie,se.data)):t.texImage2D(n.TEXTURE_2D,0,Ne,se.width,se.height,0,be,Ie,se.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){ze&&ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ue,Ne,Ye[0].width,Ye[0].height,se.depth);for(let $=0,J=Ye.length;$<J;$++)if(_e=Ye[$],T.format!==St)if(be!==null)if(ze){if(N)if(T.layerUpdates.size>0){const me=Dh(_e.width,_e.height,T.format,T.type);for(const pe of T.layerUpdates){const Oe=_e.data.subarray(pe*me/_e.data.BYTES_PER_ELEMENT,(pe+1)*me/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,pe,_e.width,_e.height,1,be,Oe)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,_e.width,_e.height,se.depth,be,_e.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,$,Ne,_e.width,_e.height,se.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,$,0,0,0,_e.width,_e.height,se.depth,be,Ie,_e.data):t.texImage3D(n.TEXTURE_2D_ARRAY,$,Ne,_e.width,_e.height,se.depth,0,be,Ie,_e.data)}else{ze&&ct&&t.texStorage2D(n.TEXTURE_2D,ue,Ne,Ye[0].width,Ye[0].height);for(let $=0,J=Ye.length;$<J;$++)_e=Ye[$],T.format!==St?be!==null?ze?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,$,0,0,_e.width,_e.height,be,_e.data):t.compressedTexImage2D(n.TEXTURE_2D,$,Ne,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,_e.width,_e.height,be,Ie,_e.data):t.texImage2D(n.TEXTURE_2D,$,Ne,_e.width,_e.height,0,be,Ie,_e.data)}else if(T.isDataArrayTexture)if(ze){if(ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ue,Ne,se.width,se.height,se.depth),N)if(T.layerUpdates.size>0){const $=Dh(se.width,se.height,T.format,T.type);for(const J of T.layerUpdates){const me=se.data.subarray(J*$/se.data.BYTES_PER_ELEMENT,(J+1)*$/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,se.width,se.height,1,be,Ie,me)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,be,Ie,se.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ne,se.width,se.height,se.depth,0,be,Ie,se.data);else if(T.isData3DTexture)ze?(ct&&t.texStorage3D(n.TEXTURE_3D,ue,Ne,se.width,se.height,se.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,be,Ie,se.data)):t.texImage3D(n.TEXTURE_3D,0,Ne,se.width,se.height,se.depth,0,be,Ie,se.data);else if(T.isFramebufferTexture){if(ct)if(ze)t.texStorage2D(n.TEXTURE_2D,ue,Ne,se.width,se.height);else{let $=se.width,J=se.height;for(let me=0;me<ue;me++)t.texImage2D(n.TEXTURE_2D,me,Ne,$,J,0,be,Ie,null),$>>=1,J>>=1}}else if(Ye.length>0){if(ze&&ct){const $=Re(Ye[0]);t.texStorage2D(n.TEXTURE_2D,ue,Ne,$.width,$.height)}for(let $=0,J=Ye.length;$<J;$++)_e=Ye[$],ze?N&&t.texSubImage2D(n.TEXTURE_2D,$,0,0,be,Ie,_e):t.texImage2D(n.TEXTURE_2D,$,Ne,be,Ie,_e);T.generateMipmaps=!1}else if(ze){if(ct){const $=Re(se);t.texStorage2D(n.TEXTURE_2D,ue,Ne,$.width,$.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,be,Ie,se)}else t.texImage2D(n.TEXTURE_2D,0,Ne,be,Ie,se);m(T)&&u(Z),Te.__version=Q.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function K(P,T,G){if(T.image.length!==6)return;const Z=ge(P,T),te=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+G);const Q=i.get(te);if(te.version!==Q.__version||Z===!0){t.activeTexture(n.TEXTURE0+G);const Te=Je.getPrimaries(Je.workingColorSpace),he=T.colorSpace===Bt?null:Je.getPrimaries(T.colorSpace),xe=T.colorSpace===Bt||Te===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Ke=T.isCompressedTexture||T.image[0].isCompressedTexture,se=T.image[0]&&T.image[0].isDataTexture,be=[];for(let J=0;J<6;J++)!Ke&&!se?be[J]=x(T.image[J],!0,r.maxCubemapSize):be[J]=se?T.image[J].image:T.image[J],be[J]=ut(T,be[J]);const Ie=be[0],Ne=s.convert(T.format,T.colorSpace),_e=s.convert(T.type),Ye=b(T.internalFormat,Ne,_e,T.colorSpace),ze=T.isVideoTexture!==!0,ct=Q.__version===void 0||Z===!0,N=te.dataReady;let ue=M(T,Ie);oe(n.TEXTURE_CUBE_MAP,T);let $;if(Ke){ze&&ct&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ue,Ye,Ie.width,Ie.height);for(let J=0;J<6;J++){$=be[J].mipmaps;for(let me=0;me<$.length;me++){const pe=$[me];T.format!==St?Ne!==null?ze?N&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,pe.width,pe.height,Ne,pe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,Ye,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ze?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,0,0,pe.width,pe.height,Ne,_e,pe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me,Ye,pe.width,pe.height,0,Ne,_e,pe.data)}}}else{if($=T.mipmaps,ze&&ct){$.length>0&&ue++;const J=Re(be[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,ue,Ye,J.width,J.height)}for(let J=0;J<6;J++)if(se){ze?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,be[J].width,be[J].height,Ne,_e,be[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ye,be[J].width,be[J].height,0,Ne,_e,be[J].data);for(let me=0;me<$.length;me++){const Oe=$[me].image[J].image;ze?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,Oe.width,Oe.height,Ne,_e,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,Ye,Oe.width,Oe.height,0,Ne,_e,Oe.data)}}else{ze?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ne,_e,be[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ye,Ne,_e,be[J]);for(let me=0;me<$.length;me++){const pe=$[me];ze?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,0,0,Ne,_e,pe.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,me+1,Ye,Ne,_e,pe.image[J])}}}m(T)&&u(n.TEXTURE_CUBE_MAP),Q.__version=te.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function ie(P,T,G,Z,te,Q){const Te=s.convert(G.format,G.colorSpace),he=s.convert(G.type),xe=b(G.internalFormat,Te,he,G.colorSpace),Ke=i.get(T),se=i.get(G);if(se.__renderTarget=T,!Ke.__hasExternalTextures){const be=Math.max(1,T.width>>Q),Ie=Math.max(1,T.height>>Q);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,Q,xe,be,Ie,T.depth,0,Te,he,null):t.texImage2D(te,Q,xe,be,Ie,0,Te,he,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),$e(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,te,se.__webglTexture,0,Xe(T)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,te,se.__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(P,T,G){if(n.bindRenderbuffer(n.RENDERBUFFER,P),T.depthBuffer){const Z=T.depthTexture,te=Z&&Z.isDepthTexture?Z.type:null,Q=v(T.stencilBuffer,te),Te=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=Xe(T);$e(T)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,Q,T.width,T.height):G?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,Q,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Q,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,P)}else{const Z=T.textures;for(let te=0;te<Z.length;te++){const Q=Z[te],Te=s.convert(Q.format,Q.colorSpace),he=s.convert(Q.type),xe=b(Q.internalFormat,Te,he,Q.colorSpace),Ke=Xe(T);G&&$e(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ke,xe,T.width,T.height):$e(T)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ke,xe,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,xe,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ve(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=i.get(T.depthTexture);Z.__renderTarget=T,(!Z.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),V(T.depthTexture,0);const te=Z.__webglTexture,Q=Xe(T);if(T.depthTexture.format===ss)$e(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(T.depthTexture.format===ys)$e(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function fe(P){const T=i.get(P),G=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const Z=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),Z){const te=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,Z.removeEventListener("dispose",te)};Z.addEventListener("dispose",te),T.__depthDisposeCallback=te}T.__boundDepthTexture=Z}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");ve(T.__webglFramebuffer,P)}else if(G){T.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[Z]),T.__webglDepthbuffer[Z]===void 0)T.__webglDepthbuffer[Z]=n.createRenderbuffer(),ee(T.__webglDepthbuffer[Z],P,!1);else{const te=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=T.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),ee(T.__webglDepthbuffer,P,!1);else{const Z=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,te),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,te)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ge(P,T,G){const Z=i.get(P);T!==void 0&&ie(Z.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),G!==void 0&&fe(P)}function ft(P){const T=P.texture,G=i.get(P),Z=i.get(T);P.addEventListener("dispose",E);const te=P.textures,Q=P.isWebGLCubeRenderTarget===!0,Te=te.length>1;if(Te||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=T.version,a.memory.textures++),Q){G.__webglFramebuffer=[];for(let he=0;he<6;he++)if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer[he]=[];for(let xe=0;xe<T.mipmaps.length;xe++)G.__webglFramebuffer[he][xe]=n.createFramebuffer()}else G.__webglFramebuffer[he]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){G.__webglFramebuffer=[];for(let he=0;he<T.mipmaps.length;he++)G.__webglFramebuffer[he]=n.createFramebuffer()}else G.__webglFramebuffer=n.createFramebuffer();if(Te)for(let he=0,xe=te.length;he<xe;he++){const Ke=i.get(te[he]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&$e(P)===!1){G.__webglMultisampledFramebuffer=n.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let he=0;he<te.length;he++){const xe=te[he];G.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,G.__webglColorRenderbuffer[he]);const Ke=s.convert(xe.format,xe.colorSpace),se=s.convert(xe.type),be=b(xe.internalFormat,Ke,se,xe.colorSpace,P.isXRRenderTarget===!0),Ie=Xe(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ie,be,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,G.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(G.__webglDepthRenderbuffer=n.createRenderbuffer(),ee(G.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Q){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),oe(n.TEXTURE_CUBE_MAP,T);for(let he=0;he<6;he++)if(T.mipmaps&&T.mipmaps.length>0)for(let xe=0;xe<T.mipmaps.length;xe++)ie(G.__webglFramebuffer[he][xe],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,xe);else ie(G.__webglFramebuffer[he],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(T)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let he=0,xe=te.length;he<xe;he++){const Ke=te[he],se=i.get(Ke);t.bindTexture(n.TEXTURE_2D,se.__webglTexture),oe(n.TEXTURE_2D,Ke),ie(G.__webglFramebuffer,P,Ke,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,0),m(Ke)&&u(n.TEXTURE_2D)}t.unbindTexture()}else{let he=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(he=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,Z.__webglTexture),oe(he,T),T.mipmaps&&T.mipmaps.length>0)for(let xe=0;xe<T.mipmaps.length;xe++)ie(G.__webglFramebuffer[xe],P,T,n.COLOR_ATTACHMENT0,he,xe);else ie(G.__webglFramebuffer,P,T,n.COLOR_ATTACHMENT0,he,0);m(T)&&u(he),t.unbindTexture()}P.depthBuffer&&fe(P)}function je(P){const T=P.textures;for(let G=0,Z=T.length;G<Z;G++){const te=T[G];if(m(te)){const Q=y(P),Te=i.get(te).__webglTexture;t.bindTexture(Q,Te),u(Q),t.unbindTexture()}}}const xt=[],I=[];function An(P){if(P.samples>0){if($e(P)===!1){const T=P.textures,G=P.width,Z=P.height;let te=n.COLOR_BUFFER_BIT;const Q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(P),he=T.length>1;if(he)for(let xe=0;xe<T.length;xe++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let xe=0;xe<T.length;xe++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),he){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[xe]);const Ke=i.get(T[xe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ke,0)}n.blitFramebuffer(0,0,G,Z,0,0,G,Z,te,n.NEAREST),l===!0&&(xt.length=0,I.length=0,xt.push(n.COLOR_ATTACHMENT0+xe),P.depthBuffer&&P.resolveDepthBuffer===!1&&(xt.push(Q),I.push(Q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,I)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,xt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let xe=0;xe<T.length;xe++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.RENDERBUFFER,Te.__webglColorRenderbuffer[xe]);const Ke=i.get(T[xe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+xe,n.TEXTURE_2D,Ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Xe(P){return Math.min(r.maxSamples,P.samples)}function $e(P){const T=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Ce(P){const T=a.render.frame;d.get(P)!==T&&(d.set(P,T),P.update())}function ut(P,T){const G=P.colorSpace,Z=P.format,te=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||G!==xs&&G!==Bt&&(Je.getTransfer(G)===at?(Z!==St||te!==Lt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),T}function Re(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=U,this.setTexture2D=V,this.setTexture2DArray=k,this.setTexture3D=H,this.setTextureCube=z,this.rebindTextures=Ge,this.setupRenderTarget=ft,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=An,this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=ie,this.useMultisampledRTT=$e}function _1(n,e){function t(i,r=Bt){let s;const a=Je.getTransfer(r);if(i===Lt)return n.UNSIGNED_BYTE;if(i===Qu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Zu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Jp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Qp)return n.BYTE;if(i===Zp)return n.SHORT;if(i===ua)return n.UNSIGNED_SHORT;if(i===Ku)return n.INT;if(i===xr)return n.UNSIGNED_INT;if(i===mi)return n.FLOAT;if(i===ya)return n.HALF_FLOAT;if(i===em)return n.ALPHA;if(i===tm)return n.RGB;if(i===St)return n.RGBA;if(i===nm)return n.LUMINANCE;if(i===im)return n.LUMINANCE_ALPHA;if(i===ss)return n.DEPTH_COMPONENT;if(i===ys)return n.DEPTH_STENCIL;if(i===rm)return n.RED;if(i===Ju)return n.RED_INTEGER;if(i===sm)return n.RG;if(i===ed)return n.RG_INTEGER;if(i===td)return n.RGBA_INTEGER;if(i===yo||i===xo||i===bo||i===_o)if(a===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===yo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===xo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===bo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===_o)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===yo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===xo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===bo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===_o)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Wc||i===qc||i===Xc||i===$c)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Wc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===qc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Xc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===$c)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Yc||i===jc||i===Kc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Yc||i===jc)return a===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Kc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Qc||i===Zc||i===Jc||i===eu||i===tu||i===nu||i===iu||i===ru||i===su||i===au||i===ou||i===lu||i===cu||i===uu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Qc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Zc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Jc)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===eu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===tu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===nu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===iu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ru)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===su)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===au)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ou)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===lu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===cu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===uu)return a===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===wo||i===du||i===hu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===wo)return a===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===du)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===hu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===am||i===fu||i===pu||i===mu)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===wo)return s.COMPRESSED_RED_RGTC1_EXT;if(i===fu)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===pu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===mu)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===vs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const w1={type:"move"};class ac{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Qr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Qr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Qr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),u=this._getHandJoint(c,x);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=d.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(w1)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Qr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const S1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M1=`
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

}`;class E1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new ln,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Vt({vertexShader:S1,fragmentShader:M1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Gt(new Ss(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class T1 extends Mr{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,d=null,h=null,f=null,p=null,g=null;const x=new E1,m=t.getContextAttributes();let u=null,y=null;const b=[],v=[],M=new Ee;let S=null;const E=new In;E.viewport=new yt;const A=new In;A.viewport=new yt;const w=[E,A],_=new qv;let R=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let K=b[X];return K===void 0&&(K=new ac,b[X]=K),K.getTargetRaySpace()},this.getControllerGrip=function(X){let K=b[X];return K===void 0&&(K=new ac,b[X]=K),K.getGripSpace()},this.getHand=function(X){let K=b[X];return K===void 0&&(K=new ac,b[X]=K),K.getHandSpace()};function L(X){const K=v.indexOf(X.inputSource);if(K===-1)return;const ie=b[K];ie!==void 0&&(ie.update(X.inputSource,X.frame,c||a),ie.dispatchEvent({type:X.type,data:X.inputSource}))}function O(){r.removeEventListener("select",L),r.removeEventListener("selectstart",L),r.removeEventListener("selectend",L),r.removeEventListener("squeeze",L),r.removeEventListener("squeezestart",L),r.removeEventListener("squeezeend",L),r.removeEventListener("end",O),r.removeEventListener("inputsourceschange",V);for(let X=0;X<b.length;X++){const K=v[X];K!==null&&(v[X]=null,b[X].disconnect(K))}R=null,U=null,x.reset(),e.setRenderTarget(u),p=null,f=null,h=null,r=null,y=null,ge.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(M.width,M.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",L),r.addEventListener("selectstart",L),r.addEventListener("selectend",L),r.addEventListener("squeeze",L),r.addEventListener("squeezestart",L),r.addEventListener("squeezeend",L),r.addEventListener("end",O),r.addEventListener("inputsourceschange",V),m.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(M),r.renderState.layers===void 0){const K={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,K),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new br(p.framebufferWidth,p.framebufferHeight,{format:St,type:Lt,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let K=null,ie=null,ee=null;m.depth&&(ee=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,K=m.stencil?ys:ss,ie=m.stencil?vs:xr);const ve={colorFormat:t.RGBA8,depthFormat:ee,scaleFactor:s};h=new XRWebGLBinding(r,t),f=h.createProjectionLayer(ve),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new br(f.textureWidth,f.textureHeight,{format:St,type:Lt,depthTexture:new wm(f.textureWidth,f.textureHeight,ie,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ge.setContext(r),ge.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function V(X){for(let K=0;K<X.removed.length;K++){const ie=X.removed[K],ee=v.indexOf(ie);ee>=0&&(v[ee]=null,b[ee].disconnect(ie))}for(let K=0;K<X.added.length;K++){const ie=X.added[K];let ee=v.indexOf(ie);if(ee===-1){for(let fe=0;fe<b.length;fe++)if(fe>=v.length){v.push(ie),ee=fe;break}else if(v[fe]===null){v[fe]=ie,ee=fe;break}if(ee===-1)break}const ve=b[ee];ve&&ve.connect(ie)}}const k=new D,H=new D;function z(X,K,ie){k.setFromMatrixPosition(K.matrixWorld),H.setFromMatrixPosition(ie.matrixWorld);const ee=k.distanceTo(H),ve=K.projectionMatrix.elements,fe=ie.projectionMatrix.elements,Ge=ve[14]/(ve[10]-1),ft=ve[14]/(ve[10]+1),je=(ve[9]+1)/ve[5],xt=(ve[9]-1)/ve[5],I=(ve[8]-1)/ve[0],An=(fe[8]+1)/fe[0],Xe=Ge*I,$e=Ge*An,Ce=ee/(-I+An),ut=Ce*-I;if(K.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(ut),X.translateZ(Ce),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),ve[10]===-1)X.projectionMatrix.copy(K.projectionMatrix),X.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const Re=Ge+Ce,P=ft+Ce,T=Xe-ut,G=$e+(ee-ut),Z=je*ft/P*Re,te=xt*ft/P*Re;X.projectionMatrix.makePerspective(T,G,Z,te,Re,P),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function Y(X,K){K===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(K.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let K=X.near,ie=X.far;x.texture!==null&&(x.depthNear>0&&(K=x.depthNear),x.depthFar>0&&(ie=x.depthFar)),_.near=A.near=E.near=K,_.far=A.far=E.far=ie,(R!==_.near||U!==_.far)&&(r.updateRenderState({depthNear:_.near,depthFar:_.far}),R=_.near,U=_.far),E.layers.mask=X.layers.mask|2,A.layers.mask=X.layers.mask|4,_.layers.mask=E.layers.mask|A.layers.mask;const ee=X.parent,ve=_.cameras;Y(_,ee);for(let fe=0;fe<ve.length;fe++)Y(ve[fe],ee);ve.length===2?z(_,E,A):_.projectionMatrix.copy(E.projectionMatrix),ne(X,_,ee)};function ne(X,K,ie){ie===null?X.matrix.copy(K.matrixWorld):(X.matrix.copy(ie.matrixWorld),X.matrix.invert(),X.matrix.multiply(K.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(K.projectionMatrix),X.projectionMatrixInverse.copy(K.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=da*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(X){l=X,f!==null&&(f.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let le=null;function oe(X,K){if(d=K.getViewerPose(c||a),g=K,d!==null){const ie=d.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let ee=!1;ie.length!==_.cameras.length&&(_.cameras.length=0,ee=!0);for(let fe=0;fe<ie.length;fe++){const Ge=ie[fe];let ft=null;if(p!==null)ft=p.getViewport(Ge);else{const xt=h.getViewSubImage(f,Ge);ft=xt.viewport,fe===0&&(e.setRenderTargetTextures(y,xt.colorTexture,f.ignoreDepthValues?void 0:xt.depthStencilTexture),e.setRenderTarget(y))}let je=w[fe];je===void 0&&(je=new In,je.layers.enable(fe),je.viewport=new yt,w[fe]=je),je.matrix.fromArray(Ge.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(Ge.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(ft.x,ft.y,ft.width,ft.height),fe===0&&(_.matrix.copy(je.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),ee===!0&&_.cameras.push(je)}const ve=r.enabledFeatures;if(ve&&ve.includes("depth-sensing")){const fe=h.getDepthInformation(ie[0]);fe&&fe.isValid&&fe.texture&&x.init(e,fe,r.renderState)}}for(let ie=0;ie<b.length;ie++){const ee=v[ie],ve=b[ie];ee!==null&&ve!==void 0&&ve.update(ee,K,c||a)}le&&le(X,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),g=null}const ge=new Tm;ge.setAnimationLoop(oe),this.setAnimationLoop=function(X){le=X},this.dispose=function(){}}}const lr=new Yn,A1=new ot;function C1(n,e){function t(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,mm(n)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,y,b,v){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),h(m,u)):u.isMeshPhongMaterial?(s(m,u),d(m,u)):u.isMeshStandardMaterial?(s(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,v)):u.isMeshMatcapMaterial?(s(m,u),g(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),x(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(a(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?l(m,u,y,b):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,t(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===on&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,t(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===on&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,t(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,t(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const y=e.get(u),b=y.envMap,v=y.envMapRotation;b&&(m.envMap.value=b,lr.copy(v),lr.x*=-1,lr.y*=-1,lr.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(lr.y*=-1,lr.z*=-1),m.envMapRotation.value.setFromMatrix4(A1.makeRotationFromEuler(lr)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,m.aoMapTransform))}function a(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,y,b){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*y,m.scale.value=b*.5,u.map&&(m.map.value=u.map,t(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function d(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function h(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,y){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===on&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,u){u.matcap&&(m.matcap.value=u.matcap)}function x(m,u){const y=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function R1(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,b){const v=b.program;i.uniformBlockBinding(y,v)}function c(y,b){let v=r[y.id];v===void 0&&(g(y),v=d(y),r[y.id]=v,y.addEventListener("dispose",m));const M=b.program;i.updateUBOMapping(y,M);const S=e.render.frame;s[y.id]!==S&&(f(y),s[y.id]=S)}function d(y){const b=h();y.__bindingPointIndex=b;const v=n.createBuffer(),M=y.__size,S=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,M,S),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,b,v),v}function h(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const b=r[y.id],v=y.uniforms,M=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,b);for(let S=0,E=v.length;S<E;S++){const A=Array.isArray(v[S])?v[S]:[v[S]];for(let w=0,_=A.length;w<_;w++){const R=A[w];if(p(R,S,w,M)===!0){const U=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let O=0;for(let V=0;V<L.length;V++){const k=L[V],H=x(k);typeof k=="number"||typeof k=="boolean"?(R.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,U+O,R.__data)):k.isMatrix3?(R.__data[0]=k.elements[0],R.__data[1]=k.elements[1],R.__data[2]=k.elements[2],R.__data[3]=0,R.__data[4]=k.elements[3],R.__data[5]=k.elements[4],R.__data[6]=k.elements[5],R.__data[7]=0,R.__data[8]=k.elements[6],R.__data[9]=k.elements[7],R.__data[10]=k.elements[8],R.__data[11]=0):(k.toArray(R.__data,O),O+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,b,v,M){const S=y.value,E=b+"_"+v;if(M[E]===void 0)return typeof S=="number"||typeof S=="boolean"?M[E]=S:M[E]=S.clone(),!0;{const A=M[E];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return M[E]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function g(y){const b=y.uniforms;let v=0;const M=16;for(let E=0,A=b.length;E<A;E++){const w=Array.isArray(b[E])?b[E]:[b[E]];for(let _=0,R=w.length;_<R;_++){const U=w[_],L=Array.isArray(U.value)?U.value:[U.value];for(let O=0,V=L.length;O<V;O++){const k=L[O],H=x(k),z=v%M,Y=z%H.boundary,ne=z+Y;v+=Y,ne!==0&&M-ne<H.storage&&(v+=M-ne),U.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=H.storage}}}const S=v%M;return S>0&&(v+=M-S),y.__size=v,y.__cache={},this}function x(y){const b={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(b.boundary=4,b.storage=4):y.isVector2?(b.boundary=8,b.storage=8):y.isVector3||y.isColor?(b.boundary=16,b.storage=12):y.isVector4?(b.boundary=16,b.storage=16):y.isMatrix3?(b.boundary=48,b.storage=48):y.isMatrix4?(b.boundary=64,b.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),b}function m(y){const b=y.target;b.removeEventListener("dispose",m);const v=a.indexOf(b.__bindingPointIndex);a.splice(v,1),n.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function u(){for(const y in r)n.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class oc{constructor(e={}){const{canvas:t=rv(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,u=null;const y=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=wn,this.toneMapping=ki,this.toneMappingExposure=1;const v=this;let M=!1,S=0,E=0,A=null,w=-1,_=null;const R=new yt,U=new yt;let L=null;const O=new Se(0);let V=0,k=t.width,H=t.height,z=1,Y=null,ne=null;const le=new yt(0,0,k,H),oe=new yt(0,0,k,H);let ge=!1;const X=new ad;let K=!1,ie=!1;const ee=new ot,ve=new ot,fe=new D,Ge=new yt,ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function xt(){return A===null?z:1}let I=i;function An(C,F){return t.getContext(C,F)}try{const C={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Yu}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",me,!1),t.addEventListener("webglcontextcreationerror",pe,!1),I===null){const F="webgl2";if(I=An(F,C),I===null)throw An(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Xe,$e,Ce,ut,Re,P,T,G,Z,te,Q,Te,he,xe,Ke,se,be,Ie,Ne,_e,Ye,ze,ct,N;function ue(){Xe=new zb(I),Xe.init(),ze=new _1(I,Xe),$e=new Lb(I,Xe,e,ze),Ce=new x1(I,Xe),$e.reverseDepthBuffer&&f&&Ce.buffers.depth.setReversed(!0),ut=new Vb(I),Re=new a1,P=new b1(I,Xe,Ce,Re,$e,ze,ut),T=new Nb(v),G=new Ob(v),Z=new jv(I),ct=new Db(I,Z),te=new kb(I,Z,ut,ct),Q=new Wb(I,te,Z,ut),Ne=new Hb(I,$e,P),se=new Ub(Re),Te=new s1(v,T,G,Xe,$e,ct,se),he=new C1(v,Re),xe=new l1,Ke=new p1(Xe),Ie=new Pb(v,T,G,Ce,Q,p,l),be=new v1(v,Q,$e),N=new R1(I,ut,$e,Ce),_e=new Ib(I,Xe,ut),Ye=new Gb(I,Xe,ut),ut.programs=Te.programs,v.capabilities=$e,v.extensions=Xe,v.properties=Re,v.renderLists=xe,v.shadowMap=be,v.state=Ce,v.info=ut}ue();const $=new T1(v,I);this.xr=$,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const C=Xe.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Xe.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(C){C!==void 0&&(z=C,this.setSize(k,H,!1))},this.getSize=function(C){return C.set(k,H)},this.setSize=function(C,F,W=!0){if($.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=C,H=F,t.width=Math.floor(C*z),t.height=Math.floor(F*z),W===!0&&(t.style.width=C+"px",t.style.height=F+"px"),this.setViewport(0,0,C,F)},this.getDrawingBufferSize=function(C){return C.set(k*z,H*z).floor()},this.setDrawingBufferSize=function(C,F,W){k=C,H=F,z=W,t.width=Math.floor(C*W),t.height=Math.floor(F*W),this.setViewport(0,0,C,F)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(le)},this.setViewport=function(C,F,W,q){C.isVector4?le.set(C.x,C.y,C.z,C.w):le.set(C,F,W,q),Ce.viewport(R.copy(le).multiplyScalar(z).round())},this.getScissor=function(C){return C.copy(oe)},this.setScissor=function(C,F,W,q){C.isVector4?oe.set(C.x,C.y,C.z,C.w):oe.set(C,F,W,q),Ce.scissor(U.copy(oe).multiplyScalar(z).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(C){Ce.setScissorTest(ge=C)},this.setOpaqueSort=function(C){Y=C},this.setTransparentSort=function(C){ne=C},this.getClearColor=function(C){return C.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor.apply(Ie,arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha.apply(Ie,arguments)},this.clear=function(C=!0,F=!0,W=!0){let q=0;if(C){let B=!1;if(A!==null){const re=A.texture.format;B=re===td||re===ed||re===Ju}if(B){const re=A.texture.type,de=re===Lt||re===xr||re===ua||re===vs||re===Qu||re===Zu,ye=Ie.getClearColor(),we=Ie.getClearAlpha(),Fe=ye.r,Be=ye.g,Pe=ye.b;de?(g[0]=Fe,g[1]=Be,g[2]=Pe,g[3]=we,I.clearBufferuiv(I.COLOR,0,g)):(x[0]=Fe,x[1]=Be,x[2]=Pe,x[3]=we,I.clearBufferiv(I.COLOR,0,x))}else q|=I.COLOR_BUFFER_BIT}F&&(q|=I.DEPTH_BUFFER_BIT),W&&(q|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",me,!1),t.removeEventListener("webglcontextcreationerror",pe,!1),Ie.dispose(),xe.dispose(),Ke.dispose(),Re.dispose(),T.dispose(),G.dispose(),Q.dispose(),ct.dispose(),N.dispose(),Te.dispose(),$.dispose(),$.removeEventListener("sessionstart",Vd),$.removeEventListener("sessionend",Hd),tr.stop()};function J(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function me(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const C=ut.autoReset,F=be.enabled,W=be.autoUpdate,q=be.needsUpdate,B=be.type;ue(),ut.autoReset=C,be.enabled=F,be.autoUpdate=W,be.needsUpdate=q,be.type=B}function pe(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Oe(C){const F=C.target;F.removeEventListener("dispose",Oe),mt(F)}function mt(C){Xt(C),Re.remove(C)}function Xt(C){const F=Re.get(C).programs;F!==void 0&&(F.forEach(function(W){Te.releaseProgram(W)}),C.isShaderMaterial&&Te.releaseShaderCache(C))}this.renderBufferDirect=function(C,F,W,q,B,re){F===null&&(F=ft);const de=B.isMesh&&B.matrixWorld.determinant()<0,ye=j0(C,F,W,q,B);Ce.setMaterial(q,de);let we=W.index,Fe=1;if(q.wireframe===!0){if(we=te.getWireframeAttribute(W),we===void 0)return;Fe=2}const Be=W.drawRange,Pe=W.attributes.position;let Qe=Be.start*Fe,tt=(Be.start+Be.count)*Fe;re!==null&&(Qe=Math.max(Qe,re.start*Fe),tt=Math.min(tt,(re.start+re.count)*Fe)),we!==null?(Qe=Math.max(Qe,0),tt=Math.min(tt,we.count)):Pe!=null&&(Qe=Math.max(Qe,0),tt=Math.min(tt,Pe.count));const At=tt-Qe;if(At<0||At===1/0)return;ct.setup(B,q,ye,W,we);let gt,Ze=_e;if(we!==null&&(gt=Z.get(we),Ze=Ye,Ze.setIndex(gt)),B.isMesh)q.wireframe===!0?(Ce.setLineWidth(q.wireframeLinewidth*xt()),Ze.setMode(I.LINES)):Ze.setMode(I.TRIANGLES);else if(B.isLine){let De=q.linewidth;De===void 0&&(De=1),Ce.setLineWidth(De*xt()),B.isLineSegments?Ze.setMode(I.LINES):B.isLineLoop?Ze.setMode(I.LINE_LOOP):Ze.setMode(I.LINE_STRIP)}else B.isPoints?Ze.setMode(I.POINTS):B.isSprite&&Ze.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Ze.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Xe.get("WEBGL_multi_draw"))Ze.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const De=B._multiDrawStarts,zt=B._multiDrawCounts,nt=B._multiDrawCount,Bn=we?Z.get(we).bytesPerElement:1,Tr=Re.get(q).currentProgram.getUniforms();for(let vn=0;vn<nt;vn++)Tr.setValue(I,"_gl_DrawID",vn),Ze.render(De[vn]/Bn,zt[vn])}else if(B.isInstancedMesh)Ze.renderInstances(Qe,At,B.count);else if(W.isInstancedBufferGeometry){const De=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,zt=Math.min(W.instanceCount,De);Ze.renderInstances(Qe,At,zt)}else Ze.render(Qe,At)};function rt(C,F,W){C.transparent===!0&&C.side===Ln&&C.forceSinglePass===!1?(C.side=on,C.needsUpdate=!0,Ca(C,F,W),C.side=En,C.needsUpdate=!0,Ca(C,F,W),C.side=Ln):Ca(C,F,W)}this.compile=function(C,F,W=null){W===null&&(W=C),u=Ke.get(W),u.init(F),b.push(u),W.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),C!==W&&C.traverseVisible(function(B){B.isLight&&B.layers.test(F.layers)&&(u.pushLight(B),B.castShadow&&u.pushShadow(B))}),u.setupLights();const q=new Set;return C.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const re=B.material;if(re)if(Array.isArray(re))for(let de=0;de<re.length;de++){const ye=re[de];rt(ye,W,B),q.add(ye)}else rt(re,W,B),q.add(re)}),b.pop(),u=null,q},this.compileAsync=function(C,F,W=null){const q=this.compile(C,F,W);return new Promise(B=>{function re(){if(q.forEach(function(de){Re.get(de).currentProgram.isReady()&&q.delete(de)}),q.size===0){B(C);return}setTimeout(re,10)}Xe.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let Fn=null;function ii(C){Fn&&Fn(C)}function Vd(){tr.stop()}function Hd(){tr.start()}const tr=new Tm;tr.setAnimationLoop(ii),typeof self<"u"&&tr.setContext(self),this.setAnimationLoop=function(C){Fn=C,$.setAnimationLoop(C),C===null?tr.stop():tr.start()},$.addEventListener("sessionstart",Vd),$.addEventListener("sessionend",Hd),this.render=function(C,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),$.enabled===!0&&$.isPresenting===!0&&($.cameraAutoUpdate===!0&&$.updateCamera(F),F=$.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,F,A),u=Ke.get(C,b.length),u.init(F),b.push(u),ve.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),X.setFromProjectionMatrix(ve),ie=this.localClippingEnabled,K=se.init(this.clippingPlanes,ie),m=xe.get(C,y.length),m.init(),y.push(m),$.enabled===!0&&$.isPresenting===!0){const re=v.xr.getDepthSensingMesh();re!==null&&Cl(re,F,-1/0,v.sortObjects)}Cl(C,F,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Y,ne),je=$.enabled===!1||$.isPresenting===!1||$.hasDepthSensing()===!1,je&&Ie.addToRenderList(m,C),this.info.render.frame++,K===!0&&se.beginShadows();const W=u.state.shadowsArray;be.render(W,C,F),K===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=m.opaque,B=m.transmissive;if(u.setupLights(),F.isArrayCamera){const re=F.cameras;if(B.length>0)for(let de=0,ye=re.length;de<ye;de++){const we=re[de];qd(q,B,C,we)}je&&Ie.render(C);for(let de=0,ye=re.length;de<ye;de++){const we=re[de];Wd(m,C,we,we.viewport)}}else B.length>0&&qd(q,B,C,F),je&&Ie.render(C),Wd(m,C,F);A!==null&&(P.updateMultisampleRenderTarget(A),P.updateRenderTargetMipmap(A)),C.isScene===!0&&C.onAfterRender(v,C,F),ct.resetDefaultState(),w=-1,_=null,b.pop(),b.length>0?(u=b[b.length-1],K===!0&&se.setGlobalState(v.clippingPlanes,u.state.camera)):u=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Cl(C,F,W,q){if(C.visible===!1)return;if(C.layers.test(F.layers)){if(C.isGroup)W=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(F);else if(C.isLight)u.pushLight(C),C.castShadow&&u.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||X.intersectsSprite(C)){q&&Ge.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ve);const de=Q.update(C),ye=C.material;ye.visible&&m.push(C,de,ye,W,Ge.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||X.intersectsObject(C))){const de=Q.update(C),ye=C.material;if(q&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ge.copy(C.boundingSphere.center)):(de.boundingSphere===null&&de.computeBoundingSphere(),Ge.copy(de.boundingSphere.center)),Ge.applyMatrix4(C.matrixWorld).applyMatrix4(ve)),Array.isArray(ye)){const we=de.groups;for(let Fe=0,Be=we.length;Fe<Be;Fe++){const Pe=we[Fe],Qe=ye[Pe.materialIndex];Qe&&Qe.visible&&m.push(C,de,Qe,W,Ge.z,Pe)}}else ye.visible&&m.push(C,de,ye,W,Ge.z,null)}}const re=C.children;for(let de=0,ye=re.length;de<ye;de++)Cl(re[de],F,W,q)}function Wd(C,F,W,q){const B=C.opaque,re=C.transmissive,de=C.transparent;u.setupLightsView(W),K===!0&&se.setGlobalState(v.clippingPlanes,W),q&&Ce.viewport(R.copy(q)),B.length>0&&Aa(B,F,W),re.length>0&&Aa(re,F,W),de.length>0&&Aa(de,F,W),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function qd(C,F,W,q){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[q.id]===void 0&&(u.state.transmissionRenderTarget[q.id]=new br(1,1,{generateMipmaps:!0,type:Xe.has("EXT_color_buffer_half_float")||Xe.has("EXT_color_buffer_float")?ya:Lt,minFilter:pr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const re=u.state.transmissionRenderTarget[q.id],de=q.viewport||R;re.setSize(de.z,de.w);const ye=v.getRenderTarget();v.setRenderTarget(re),v.getClearColor(O),V=v.getClearAlpha(),V<1&&v.setClearColor(16777215,.5),v.clear(),je&&Ie.render(W);const we=v.toneMapping;v.toneMapping=ki;const Fe=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),u.setupLightsView(q),K===!0&&se.setGlobalState(v.clippingPlanes,q),Aa(C,W,q),P.updateMultisampleRenderTarget(re),P.updateRenderTargetMipmap(re),Xe.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let Pe=0,Qe=F.length;Pe<Qe;Pe++){const tt=F[Pe],At=tt.object,gt=tt.geometry,Ze=tt.material,De=tt.group;if(Ze.side===Ln&&At.layers.test(q.layers)){const zt=Ze.side;Ze.side=on,Ze.needsUpdate=!0,Xd(At,W,q,gt,Ze,De),Ze.side=zt,Ze.needsUpdate=!0,Be=!0}}Be===!0&&(P.updateMultisampleRenderTarget(re),P.updateRenderTargetMipmap(re))}v.setRenderTarget(ye),v.setClearColor(O,V),Fe!==void 0&&(q.viewport=Fe),v.toneMapping=we}function Aa(C,F,W){const q=F.isScene===!0?F.overrideMaterial:null;for(let B=0,re=C.length;B<re;B++){const de=C[B],ye=de.object,we=de.geometry,Fe=q===null?de.material:q,Be=de.group;ye.layers.test(W.layers)&&Xd(ye,F,W,we,Fe,Be)}}function Xd(C,F,W,q,B,re){C.onBeforeRender(v,F,W,q,B,re),C.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),B.onBeforeRender(v,F,W,q,C,re),B.transparent===!0&&B.side===Ln&&B.forceSinglePass===!1?(B.side=on,B.needsUpdate=!0,v.renderBufferDirect(W,F,q,B,C,re),B.side=En,B.needsUpdate=!0,v.renderBufferDirect(W,F,q,B,C,re),B.side=Ln):v.renderBufferDirect(W,F,q,B,C,re),C.onAfterRender(v,F,W,q,B,re)}function Ca(C,F,W){F.isScene!==!0&&(F=ft);const q=Re.get(C),B=u.state.lights,re=u.state.shadowsArray,de=B.state.version,ye=Te.getParameters(C,B.state,re,F,W),we=Te.getProgramCacheKey(ye);let Fe=q.programs;q.environment=C.isMeshStandardMaterial?F.environment:null,q.fog=F.fog,q.envMap=(C.isMeshStandardMaterial?G:T).get(C.envMap||q.environment),q.envMapRotation=q.environment!==null&&C.envMap===null?F.environmentRotation:C.envMapRotation,Fe===void 0&&(C.addEventListener("dispose",Oe),Fe=new Map,q.programs=Fe);let Be=Fe.get(we);if(Be!==void 0){if(q.currentProgram===Be&&q.lightsStateVersion===de)return Yd(C,ye),Be}else ye.uniforms=Te.getUniforms(C),C.onBeforeCompile(ye,v),Be=Te.acquireProgram(ye,we),Fe.set(we,Be),q.uniforms=ye.uniforms;const Pe=q.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Pe.clippingPlanes=se.uniform),Yd(C,ye),q.needsLights=Q0(C),q.lightsStateVersion=de,q.needsLights&&(Pe.ambientLightColor.value=B.state.ambient,Pe.lightProbe.value=B.state.probe,Pe.directionalLights.value=B.state.directional,Pe.directionalLightShadows.value=B.state.directionalShadow,Pe.spotLights.value=B.state.spot,Pe.spotLightShadows.value=B.state.spotShadow,Pe.rectAreaLights.value=B.state.rectArea,Pe.ltc_1.value=B.state.rectAreaLTC1,Pe.ltc_2.value=B.state.rectAreaLTC2,Pe.pointLights.value=B.state.point,Pe.pointLightShadows.value=B.state.pointShadow,Pe.hemisphereLights.value=B.state.hemi,Pe.directionalShadowMap.value=B.state.directionalShadowMap,Pe.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Pe.spotShadowMap.value=B.state.spotShadowMap,Pe.spotLightMatrix.value=B.state.spotLightMatrix,Pe.spotLightMap.value=B.state.spotLightMap,Pe.pointShadowMap.value=B.state.pointShadowMap,Pe.pointShadowMatrix.value=B.state.pointShadowMatrix),q.currentProgram=Be,q.uniformsList=null,Be}function $d(C){if(C.uniformsList===null){const F=C.currentProgram.getUniforms();C.uniformsList=So.seqWithValue(F.seq,C.uniforms)}return C.uniformsList}function Yd(C,F){const W=Re.get(C);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function j0(C,F,W,q,B){F.isScene!==!0&&(F=ft),P.resetTextureUnits();const re=F.fog,de=q.isMeshStandardMaterial?F.environment:null,ye=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:xs,we=(q.isMeshStandardMaterial?G:T).get(q.envMap||de),Fe=q.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Be=!!W.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Pe=!!W.morphAttributes.position,Qe=!!W.morphAttributes.normal,tt=!!W.morphAttributes.color;let At=ki;q.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(At=v.toneMapping);const gt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ze=gt!==void 0?gt.length:0,De=Re.get(q),zt=u.state.lights;if(K===!0&&(ie===!0||C!==_)){const en=C===_&&q.id===w;se.setState(q,C,en)}let nt=!1;q.version===De.__version?(De.needsLights&&De.lightsStateVersion!==zt.state.version||De.outputColorSpace!==ye||B.isBatchedMesh&&De.batching===!1||!B.isBatchedMesh&&De.batching===!0||B.isBatchedMesh&&De.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&De.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&De.instancing===!1||!B.isInstancedMesh&&De.instancing===!0||B.isSkinnedMesh&&De.skinning===!1||!B.isSkinnedMesh&&De.skinning===!0||B.isInstancedMesh&&De.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&De.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&De.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&De.instancingMorph===!1&&B.morphTexture!==null||De.envMap!==we||q.fog===!0&&De.fog!==re||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==se.numPlanes||De.numIntersection!==se.numIntersection)||De.vertexAlphas!==Fe||De.vertexTangents!==Be||De.morphTargets!==Pe||De.morphNormals!==Qe||De.morphColors!==tt||De.toneMapping!==At||De.morphTargetsCount!==Ze)&&(nt=!0):(nt=!0,De.__version=q.version);let Bn=De.currentProgram;nt===!0&&(Bn=Ca(q,F,B));let Tr=!1,vn=!1,Ts=!1;const dt=Bn.getUniforms(),Cn=De.uniforms;if(Ce.useProgram(Bn.program)&&(Tr=!0,vn=!0,Ts=!0),q.id!==w&&(w=q.id,vn=!0),Tr||_!==C){Ce.buffers.depth.getReversed()?(ee.copy(C.projectionMatrix),av(ee),ov(ee),dt.setValue(I,"projectionMatrix",ee)):dt.setValue(I,"projectionMatrix",C.projectionMatrix),dt.setValue(I,"viewMatrix",C.matrixWorldInverse);const fn=dt.map.cameraPosition;fn!==void 0&&fn.setValue(I,fe.setFromMatrixPosition(C.matrixWorld)),$e.logarithmicDepthBuffer&&dt.setValue(I,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&dt.setValue(I,"isOrthographic",C.isOrthographicCamera===!0),_!==C&&(_=C,vn=!0,Ts=!0)}if(B.isSkinnedMesh){dt.setOptional(I,B,"bindMatrix"),dt.setOptional(I,B,"bindMatrixInverse");const en=B.skeleton;en&&(en.boneTexture===null&&en.computeBoneTexture(),dt.setValue(I,"boneTexture",en.boneTexture,P))}B.isBatchedMesh&&(dt.setOptional(I,B,"batchingTexture"),dt.setValue(I,"batchingTexture",B._matricesTexture,P),dt.setOptional(I,B,"batchingIdTexture"),dt.setValue(I,"batchingIdTexture",B._indirectTexture,P),dt.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&dt.setValue(I,"batchingColorTexture",B._colorsTexture,P));const Rn=W.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&Ne.update(B,W,Bn),(vn||De.receiveShadow!==B.receiveShadow)&&(De.receiveShadow=B.receiveShadow,dt.setValue(I,"receiveShadow",B.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Cn.envMap.value=we,Cn.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&F.environment!==null&&(Cn.envMapIntensity.value=F.environmentIntensity),vn&&(dt.setValue(I,"toneMappingExposure",v.toneMappingExposure),De.needsLights&&K0(Cn,Ts),re&&q.fog===!0&&he.refreshFogUniforms(Cn,re),he.refreshMaterialUniforms(Cn,q,z,H,u.state.transmissionRenderTarget[C.id]),So.upload(I,$d(De),Cn,P)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(So.upload(I,$d(De),Cn,P),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&dt.setValue(I,"center",B.center),dt.setValue(I,"modelViewMatrix",B.modelViewMatrix),dt.setValue(I,"normalMatrix",B.normalMatrix),dt.setValue(I,"modelMatrix",B.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const en=q.uniformsGroups;for(let fn=0,Rl=en.length;fn<Rl;fn++){const nr=en[fn];N.update(nr,Bn),N.bind(nr,Bn)}}return Bn}function K0(C,F){C.ambientLightColor.needsUpdate=F,C.lightProbe.needsUpdate=F,C.directionalLights.needsUpdate=F,C.directionalLightShadows.needsUpdate=F,C.pointLights.needsUpdate=F,C.pointLightShadows.needsUpdate=F,C.spotLights.needsUpdate=F,C.spotLightShadows.needsUpdate=F,C.rectAreaLights.needsUpdate=F,C.hemisphereLights.needsUpdate=F}function Q0(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(C,F,W){Re.get(C.texture).__webglTexture=F,Re.get(C.depthTexture).__webglTexture=W;const q=Re.get(C);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=W===void 0,q.__autoAllocateDepthBuffer||Xe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,F){const W=Re.get(C);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(C,F=0,W=0){A=C,S=F,E=W;let q=!0,B=null,re=!1,de=!1;if(C){const we=Re.get(C);if(we.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(I.FRAMEBUFFER,null),q=!1;else if(we.__webglFramebuffer===void 0)P.setupRenderTarget(C);else if(we.__hasExternalTextures)P.rebindTextures(C,Re.get(C.texture).__webglTexture,Re.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Pe=C.depthTexture;if(we.__boundDepthTexture!==Pe){if(Pe!==null&&Re.has(Pe)&&(C.width!==Pe.image.width||C.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(C)}}const Fe=C.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(de=!0);const Be=Re.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(Be[F])?B=Be[F][W]:B=Be[F],re=!0):C.samples>0&&P.useMultisampledRTT(C)===!1?B=Re.get(C).__webglMultisampledFramebuffer:Array.isArray(Be)?B=Be[W]:B=Be,R.copy(C.viewport),U.copy(C.scissor),L=C.scissorTest}else R.copy(le).multiplyScalar(z).floor(),U.copy(oe).multiplyScalar(z).floor(),L=ge;if(Ce.bindFramebuffer(I.FRAMEBUFFER,B)&&q&&Ce.drawBuffers(C,B),Ce.viewport(R),Ce.scissor(U),Ce.setScissorTest(L),re){const we=Re.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,we.__webglTexture,W)}else if(de){const we=Re.get(C.texture),Fe=F||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,we.__webglTexture,W||0,Fe)}w=-1},this.readRenderTargetPixels=function(C,F,W,q,B,re,de){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Re.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&de!==void 0&&(ye=ye[de]),ye){Ce.bindFramebuffer(I.FRAMEBUFFER,ye);try{const we=C.texture,Fe=we.format,Be=we.type;if(!$e.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=C.width-q&&W>=0&&W<=C.height-B&&I.readPixels(F,W,q,B,ze.convert(Fe),ze.convert(Be),re)}finally{const we=A!==null?Re.get(A).__webglFramebuffer:null;Ce.bindFramebuffer(I.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(C,F,W,q,B,re,de){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Re.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&de!==void 0&&(ye=ye[de]),ye){const we=C.texture,Fe=we.format,Be=we.type;if(!$e.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=C.width-q&&W>=0&&W<=C.height-B){Ce.bindFramebuffer(I.FRAMEBUFFER,ye);const Pe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.bufferData(I.PIXEL_PACK_BUFFER,re.byteLength,I.STREAM_READ),I.readPixels(F,W,q,B,ze.convert(Fe),ze.convert(Be),0);const Qe=A!==null?Re.get(A).__webglFramebuffer:null;Ce.bindFramebuffer(I.FRAMEBUFFER,Qe);const tt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await sv(I,tt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,re),I.deleteBuffer(Pe),I.deleteSync(tt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(C,F=null,W=0){C.isTexture!==!0&&(jr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,C=arguments[1]);const q=Math.pow(2,-W),B=Math.floor(C.image.width*q),re=Math.floor(C.image.height*q),de=F!==null?F.x:0,ye=F!==null?F.y:0;P.setTexture2D(C,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,de,ye,B,re),Ce.unbindTexture()};const Z0=I.createFramebuffer(),J0=I.createFramebuffer();this.copyTextureToTexture=function(C,F,W=null,q=null,B=0,re=null){C.isTexture!==!0&&(jr("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,C=arguments[1],F=arguments[2],re=arguments[3]||0,W=null),re===null&&(B!==0?(jr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=B,B=0):re=0);let de,ye,we,Fe,Be,Pe,Qe,tt,At;const gt=C.isCompressedTexture?C.mipmaps[re]:C.image;if(W!==null)de=W.max.x-W.min.x,ye=W.max.y-W.min.y,we=W.isBox3?W.max.z-W.min.z:1,Fe=W.min.x,Be=W.min.y,Pe=W.isBox3?W.min.z:0;else{const Rn=Math.pow(2,-B);de=Math.floor(gt.width*Rn),ye=Math.floor(gt.height*Rn),C.isDataArrayTexture?we=gt.depth:C.isData3DTexture?we=Math.floor(gt.depth*Rn):we=1,Fe=0,Be=0,Pe=0}q!==null?(Qe=q.x,tt=q.y,At=q.z):(Qe=0,tt=0,At=0);const Ze=ze.convert(F.format),De=ze.convert(F.type);let zt;F.isData3DTexture?(P.setTexture3D(F,0),zt=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(P.setTexture2DArray(F,0),zt=I.TEXTURE_2D_ARRAY):(P.setTexture2D(F,0),zt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);const nt=I.getParameter(I.UNPACK_ROW_LENGTH),Bn=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Tr=I.getParameter(I.UNPACK_SKIP_PIXELS),vn=I.getParameter(I.UNPACK_SKIP_ROWS),Ts=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,gt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,gt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Fe),I.pixelStorei(I.UNPACK_SKIP_ROWS,Be),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Pe);const dt=C.isDataArrayTexture||C.isData3DTexture,Cn=F.isDataArrayTexture||F.isData3DTexture;if(C.isDepthTexture){const Rn=Re.get(C),en=Re.get(F),fn=Re.get(Rn.__renderTarget),Rl=Re.get(en.__renderTarget);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,fn.__webglFramebuffer),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,Rl.__webglFramebuffer);for(let nr=0;nr<we;nr++)dt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Re.get(C).__webglTexture,B,Pe+nr),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Re.get(F).__webglTexture,re,At+nr)),I.blitFramebuffer(Fe,Be,de,ye,Qe,tt,de,ye,I.DEPTH_BUFFER_BIT,I.NEAREST);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(B!==0||C.isRenderTargetTexture||Re.has(C)){const Rn=Re.get(C),en=Re.get(F);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,Z0),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,J0);for(let fn=0;fn<we;fn++)dt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Rn.__webglTexture,B,Pe+fn):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Rn.__webglTexture,B),Cn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,en.__webglTexture,re,At+fn):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,en.__webglTexture,re),B!==0?I.blitFramebuffer(Fe,Be,de,ye,Qe,tt,de,ye,I.COLOR_BUFFER_BIT,I.NEAREST):Cn?I.copyTexSubImage3D(zt,re,Qe,tt,At+fn,Fe,Be,de,ye):I.copyTexSubImage2D(zt,re,Qe,tt,Fe,Be,de,ye);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Cn?C.isDataTexture||C.isData3DTexture?I.texSubImage3D(zt,re,Qe,tt,At,de,ye,we,Ze,De,gt.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(zt,re,Qe,tt,At,de,ye,we,Ze,gt.data):I.texSubImage3D(zt,re,Qe,tt,At,de,ye,we,Ze,De,gt):C.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,re,Qe,tt,de,ye,Ze,De,gt.data):C.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,re,Qe,tt,gt.width,gt.height,Ze,gt.data):I.texSubImage2D(I.TEXTURE_2D,re,Qe,tt,de,ye,Ze,De,gt);I.pixelStorei(I.UNPACK_ROW_LENGTH,nt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Bn),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Tr),I.pixelStorei(I.UNPACK_SKIP_ROWS,vn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ts),re===0&&F.generateMipmaps&&I.generateMipmap(zt),Ce.unbindTexture()},this.copyTextureToTexture3D=function(C,F,W=null,q=null,B=0){return C.isTexture!==!0&&(jr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,q=arguments[1]||null,C=arguments[2],F=arguments[3],B=arguments[4]||0),jr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(C,F,W,q,B)},this.initRenderTarget=function(C){Re.get(C).__webglFramebuffer===void 0&&P.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?P.setTextureCube(C,0):C.isData3DTexture?P.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?P.setTexture2DArray(C,0):P.setTexture2D(C,0),Ce.unbindTexture()},this.resetState=function(){S=0,E=0,A=null,Ce.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}const un=10,Gi=1e3,Dm=Gi*1e3*.5,P1=2,D1=.74,I1=.9,L1=.76,U1=-2.4,N1="#ffffff",F1=256,B1=1,O1=2,z1=1,k1=1,G1=1,V1=.75,H1=.25,W1=.9,dd=1,hd=6,q1=23.4,X1=0,$1=.25,$o={fast:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:un,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:16,iceCap:.15,plateDelta:1.25,plateSizeVariance:.35,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"ridge",atmosphereEnabled:!0,cloudEnabled:!1,cloudAlpha:D1,cloudSpeed:I1,cloudQuantity:L1,cloudHeight:U1,cloudColor:N1,cloudResolution:F1,cloudShader:"billow",waterCycleEnabled:!0,waterCycleCloudEnabled:!0,waterCycleRun:!0,weatherAutoScale:!1,weatherSimMode:"3d",weatherVolumeRes:8,weatherRayStepsMin:4,weatherRayStepsMax:6,weatherRayBundle:8,weatherAtmoThickness:60,axialTilt:q1,seasonProgress:X1,weatherDebug:"off",weatherSpeed:B1,weatherUpdateHz:1,weatherMoistureLayers:O1,weatherEvap:z1,weatherPrecip:k1,weatherWind:G1,weatherWetness:V1,weatherOceanInertia:H1,weatherOceanWindCoupling:dd,weatherOceanWindUpdateHz:hd,weatherRainFxEnabled:!0,weatherRainFx:1,weatherRainHaze:W1},balanced:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:un,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:128,iceCap:.12,plateDelta:1.25,plateSizeVariance:.35,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"mixed",weatherAutoScale:!0},high:{resolution:384,numPlates:9,jitter:.6,iterations:8e4,erosionRate:.36,evaporation:.5,radius:un,heightScale:18.2,seaLevel:.53,smoothPasses:20,subdivisions:128,iceCap:.15,plateDelta:1.25,plateSizeVariance:.45,desymmetrizeTiling:!0,atmosphere:.35,atmosphereHeight:.5,atmosphereAlpha:1,atmosphereColor:"#4da8ff",faultType:"ridge",weatherAutoScale:!0}};class Y1{constructor(e,t,i,r,s=null){this.camera=e,this.domElement=t,this.scene=i,this.onExitCallback=r,this.externalInput=s,this.planetMesh=null,this.planetGroup=null,this.surfaceRay=new yu,this.planetRadius=un,this.walkSpeed=.5,this.runSpeed=1,this.flySpeed=4,this.swimSpeed=.25,this.jumpForce=3,this.gravity=30,this.playerHeight=.02,this.accelGround=32,this.accelAir=10,this.accelFly=14,this.accelSwim=10,this.frictionGround=9,this.stopSpeed=1.2,this.enabled=!1,this.isLocked=!1,this.isFlying=!1,this.isSwimming=!1,this.moveForward=!1,this.moveBackward=!1,this.moveLeft=!1,this.moveRight=!1,this.moveUp=!1,this.moveDown=!1,this.rollLeft=!1,this.rollRight=!1,this.lookUp=!1,this.lookDown=!1,this.lookLeft=!1,this.lookRight=!1,this.isRunning=!1,this.canJump=!1,this.jumpRequested=!1,this.keyLookYawVelocity=0,this.keyLookPitchVelocity=0,this.keyLookRollVelocity=0,this.velocity=new D,this.direction=new D,this.verticalVelocity=0,this.horizontalVelocity=new D,this.keyLookSpeed=1.8,this.keyRollSpeed=2.4,this.player=new Mt,this.player.name="TinyPlanetPlayer",this.raycaster=new yu,this.worldUp=new D,this.dummyVec=new D,this.dummyQuat=new $n,this.camLocalUp=new D,this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onPointerLockChange=this.onPointerLockChange.bind(this)}setPlanet(e){this.planetMesh=e}enter(e,t,i=null){if(this.enabled)return;this.enabled=!0,this.planetMesh=t,this.planetGroup=t.parent;const r=e.clone();this.planetMesh.worldToLocal(r);const s=r.normalize(),o=(i?i.getWorldDirection(new D):new D(0,0,-1)).clone().projectOnPlane(s).normalize(),l=o.lengthSq()>1e-6?o:this.basisEast(s);this.planetMesh.add(this.player);const c=r.length()+2;this.player.position.copy(s).multiplyScalar(c),this.alignToFrame(s,l),this.player.add(this.camera),this.camera.position.set(0,0,0),this.camera.rotation.set(0,0,0),this.velocity.set(0,0,0),this.verticalVelocity=0,this.isFlying=!1,this.horizontalVelocity.set(0,0,0),this.externalInput&&this.externalInput.setLookMode&&this.externalInput.setLookMode("surface"),!/Mobi|Android|iP(ad|hone|od)/i.test(navigator.userAgent||"")&&this.domElement.requestPointerLock&&this.domElement.requestPointerLock(),this.addListeners()}exit(){this.enabled&&(this.enabled=!1,this.removeListeners(),document.exitPointerLock(),this.player.remove(this.camera),this.scene.add(this.camera),this.player.parent&&this.player.parent.remove(this.player),this.onExitCallback&&this.onExitCallback(),this.externalInput&&(this.externalInput.clear(),this.externalInput.setLookMode&&this.externalInput.setLookMode("orbit")),this.moveForward=this.moveBackward=this.moveLeft=this.moveRight=!1,this.moveUp=this.moveDown=!1,this.rollLeft=this.rollRight=!1,this.lookUp=this.lookDown=this.lookLeft=this.lookRight=!1,this.isRunning=!1,this.canJump=!1,this.horizontalVelocity.set(0,0,0),this.keyLookYawVelocity=0,this.keyLookPitchVelocity=0,this.keyLookRollVelocity=0)}addListeners(){document.addEventListener("keydown",this.onKeyDown),document.addEventListener("keyup",this.onKeyUp),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("pointerlockchange",this.onPointerLockChange)}removeListeners(){document.removeEventListener("keydown",this.onKeyDown),document.removeEventListener("keyup",this.onKeyUp),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("pointerlockchange",this.onPointerLockChange)}onPointerLockChange(){this.isLocked=document.pointerLockElement===this.domElement,!this.isLocked&&this.enabled}onKeyDown(e){switch(e.code){case"ArrowUp":this.lookUp=!0,e.preventDefault();break;case"ArrowDown":this.lookDown=!0,e.preventDefault();break;case"ArrowLeft":this.lookLeft=!0,e.preventDefault();break;case"ArrowRight":this.lookRight=!0,e.preventDefault();break;case"KeyW":this.moveForward=!0;break;case"KeyA":this.moveLeft=!0;break;case"KeyS":this.moveBackward=!0;break;case"KeyD":this.moveRight=!0;break;case"Space":case"Numpad0":e.preventDefault(),this.isFlying?this.moveUp=!0:this.jumpRequested=!0;break;case"ControlLeft":case"ControlRight":case"KeyC":e.preventDefault(),this.moveDown=!0;break;case"ShiftLeft":case"ShiftRight":this.isRunning=!0;break;case"KeyF":this.toggleFlight();break;case"KeyQ":this.rollLeft=!0;break;case"KeyE":this.rollRight=!0;break;case"Escape":this.exit();break}}onKeyUp(e){switch(e.code){case"ArrowUp":this.lookUp=!1;break;case"ArrowDown":this.lookDown=!1;break;case"ArrowLeft":this.lookLeft=!1;break;case"ArrowRight":this.lookRight=!1;break;case"KeyW":this.moveForward=!1;break;case"KeyA":this.moveLeft=!1;break;case"KeyS":this.moveBackward=!1;break;case"KeyD":this.moveRight=!1;break;case"Space":case"Numpad0":this.moveUp=!1;break;case"ControlLeft":case"ControlRight":case"KeyC":this.moveDown=!1;break;case"ShiftLeft":case"ShiftRight":this.isRunning=!1;break;case"KeyQ":this.rollLeft=!1;break;case"KeyE":this.rollRight=!1;break}}onMouseMove(e){if(!this.isLocked)return;const t=e.movementX||0,i=e.movementY||0;if(this.isFlying){const r=new D(0,1,0).applyQuaternion(this.camera.quaternion);this.player.rotateOnAxis(r,-t*.002),this.camera.rotateX(-i*.002)}else this.player.rotateY(-t*.002),this.camera.rotateX(-i*.002),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}basisEast(e){const t=Math.abs(e.y)<.9?new D(0,1,0):new D(1,0,0),i=new D().crossVectors(t,e).normalize();return i.lengthSq()>1e-6?i:new D(1,0,0)}alignToFrame(e,t){const i=e.clone().normalize();let r=t.clone().projectOnPlane(i);r.lengthSq()<1e-6&&(r=this.basisEast(i)),r.normalize();const s=new D().crossVectors(r,i).normalize();r.crossVectors(i,s).normalize();const a=new ot().makeBasis(s,i,r.negate());this.player.quaternion.setFromRotationMatrix(a),this.player.up.copy(i)}toggleFlight(){if(this.isFlying=!this.isFlying,this.verticalVelocity=0,!this.isFlying){const e=this.player.position.clone().normalize(),t=new D(0,1,0),i=new $n().setFromUnitVectors(t,e);this.player.quaternion.copy(i),this.player.up.copy(e),this.camera.rotation.x=0,this.velocity.set(0,0,0)}}snapToSurface(){var h,f;if(!this.planetMesh||!((h=this.planetMesh.userData)!=null&&h.forge)||!((f=this.planetMesh.userData)!=null&&f.settings))return;const e=this.planetMesh.userData.forge,t=this.planetMesh.userData.settings;this.surfaceRay.setFromCamera(new Ee(0,0),this.camera);const i=this.surfaceRay.intersectObject(this.planetMesh,!1);if(!i.length)return;const s=i[0].point.clone().clone();this.planetMesh.worldToLocal(s);const a=s.normalize(),o=e.getHeightAt(a),l=t.radius+(o-t.seaLevel)*t.heightScale+this.playerHeight,c=a.clone().multiplyScalar(l+.2);this.player.position.copy(c);const d=new $n().setFromUnitVectors(new D(0,1,0),a);this.player.quaternion.copy(d),this.player.up.copy(a),this.camera.rotation.set(0,0,0),this.velocity.set(0,0,0),this.verticalVelocity=0}update(e){var b,v;if(!this.enabled)return;const t=Math.min(Math.max(e??0,0),.05),i=(v=(b=this.externalInput)==null?void 0:b.getState)==null?void 0:v.call(b),r=this.moveForward||!!(i!=null&&i.forward),s=this.moveBackward||!!(i!=null&&i.backward),a=this.moveLeft||!!(i!=null&&i.left),o=this.moveRight||!!(i!=null&&i.right);this.moveUp||i!=null&&i.up,this.moveDown||i!=null&&i.down;const l=this.isRunning||!!(i!=null&&i.run),c=this.rollLeft||!!(i!=null&&i.rollLeft),d=this.rollRight||!!(i!=null&&i.rollRight);if(this.externalInput){if(this.externalInput.consume("flyToggle")&&this.toggleFlight(),this.externalInput.consume("exit")){this.exit();return}this.externalInput.consume("surface")&&this.snapToSurface(),!this.isFlying&&this.externalInput.consume("jump")&&(this.jumpRequested=!0);const M=this.externalInput.consumeLookDelta();if(Math.abs(M.x)>1e-4||Math.abs(M.y)>1e-4){const S=-M.x*.01,E=-M.y*.01;this.player.rotateY(S),this.camera.rotateX(E),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}}const h=(this.lookUp?1:0)-(this.lookDown?1:0),f=(this.lookLeft?1:0)-(this.lookRight?1:0),p=(c?1:0)-(d?1:0),g=f*this.keyLookSpeed,x=h*this.keyLookSpeed,m=p*this.keyRollSpeed;this.keyLookYawVelocity=g,this.keyLookPitchVelocity=x,this.keyLookRollVelocity=m,Math.abs(this.keyLookYawVelocity)>1e-4&&(this.isFlying?(this.camLocalUp.set(0,1,0).applyQuaternion(this.camera.quaternion),this.player.rotateOnAxis(this.camLocalUp,this.keyLookYawVelocity*t)):this.player.rotateY(this.keyLookYawVelocity*t)),Math.abs(this.keyLookPitchVelocity)>1e-4&&(this.camera.rotateX(this.keyLookPitchVelocity*t),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))),Math.abs(this.keyLookRollVelocity)>1e-4&&this.camera.rotateZ(this.keyLookRollVelocity*t);let u=this.walkSpeed;this.isFlying?u=this.flySpeed:l&&(u=this.runSpeed);const y=new D;if(r&&(y.z+=1),s&&(y.z-=1),a&&(y.x-=1),o&&(y.x+=1),this.isFlying&&(y.z*=-1),y.normalize(),this.isFlying){this.horizontalVelocity.multiplyScalar(.5);const M=y.clone().multiplyScalar(u*e);M.applyQuaternion(this.camera.quaternion),M.applyQuaternion(this.player.quaternion),this.player.position.add(M)}else{const M=this.player.position.clone().normalize(),S=new D(0,0,-1).applyQuaternion(this.camera.quaternion).applyQuaternion(this.player.quaternion).projectOnPlane(M).normalize(),E=new D().crossVectors(S,M).normalize(),A=new D;A.addScaledVector(S,y.z),A.addScaledVector(E,y.x);const w=A.lengthSq()>1e-6?A.normalize():A;let _=this.planetRadius;const R=this.planetMesh.userData.forge,U=this.planetMesh.userData.settings;if(R&&U){const oe=this.player.position.clone().normalize(),ge=R.getHeightAt(oe);_=U.radius+(ge-U.seaLevel)*U.heightScale}const L=this.player.position.length(),O=_+this.playerHeight,V=L<=O+.05,k=()=>{const oe=this.horizontalVelocity,ge=oe.length();if(ge<1e-5)return;const K=Math.max(this.stopSpeed,ge)*this.frictionGround*t,ie=Math.max(ge-K,0);oe.multiplyScalar(ie/ge)},H=(oe,ge,X)=>{if(ge<=0||oe.lengthSq()<1e-6)return;const K=this.horizontalVelocity.dot(oe),ie=ge-K;if(ie<=0)return;const ee=X*ge*t,ve=Math.min(ee,ie);this.horizontalVelocity.addScaledVector(oe,ve)};V?w.lengthSq()<1e-6?k():(k(),H(w,u,this.accelGround)):w.lengthSq()>1e-6&&H(w,u,this.accelAir);const z=this.horizontalVelocity.clone().multiplyScalar(t);if(this.player.position.add(z),V?(this.canJump=!0,this.jumpRequested&&this.canJump?(this.verticalVelocity=this.jumpForce,this.canJump=!1):this.verticalVelocity=0):this.verticalVelocity-=this.gravity*t,Math.abs(this.verticalVelocity)>1e-6&&this.player.translateY(this.verticalVelocity*t),this.player.position.length()<O){const oe=this.player.position.clone().normalize();this.player.position.copy(oe.multiplyScalar(O)),this.verticalVelocity<0&&(this.verticalVelocity=0),this.canJump=!0}this.jumpRequested=!1;const Y=this.player.position.clone().normalize(),ne=new D(0,1,0).applyQuaternion(this.player.quaternion),le=new $n().setFromUnitVectors(ne,Y);this.player.quaternion.premultiply(le),this.player.up.copy(Y),this.camera.rotation.x=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.camera.rotation.x))}}}function nf(n,e=1e-4){e=Math.max(e,Number.EPSILON);const t={},i=n.getIndex(),r=n.getAttribute("position"),s=i?i.count:r.count;let a=0;const o=Object.keys(n.attributes),l={},c={},d=[],h=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let y=0,b=o.length;y<b;y++){const v=o[y],M=n.attributes[v];l[v]=new M.constructor(new M.array.constructor(M.count*M.itemSize),M.itemSize,M.normalized);const S=n.morphAttributes[v];S&&(c[v]||(c[v]=[]),S.forEach((E,A)=>{const w=new E.array.constructor(E.count*E.itemSize);c[v][A]=new E.constructor(w,E.itemSize,E.normalized)}))}const p=e*.5,g=Math.log10(1/e),x=Math.pow(10,g),m=p*x;for(let y=0;y<s;y++){const b=i?i.getX(y):y;let v="";for(let M=0,S=o.length;M<S;M++){const E=o[M],A=n.getAttribute(E),w=A.itemSize;for(let _=0;_<w;_++)v+=`${~~(A[h[_]](b)*x+m)},`}if(v in t)d.push(t[v]);else{for(let M=0,S=o.length;M<S;M++){const E=o[M],A=n.getAttribute(E),w=n.morphAttributes[E],_=A.itemSize,R=l[E],U=c[E];for(let L=0;L<_;L++){const O=h[L],V=f[L];if(R[V](a,A[O](b)),w)for(let k=0,H=w.length;k<H;k++)U[k][V](a,w[k][O](b))}}t[v]=a,d.push(a),a++}}const u=n.clone();for(const y in n.attributes){const b=l[y];if(u.setAttribute(y,new b.constructor(b.array.slice(0,a*b.itemSize),b.itemSize,b.normalized)),y in c)for(let v=0;v<c[y].length;v++){const M=c[y][v];u.morphAttributes[y][v]=new M.constructor(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)}}return u.setIndex(d),u}const rf=(()=>{const n=new Uint8Array([0,0,128,0]),e=new ti(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=Tn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Bt,e})(),sf=(()=>{const n=new Uint8Array([160,0,128,128]),e=new ti(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=Tn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Bt,e})();class j1{constructor(e=512){this.size=e,this.data=new Float32Array(e*e),this.waterMask=new Float32Array(e*e),this.rng=Math.random}generateTectonics({numPlates:e=15,jitter:t=.5,oceanFloor:i=.2,plateDelta:r=1,faultType:s="ridge",plateSizeVariance:a=0,desymmetrizeTiling:o=!1}){console.time("Tectonics Generation");const l=Math.max(0,a),c=[];for(let d=0;d<e;d++)c.push({x:Math.floor(this.rng()*this.size),y:Math.floor(this.rng()*this.size),z:this.rng()*.5+.5,type:this.rng()>.6?1:-1,sizeBias:Math.max(.25,1+(this.rng()*2-1)*l),skew:o?(this.rng()*2-1)*l*.5*this.size:0});for(let d=0;d<this.size;d++)for(let h=0;h<this.size;h++){let f=1/0,p=1/0,g=null;for(const b of c){const M=((o?b.x+b.skew*(d/this.size):b.x)%this.size+this.size)%this.size,S=Math.min(Math.abs(h-M),this.size-Math.abs(h-M)),E=d-b.y,w=Math.sqrt(S*S+E*E)/b.sizeBias;w<f?(p=f,f=w,g=b):w<p&&(p=w)}const x=f/(p+.001);let m=0;g.type>0?m=g.z*r-x*t:m=i-.08+x*.05;const u=Math.pow(x,5)*g.z;let y=s;if(s==="mixed"){const b=Math.abs(Math.sin((g.x+g.y+g.z)*12.9898));y=b<.33?"ridge":b<.66?"trench":"shear"}y==="ridge"?m+=u:y==="trench"?m-=u*.7:y==="shear"?m+=u*.2*Math.sign(g.type):m+=u,this.data[d*this.size+h]=Math.max(0,Math.min(1,m))}console.timeEnd("Tectonics Generation")}applyErosion({iterations:e=5e4,inertia:t=.05,gravity:i=4,evaporation:r=.01,erosionRate:s=.3,depositionRate:a=.1}){console.time("Hydraulic Erosion");const o=this.size;for(let l=0;l<e;l++){let c=this.rng()*(o-1),d=this.rng()*(o-1),h=0,f=0,p=1,g=1,x=0;for(let m=0;m<30;m++){let u=Math.floor(c),y=Math.floor(d),b=(u+o)%o,v=(u+1+o)%o,M=Math.max(0,Math.min(o-1,y));const S=this.data[M*o+b],E=this.data[M*o+(u-1+o)%o],A=this.data[M*o+v],w=this.data[Math.max(0,y-1)*o+b],_=this.data[Math.min(o-1,y+1)*o+b],R=A-E,U=_-w;h=h*t-R*(1-t),f=f*t-U*(1-t);const L=Math.sqrt(h*h+f*f);if(L!==0&&(h/=L,f/=L),c+=h,d+=f,d<0||d>=o-1||!Number.isFinite(d)||!Number.isFinite(c))break;const O=Math.max(0,Math.min(o-1,Math.floor(d))),V=(Math.floor(c)+o)%o;let k=this.data[O*o+V],H=S-k;const z=Math.max(-H,.01)*p*g*4;if(x>z||H<0){const Y=(x-z)*a;x-=Y,this.data[M*o+b]+=Y}else{const Y=Math.min((z-x)*s,-H);x+=Y,this.data[M*o+b]-=Y}if(p=Math.sqrt(p*p+Math.max(0,H)*i),g*=1-r,g<.01)break}}console.timeEnd("Hydraulic Erosion"),this._sanitize()}createMesh(e=10,t=2,i=.5,r=6,s=.12,a=null,o=null){this._sanitize();let l=new Ji(e,Math.max(0,Math.floor(r)));l.deleteAttribute("uv"),l=nf(l);const c=y=>Math.min(Math.max(y,0),1),d=(y,b,v)=>{const M=c(y)*(this.size-1),S=c(1-b)*(this.size-1),E=Math.floor(M),A=Math.floor(S),w=Math.min(this.size-1,E+1),_=Math.min(this.size-1,A+1),R=M-E,U=S-A,L=v[A*this.size+E],O=v[A*this.size+w],V=v[_*this.size+E],k=v[_*this.size+w],H=L*(1-R)+O*R,z=V*(1-R)+k*R,Y=H*(1-U)+z*U;return Number.isFinite(Y)?Y:0},h=(y,b)=>d(y,b,this.data),f=(y,b)=>d(y,b,this.waterMask),p=y=>{const b=new D(Math.abs(y.x),Math.abs(y.y),Math.abs(y.z)),v=b.x+b.y+b.z+1e-6,M=b.x/v,S=b.y/v,E=b.z/v,A={u:y.z*.5+.5,v:y.y*.5+.5},w={u:y.x*.5+.5,v:y.z*.5+.5},_={u:y.x*.5+.5,v:y.y*.5+.5},R=h(A.u,A.v),U=h(w.u,w.v),L=h(_.u,_.v);return R*M+U*S+L*E},g=l.attributes.position,x=new D,m=new Float32Array(g.count);for(let y=0;y<g.count;y++){x.fromBufferAttribute(g,y);const b=x.length();if(b===0||!Number.isFinite(b)){x.set(e,0,0),g.setXYZ(y,x.x,x.y,x.z);continue}const v=x.clone().normalize(),M=p(v),S=f(v.x*.5+.5,v.y*.5+.5),E=(M-i)*t;v.multiplyScalar(e+E),g.setXYZ(y,v.x,v.y,v.z),m[y]=S}l.computeVertexNormals(),this._ensureFinitePositions(l,e),l.normalizeNormals(),l.setAttribute("waterMask",new It(m,1));const u=new Ov({shininess:50,specular:new Se(6710886),color:8947848,flatShading:!1,onBeforeCompile:function(y){var b,v,M,S;y.vertexShader=`
                    varying float vHeight;
                    varying vec3 vDir;
                    attribute float waterMask;
                    varying float vWater;
                    varying float vSlope;
                    uniform float uIceCap;
                    ${y.vertexShader}
                `.replace("#include <begin_vertex>",`
                    #include <begin_vertex>
                    vHeight = length(transformed) - ${e.toFixed(1)};
                    vDir = normalize(transformed);
                    vWater = waterMask;
                    vSlope = 1.0 - dot(normalize(normal), normalize(position));
                    float rough = smoothstep(0.2, 0.7, vSlope);
                    float rockNoise = sin(dot(position.xyz, vec3(12.9898,78.233,37.719))) * 0.5 + 0.5;
                    transformed += normalize(normal) * rockNoise * rough * 0.08;
                    `),y.fragmentShader=`
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
	                    
	                    ${y.fragmentShader}
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
                    `),y.uniforms.uIceCap={value:s},y.uniforms.uWeatherMap={value:((b=this.userData.weather)==null?void 0:b.texture)??rf},y.uniforms.uWeatherAuxMap={value:((v=this.userData.weather)==null?void 0:v.auxTexture)??sf},y.uniforms.uWeatherStrength={value:((M=this.userData.weather)==null?void 0:M.strength)??.75},y.uniforms.uWeatherDebug={value:((S=this.userData.weather)==null?void 0:S.debug)??0},this.userData.shader=y}});return u.userData.weather={texture:a??rf,auxTexture:o??sf,strength:.75,debug:0},new Gt(l,u)}createFreshwaterMesh(e=10,t=2,i=.5,r=6){let s=new Ji(e,Math.max(0,Math.floor(r)));s.deleteAttribute("uv"),s=nf(s);const a=s.attributes.position,o=new D,l=new Float32Array(a.count),c=(g,x)=>this._sampleBilinear(g,x,this.data),d=(g,x)=>this._sampleBilinear(g,x,this.waterMask),h=g=>{const x=new D(Math.abs(g.x),Math.abs(g.y),Math.abs(g.z)),m=x.x+x.y+x.z+1e-6,u=x.x/m,y=x.y/m,b=x.z/m,v={u:g.z*.5+.5,v:g.y*.5+.5},M={u:g.x*.5+.5,v:g.z*.5+.5},S={u:g.x*.5+.5,v:g.y*.5+.5},E=c(v.u,v.v),A=c(M.u,M.v),w=c(S.u,S.v),_=d(v.u,v.v),R=d(M.u,M.v),U=d(S.u,S.v);return{height:E*u+A*y+w*b,mask:_*u+R*y+U*b}},f=this.riverDepth||.015;for(let g=0;g<a.count;g++){o.fromBufferAttribute(a,g);const x=o.clone().normalize(),m=h(x),u=m.height,y=m.mask,v=(u+y*f*.5-i)*t;x.multiplyScalar(e+v+.001),a.setXYZ(g,x.x,x.y,x.z),l[g]=y}s.computeVertexNormals(),this._ensureFinitePositions(s,e),s.normalizeNormals(),s.setAttribute("waterMask",new It(l,1));const p=new Vt({uniforms:{time:{value:0},deepColor:{value:new Se(532543)},shallowColor:{value:new Se(1396618)},opacity:{value:.8},fresnelPower:{value:3.4}},transparent:!0,depthWrite:!1,side:En,blending:Zn,vertexShader:`
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
            `});return new Gt(s,p)}_sanitize(e=-5,t=5){const i=this.data;for(let r=0;r<i.length;r++){let s=i[r];Number.isFinite(s)?s<e?s=e:s>t&&(s=t):s=0,i[r]=s}}_clamp01(e){return Math.min(Math.max(e,0),1)}_sampleBilinear(e,t,i){const r=this._clamp01(e)*(this.size-1),s=this._clamp01(1-t)*(this.size-1),a=Math.floor(r),o=Math.floor(s),l=Math.min(this.size-1,a+1),c=Math.min(this.size-1,o+1),d=r-a,h=s-o,f=i[o*this.size+a],p=i[o*this.size+l],g=i[c*this.size+a],x=i[c*this.size+l],m=f*(1-d)+p*d,u=g*(1-d)+x*d;return m*(1-h)+u*h}getHeightAt(e){const t=(x,m)=>this._sampleBilinear(x,m,this.data),i=new D(Math.abs(e.x),Math.abs(e.y),Math.abs(e.z)),r=i.x+i.y+i.z+1e-6,s=i.x/r,a=i.y/r,o=i.z/r,l={u:e.z*.5+.5,v:e.y*.5+.5},c={u:e.x*.5+.5,v:e.z*.5+.5},d={u:e.x*.5+.5,v:e.y*.5+.5},h=t(l.u,l.v),f=t(c.u,c.v),p=t(d.u,d.v);let g=h*s+f*a+p*o;return Number.isFinite(g)?g:0}getWaterDataAt(e){const t=(S,E)=>this._sampleBilinear(S,E,this.data),i=(S,E)=>this._sampleBilinear(S,E,this.waterMask),r=new D(Math.abs(e.x),Math.abs(e.y),Math.abs(e.z)),s=r.x+r.y+r.z+1e-6,a=r.x/s,o=r.y/s,l=r.z/s,c={u:e.z*.5+.5,v:e.y*.5+.5},d={u:e.x*.5+.5,v:e.z*.5+.5},h={u:e.x*.5+.5,v:e.y*.5+.5},f=t(c.u,c.v),p=t(d.u,d.v),g=t(h.u,h.v),x=f*a+p*o+g*l,m=i(c.u,c.v),u=i(d.u,d.v),y=i(h.u,h.v),b=m*a+u*o+y*l,v=this.riverDepth||.015,M=x+b*v*.5;return{height:Number.isFinite(x)?x:0,waterHeight:Number.isFinite(M)?M:0,waterMask:Number.isFinite(b)?b:0,hasWater:b>.05}}applyHydrology({seaLevel:e=.5,riverDepth:t=.015,lakeThreshold:i=.003}={}){this.riverDepth=t;const r=this.size,s=r*r;this.waterMask.fill(0);const a=new Float32Array(this.data),o=new Uint8Array(s),l=new Int32Array(s+r*4),c=new Float32Array(s+r*4);let d=0;const h=(v,M)=>{let S=d++;for(l[S]=v,c[S]=M;S>0;){const E=S-1>>1;if(c[E]<=M)break;l[S]=l[E],c[S]=c[E],l[E]=v,c[E]=M,S=E}},f=()=>{const v=l[0],M=c[0];if(d--,d>0){l[0]=l[d],c[0]=c[d];let S=0;for(;;){const E=(S<<1)+1,A=E+1;if(E>=d)break;let w=E;if(A<d&&c[A]<c[E]&&(w=A),c[S]<=c[w])break;[l[S],l[w]]=[l[w],l[S]],[c[S],c[w]]=[c[w],c[S]],S=w}}return[v,M]},p=(v,M)=>{const S=M*r+v;o[S]||(o[S]=1,h(S,a[S]))};for(let v=0;v<r;v++)p(v,0),p(v,r-1);for(let v=1;v<r-1;v++)p(0,v),p(r-1,v);const g=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];for(;d>0;){const[v,M]=f(),S=v%r,E=Math.floor(v/r);for(const[A,w]of g){const _=(S+A+r)%r,R=E+w;if(R<0||R>=r)continue;const U=R*r+_;if(o[U])continue;o[U]=1,a[U]<M&&(a[U]=M),h(U,a[U])}}const x=new Int32Array(s);for(let v=0;v<r;v++)for(let M=0;M<r;M++){const S=v*r+M,E=a[S];let A=-1,w=E;for(const[_,R]of g){const U=(M+_+r)%r,L=v+R;if(L<0||L>=r)continue;const O=L*r+U,V=a[O];V<w&&(w=V,A=O)}x[S]=A}const m=new Array(s);for(let v=0;v<s;v++)m[v]=v;m.sort((v,M)=>a[M]-a[v]);const u=new Float32Array(s);u.fill(1);for(const v of m){const M=x[v];M>=0&&(u[M]+=u[v])}let y=0;for(let v=0;v<s;v++)u[v]>y&&(y=u[v]);const b=y>0?1/y:0;for(let v=0;v<s;v++){const M=Math.max(0,a[v]-this.data[v]);let S=0;M>i&&(S=Math.min(1,M*12));const E=Math.pow(u[v]*b,.5);E>.1&&a[v]>e&&(S=Math.max(S,E)),this.waterMask[v]=S,S>0&&(this.data[v]=Math.max(0,this.data[v]-S*t))}}_ensureFinitePositions(e,t=10){const i=e.attributes.position,r=i.array;let s=!1;for(let a=0;a<r.length;a++)Number.isFinite(r[a])||(s=!0,r[a]=0);s&&(r[0]=t,r[1]=0,r[2]=0,i.needsUpdate=!0)}}class K1{constructor(e){this.sceneGroup=e,this.mesh=null;const t=new ti(new Uint8Array([110,0,128,0]),1,1,St,Lt);t.needsUpdate=!0,t.wrapS=Tn,t.wrapT=pt,t.minFilter=it,t.magFilter=it,t.generateMipmaps=!1,t.colorSpace=Bt,this.defaultWeatherTexture=t,this.uniforms={sunDir:{value:new D(0,1,0)},glowColor:{value:new Se(5089535)},alpha:{value:1},density:{value:6},weatherMap:{value:t},rainHaze:{value:.9},planetInvRot:{value:new Ue},planetInvScale:{value:1},innerRadius:{value:10},outerRadius:{value:11},rayleighScaleHeight:{value:.25},mieScaleHeight:{value:.08},mieG:{value:.76},exposure:{value:1.15}},this.uniforms.planetInvRot.value.identity()}update(e){var i,r;const t=((r=(i=this.sceneGroup)==null?void 0:i.scale)==null?void 0:r.x)||1;this.uniforms.planetInvScale.value=1/t}setWeather(e,t=.9){this.uniforms.weatherMap||(this.uniforms.weatherMap={value:this.defaultWeatherTexture}),this.uniforms.rainHaze||(this.uniforms.rainHaze={value:.9}),this.uniforms.weatherMap.value=e||this.defaultWeatherTexture,this.uniforms.rainHaze.value=t}updateVisuals(e,t,i,r,s){var g,x;if(!e.atmosphereEnabled){this.mesh&&(this.mesh.visible=!1);return}const a=Math.max(.05,e.atmosphere),o=e.atmosphereHeight,l=e.atmosphereAlpha,c=e.atmosphereColor,d=t+o+Math.max(.05,a)*r;this.uniforms.alpha.value=l,this.uniforms.glowColor.value=new Se(c),this.uniforms.sunDir.value.copy(s).normalize(),this.uniforms.innerRadius.value=t,this.uniforms.outerRadius.value=d;const h=Math.max(2,Math.min(6,Math.floor(i/24))),f=new Ji(d,h),p=new Vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:on,blending:Oo,vertexShader:`
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
            `});this.mesh&&(this.mesh.geometry.dispose(),(x=(g=this.mesh.material).dispose)==null||x.call(g),this.sceneGroup.remove(this.mesh)),this.mesh=new Gt(f,p),this.mesh.renderOrder=1,this.sceneGroup.add(this.mesh)}}class Q1{constructor(e){this.sceneGroup=e,this.clouds=[]}update(e){const t=Math.min(e,.25);for(const i of this.clouds){const r=i.userData.uniforms,a=i.userData.settings.speed||1;r.windOffset.value+=t*a*.3}}clear(){var e,t;for(const i of this.clouds)this.sceneGroup.remove(i),i.geometry.dispose(),(t=(e=i.material).dispose)==null||t.call(e);this.clouds=[]}rebuild(e,t,i,r,s,a){this.clear();for(const o of a){if(!o.enabled)continue;const l=this.buildCloudMesh(t+r*.2,s,e,t,i,r,o);this.clouds.push(l),this.sceneGroup.add(l)}}buildVolumeCloudMesh(e,t,i,r,s,a,o,l,c){const d=o.mode==="billow"?1:o.mode==="cellular"?2:0,h=r+(s-.5)*a+.05,f=((c==null?void 0:c.planetRadiusM)??Dm)/un,p=((c==null?void 0:c.atmoThicknessM)??2e4)/Math.max(f,1e-6),g=h,x=Math.max(.25,p*.5),m=Math.max(.1,g-.05),u=m+2*x,y={windOffset:{value:0},color:{value:new Se(o.color)},opacity:{value:o.alpha},sunDir:{value:i.clone().normalize()},windDir:{value:new D(0,0,1)},quantity:{value:o.quantity},noiseScale:{value:Math.max(1,o.resolution)},mode:{value:d},bundleSize:{value:1},rayStepsMin:{value:28},rayStepsMax:{value:48},debugGrid:{value:0},volumeAtlas:{value:l},volumeN:{value:(c==null?void 0:c.n)??64},tilesX:{value:(c==null?void 0:c.tilesX)??8},atlasW:{value:(c==null?void 0:c.atlasW)??512},atlasH:{value:(c==null?void 0:c.atlasH)??512},volumeExtentM:{value:(c==null?void 0:c.extentM)??52e4},metersPerUnit:{value:f},planetInvRot:{value:new Ue},planetInvScale:{value:1},innerRadius:{value:m},outerRadius:{value:u}},b=Math.max(2,Math.min(6,Math.floor(t/24))),v=new Ji(u,b),M=new Vt({uniforms:y,transparent:!0,depthWrite:!1,side:Ln,blending:Zn,vertexShader:`
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
            `}),S=new Gt(v,M);return S.userData.uniforms=y,S.userData.settings=o,S.renderOrder=2,S}buildCloudMesh(e,t,i,r,s,a,o){const l=Math.max(.1,e+o.height),c=o.mode==="billow"?1:o.mode==="cellular"?2:0,d={time:{value:0},windOffset:{value:0},color:{value:new Se(o.color)},opacity:{value:o.alpha},sunDir:{value:i.clone().normalize()},windDir:{value:new D(0,0,1)},planetRadius:{value:r},seaLevel:{value:s},heightScale:{value:a},speed:{value:o.speed},quantity:{value:o.quantity},noiseScale:{value:Math.max(.1,o.resolution)},mode:{value:c}};return new Ji(l,Math.max(1,Math.floor(t*.5))),new Vt({uniforms:d,transparent:!0,depthWrite:!1,side:En,blending:Zn,vertexShader:`
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
            `}),mesh}}const Z1=256,J1=128;function ew(n,e,t,i={}){const r=new ti(n,e,t,St,Lt);return r.needsUpdate=!0,r.wrapS=i.wrapS??Tn,r.wrapT=i.wrapT??pt,r.minFilter=i.minFilter??it,r.magFilter=i.magFilter??it,r.generateMipmaps=!1,r.colorSpace=Bt,r}class fd{constructor({gridWidth:e=Z1,gridHeight:t=J1}={}){this.gridW=Math.max(32,Math.min(512,Math.round(e))),this.gridH=Math.max(16,Math.min(256,Math.round(t))),this.cellCount=this.gridW*this.gridH,this.enabled=!1,this.ready=!1,this.device=null,this.pipelineSim=null,this.bindGroupLayout=null,this.bindGroups=null,this.uniformBuffer=null,this.uniformData=new Float32Array(16),this.heightBuffers=null,this.prevHeightBuffer=null,this.outputBuffer=null,this.windFieldBuffer=null,this.useWindField=!1,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.ping=0,this.viscosity=.985,this.waveSpeed=2,this.mousePos=new Ee(-999,-999),this.mouseSpeed=new Ee(0,0),this.mouseSize=.08,this.mouseDeep=.3,this.windStrength=.5,this.windDirection=new Ee(.7,.3).normalize(),this.timeS=0,this.readbackIntervalS=.033,this.readbackTimerS=0,this.textureData=new Uint8Array(this.cellCount*4),this.oceanTexture=ew(this.textureData,this.gridW,this.gridH)}static async create(e={}){const{device:t,...i}=e,r=new fd(i);return await r.init({device:t}),r}setConfig({viscosity:e,waveSpeed:t,mouseSize:i,mouseDeep:r,windStrength:s,windDirectionX:a,windDirectionY:o,readbackIntervalS:l}={}){Number.isFinite(e)&&(this.viscosity=Math.max(.9,Math.min(.999,e))),Number.isFinite(t)&&(this.waveSpeed=Math.max(.1,Math.min(10,t))),Number.isFinite(i)&&(this.mouseSize=Math.max(.01,Math.min(.5,i))),Number.isFinite(r)&&(this.mouseDeep=Math.max(0,Math.min(2,r))),Number.isFinite(s)&&(this.windStrength=Math.max(0,Math.min(2,s))),Number.isFinite(a)&&Number.isFinite(o)&&this.windDirection.set(a,o).normalize(),Number.isFinite(l)&&(this.readbackIntervalS=Math.max(.01,l))}setWindField(e){if(!this.windFieldBuffer||!this.device)return;if(!e){this.useWindField=!1;return}const t=this.cellCount*2;if(e.length<t){console.warn("[OceanComputeSystem] wind field size mismatch",e.length,t),this.useWindField=!1;return}this.device.queue.writeBuffer(this.windFieldBuffer,0,e),this.useWindField=!0}getTexture(){return this.oceanTexture}setMouseInteraction(e,t,i,r){this.mousePos.set(e,t),this.mouseSpeed.set(i,r)}clearMouseInteraction(){this.mousePos.set(-999,-999),this.mouseSpeed.set(0,0)}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[OceanComputeSystem] WebGPU not available; compute ocean disabled."),this.enabled=!1;return}const o=await navigator.gpu.requestAdapter();if(!o){console.warn("[OceanComputeSystem] No GPU adapter found; compute ocean disabled."),this.enabled=!1;return}this.device=await o.requestDevice(),this.enabled=!0}const t=this.device,i=this.cellCount*4,r=this.cellCount*4;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.heightBuffers=[t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.prevHeightBuffer=t.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.outputBuffer=t.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.windFieldBuffer=t.createBuffer({size:this.cellCount*8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.readbackBuffers=[t.createBuffer({size:r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:r,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})],this.bindGroupLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]});const s=t.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),a=t.createShaderModule({code:this._wgslOcean()});this.pipelineSim=t.createComputePipeline({layout:s,compute:{module:a,entryPoint:"main"}}),this.bindGroups=[t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.heightBuffers[0]}},{binding:2,resource:{buffer:this.heightBuffers[1]}},{binding:3,resource:{buffer:this.prevHeightBuffer}},{binding:4,resource:{buffer:this.outputBuffer}},{binding:5,resource:{buffer:this.windFieldBuffer}}]}),t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.heightBuffers[1]}},{binding:2,resource:{buffer:this.heightBuffers[0]}},{binding:3,resource:{buffer:this.prevHeightBuffer}},{binding:4,resource:{buffer:this.outputBuffer}},{binding:5,resource:{buffer:this.windFieldBuffer}}]})],this._resetState(),this.ready=!0}_resetState(){const e=new Float32Array(this.cellCount);for(let t=0;t<this.cellCount;t++)e[t]=(Math.random()-.5)*.001;this.device.queue.writeBuffer(this.heightBuffers[0],0,e),this.device.queue.writeBuffer(this.heightBuffers[1],0,e),this.device.queue.writeBuffer(this.prevHeightBuffer,0,e),this.windFieldBuffer&&this.device.queue.writeBuffer(this.windFieldBuffer,0,new Float32Array(this.cellCount*2)),this.useWindField=!1,this.ping=0,this.timeS=0}update(e,t={}){if(!this.enabled||!this.ready)return;const i=Math.min(Math.max(e??0,0),.1);this.timeS+=i,this.readbackTimerS+=i,this._writeUniforms(i);const r=this.device,s=r.createCommandEncoder(),a=s.beginComputePass();a.setPipeline(this.pipelineSim),a.setBindGroup(0,this.bindGroups[this.ping]),a.dispatchWorkgroups(Math.ceil(this.gridW/8),Math.ceil(this.gridH/8)),a.end(),this.ping=1-this.ping;let o=null;if(!!t.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const c=this.readbackWriteIndex&1;this.readbackInFlight[c]||(s.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[c],0,this.cellCount*4),o=c,this.readbackWriteIndex++,this.readbackTimerS=0)}r.queue.submit([s.finish()]),o!==null&&this._scheduleReadback(o)}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange(),r=new Uint8Array(i);this.textureData.set(r),t.unmap(),this.oceanTexture.needsUpdate=!0}).catch(i=>{console.warn("[OceanComputeSystem] Readback failed",i)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e){const t=this.uniformData;t[0]=this.gridW,t[1]=this.gridH,t[2]=e,t[3]=this.timeS,t[4]=this.viscosity,t[5]=this.waveSpeed,t[6]=this.mouseSize,t[7]=this.mouseDeep,t[8]=this.mousePos.x,t[9]=this.mousePos.y,t[10]=this.mouseSpeed.x,t[11]=this.mouseSpeed.y,t[12]=this.windStrength,t[13]=this.windDirection.x,t[14]=this.windDirection.y,t[15]=this.useWindField?1:0,this.device.queue.writeBuffer(this.uniformBuffer,0,t)}_wgslOcean(){return`
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
        `}dispose(){var e,t,i,r,s;this.heightBuffers&&this.heightBuffers.forEach(a=>a==null?void 0:a.destroy()),(e=this.prevHeightBuffer)==null||e.destroy(),(t=this.outputBuffer)==null||t.destroy(),(i=this.readbackBuffers)==null||i.forEach(a=>a==null?void 0:a.destroy()),(r=this.windFieldBuffer)==null||r.destroy(),(s=this.uniformBuffer)==null||s.destroy(),this.device=null,this.enabled=!1,this.ready=!1}}const tw="modulepreload",nw=function(n,e){return new URL(n,e).href},af={},iw=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let a=function(d){return Promise.all(d.map(h=>Promise.resolve(h).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));r=a(t.map(d=>{if(d=nw(d,i),d in af)return;af[d]=!0;const h=d.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(!!i)for(let x=o.length-1;x>=0;x--){const m=o[x];if(m.href===d&&(!h||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const g=document.createElement("link");if(g.rel=h?"stylesheet":tw,h||(g.as="script"),g.crossOrigin="",g.href=d,c&&g.setAttribute("nonce",c),document.head.appendChild(g),h)return new Promise((x,m)=>{g.addEventListener("load",x),g.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${d}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return e().catch(s)})};class rw{constructor(){j(this,"index",0);j(this,"input","")}new(e){return this.index=0,this.input=e,this}readAtomically(e){const t=this.index,i=e();return i===void 0&&(this.index=t),i}parseWith(e){const t=e();if(this.index===this.input.length)return t}peekChar(){if(!(this.index>=this.input.length))return this.input[this.index]}readChar(){if(!(this.index>=this.input.length))return this.input[this.index++]}readGivenChar(e){return this.readAtomically(()=>{const t=this.readChar();if(t===e)return t})}readSeparator(e,t,i){return this.readAtomically(()=>{if(!(t>0&&this.readGivenChar(e)===void 0))return i()})}readNumber(e,t,i,r){return this.readAtomically(()=>{let s=0,a=0;const o=this.peekChar();if(o===void 0)return;const l=o==="0",c=2**(8*r)-1;for(;;){const d=this.readAtomically(()=>{const h=this.readChar();if(h===void 0)return;const f=Number.parseInt(h,e);if(!Number.isNaN(f))return f});if(d===void 0)break;if(s*=e,s+=d,s>c||(a+=1,t!==void 0&&a>t))return}if(a!==0)return!i&&l&&a>1?void 0:s})}readIPv4Addr(){return this.readAtomically(()=>{const e=new Uint8Array(4);for(let t=0;t<e.length;t++){const i=this.readSeparator(".",t,()=>this.readNumber(10,3,!1,1));if(i===void 0)return;e[t]=i}return e})}readIPv6Addr(){const e=t=>{for(let i=0;i<t.length/2;i++){const r=i*2;if(i<t.length-3){const a=this.readSeparator(":",i,()=>this.readIPv4Addr());if(a!==void 0)return t[r]=a[0],t[r+1]=a[1],t[r+2]=a[2],t[r+3]=a[3],[r+4,!0]}const s=this.readSeparator(":",i,()=>this.readNumber(16,4,!0,2));if(s===void 0)return[r,!1];t[r]=s>>8,t[r+1]=s&255}return[t.length,!1]};return this.readAtomically(()=>{const t=new Uint8Array(16),[i,r]=e(t);if(i===16)return t;if(r||this.readGivenChar(":")===void 0||this.readGivenChar(":")===void 0)return;const s=new Uint8Array(14),a=16-(i+2),[o]=e(s.subarray(0,a));return t.set(s.subarray(0,o),16-o),t})}readIPAddr(){return this.readIPv4Addr()??this.readIPv6Addr()}}const sw=45,aw=15,Yo=new rw;function ow(n){if(!(n.length>aw))return Yo.new(n).parseWith(()=>Yo.readIPv4Addr())}function lw(n){if(n.includes("%")&&(n=n.split("%")[0]),!(n.length>sw))return Yo.new(n).parseWith(()=>Yo.readIPv6Addr())}function Im(n){return!!ow(n)}function cw(n){return!!lw(n)}function Lm(n=0){return new Uint8Array(n)}function uw(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function dw(n){if(uw(n))return n;const e=n.slice();return new Uint8Array(e.buffer,0,e.byteLength)}function Um(n,e){e==null&&(e=n.reduce((r,s)=>r+s.length,0));const t=Lm(e);let i=0;for(const r of n)t.set(r,i),i+=r.length;return dw(t)}function hw(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function ha(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return fa(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return fa(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function fw(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const of=4096;function pw(n){const e=n.length;if(e<=of)return String.fromCharCode.apply(String,n);let t="",i=0;for(;i<e;)t+=String.fromCharCode.apply(String,n.subarray(i,i+=of));return t}function mw(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function fa(n){return mw(n)?n:n.slice()}function gw(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var d=n.length,h=n.charAt(0),f=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function g(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,b=0,v=0,M=u.length;v!==M&&u[v]===0;)v++,y++;for(var S=(M-v)*p+1>>>0,E=new Uint8Array(S);v!==M;){for(var A=u[v],w=0,_=S-1;(A!==0||w<b)&&_!==-1;_--,w++)A+=256*E[_]>>>0,E[_]=A%d>>>0,A=A/d>>>0;if(A!==0)throw new Error("Non-zero carry");b=w,v++}for(var R=S-b;R!==S&&E[R]===0;)R++;for(var U=h.repeat(y);R<S;++R)U+=n.charAt(E[R]);return U}function x(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var b=0,v=0;u[y]===h;)b++,y++;for(var M=(u.length-y)*f+1>>>0,S=new Uint8Array(M);u[y];){var E=i[u.charCodeAt(y)];if(E===255)return;for(var A=0,w=M-1;(E!==0||A<v)&&w!==-1;w--,A++)E+=d*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");v=A,y++}if(u[y]!==" "){for(var _=M-v;_!==M&&S[_]===0;)_++;for(var R=new Uint8Array(b+(M-_)),U=b;_!==M;)R[U++]=S[_++];return R}}}function m(u){var y=x(u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:x,decode:m}}var vw=gw,yw=vw;let xw=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},bw=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Nm(this,e)}},_w=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return Nm(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Nm(n,e){return new _w({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let ww=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new xw(e,t,i),this.decoder=new bw(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function vl({name:n,prefix:e,encode:t,decode:i}){return new ww(n,e,t,i)}function wa({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=yw(t,n,i);return vl({prefix:e,name:n,encode:r,decode:a=>ha(s(a))})}function Sw(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const d=e[n[c]];if(d===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|d,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function Mw(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function Ew(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function Ht({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=Ew(i,r);return vl({prefix:e,name:n,encode(a){return Mw(a,i,t)},decode(a){return Sw(a,s,t,n)}})}const Tw=wa({prefix:"9",name:"base10",alphabet:"0123456789"}),Aw=Object.freeze(Object.defineProperty({__proto__:null,base10:Tw},Symbol.toStringTag,{value:"Module"})),Cw=Ht({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0}),Rw=Ht({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0}),Pw=Object.freeze(Object.defineProperty({__proto__:null,base16:Cw,base16upper:Rw},Symbol.toStringTag,{value:"Module"})),Dw=Ht({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),Iw=Object.freeze(Object.defineProperty({__proto__:null,base2:Dw},Symbol.toStringTag,{value:"Module"})),Fm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),Lw=Fm.reduce((n,e,t)=>(n[t]=e,n),[]),Uw=Fm.reduce((n,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return n[i]=t,n},[]);function Nw(n){return n.reduce((e,t)=>(e+=Lw[t],e),"")}function Fw(n){const e=[];for(const t of n){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const r=Uw[i];if(r==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(r)}return new Uint8Array(e)}const Bw=vl({prefix:"🚀",name:"base256emoji",encode:Nw,decode:Fw}),Ow=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:Bw},Symbol.toStringTag,{value:"Module"})),os=Ht({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0}),zw=Ht({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0}),kw=Ht({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0}),Gw=Ht({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0}),Vw=Ht({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0}),Hw=Ht({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0}),Ww=Ht({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0}),qw=Ht({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0}),Xw=Ht({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),$w=Object.freeze(Object.defineProperty({__proto__:null,base32:os,base32hex:Vw,base32hexpad:Ww,base32hexpadupper:qw,base32hexupper:Hw,base32pad:kw,base32padupper:Gw,base32upper:zw,base32z:Xw},Symbol.toStringTag,{value:"Module"})),Mo=wa({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0}),Yw=wa({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0}),jw=Object.freeze(Object.defineProperty({__proto__:null,base36:Mo,base36upper:Yw},Symbol.toStringTag,{value:"Module"})),hi=wa({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),Kw=wa({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),Qw=Object.freeze(Object.defineProperty({__proto__:null,base58btc:hi,base58flickr:Kw},Symbol.toStringTag,{value:"Module"})),Zw=Ht({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Jw=Ht({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),Bm=Ht({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),eS=Ht({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),tS=Object.freeze(Object.defineProperty({__proto__:null,base64:Zw,base64pad:Jw,base64url:Bm,base64urlpad:eS},Symbol.toStringTag,{value:"Module"})),nS=Ht({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),iS=Object.freeze(Object.defineProperty({__proto__:null,base8:nS},Symbol.toStringTag,{value:"Module"})),rS=vl({prefix:"\0",name:"identity",encode:n=>pw(ha(n)),decode:n=>ha(fw(n))}),sS=Object.freeze(Object.defineProperty({__proto__:null,identity:rS},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;var aS=Om,lf=128,oS=-128,lS=Math.pow(2,31);function Om(n,e,t){e=e||[],t=t||0;for(var i=t;n>=lS;)e[t++]=n&255|lf,n/=128;for(;n&oS;)e[t++]=n&255|lf,n>>>=7;return e[t]=n|0,Om.bytes=t-i+1,e}var cS=_u,uS=128,cf=127;function _u(n,i){var t=0,i=i||0,r=0,s=i,a,o=n.length;do{if(s>=o)throw _u.bytes=0,new RangeError("Could not decode varint");a=n[s++],t+=r<28?(a&cf)<<r:(a&cf)*Math.pow(2,r),r+=7}while(a>=uS);return _u.bytes=s-i,t}var dS=Math.pow(2,7),hS=Math.pow(2,14),fS=Math.pow(2,21),pS=Math.pow(2,28),mS=Math.pow(2,35),gS=Math.pow(2,42),vS=Math.pow(2,49),yS=Math.pow(2,56),xS=Math.pow(2,63),bS=function(n){return n<dS?1:n<hS?2:n<fS?3:n<pS?4:n<mS?5:n<gS?6:n<vS?7:n<yS?8:n<xS?9:10},_S={encode:aS,decode:cS,encodingLength:bS},jo=_S;function wu(n,e=0){const t=jo.decode(n,e),i=jo.decode.bytes;if(i>9)throw new RangeError("Invalid varint: too long");if(i>1&&n[e+i-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,i]}function Ko(n,e,t=0){return jo.encode(n,e,t),e}function Qo(n){return jo.encodingLength(n)}function wS(n,e){const t=e.byteLength,i=Qo(n),r=i+Qo(t),s=new Uint8Array(r+t);return Ko(n,s,0),Ko(t,s,i),s.set(e,r),new pd(n,t,e,s)}function SS(n){const e=ha(n),[t,i]=wu(e),[r,s]=wu(e.subarray(i)),a=e.subarray(i+s);if(a.byteLength!==r)throw new Error("Incorrect length");return new pd(t,r,a,e)}function MS(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&hw(n.bytes,t.bytes)}}let pd=class{constructor(e,t,i,r){j(this,"code");j(this,"size");j(this,"digest");j(this,"bytes");this.code=e,this.size=t,this.digest=fa(i),this.bytes=fa(r)}};function uf(n,e){const{bytes:t,version:i}=n;switch(i){case 0:return AS(t,Su(n),e??hi.encoder);default:return CS(t,Su(n),e??os.encoder)}}const df=new WeakMap;function Su(n){const e=df.get(n);if(e==null){const t=new Map;return df.set(n,t),t}return e}var Wp;let ES=class jt{constructor(e,t,i,r){j(this,"code");j(this,"version");j(this,"multihash");j(this,"bytes");j(this,"/");j(this,Wp,"CID");this.code=t,this.version=e,this.multihash=i,this.bytes=fa(r),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Ns)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==RS)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return jt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,i=wS(e,t);return jt.createV1(this.code,i)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return jt.equals(this,e)}static equals(e,t){const i=t;return i!=null&&e.code===i.code&&e.version===i.version&&MS(e.multihash,i.multihash)}toString(e){return uf(this,e)}toJSON(){return{"/":uf(this)}}link(){return this}[(Wp=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof jt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:i,code:r,multihash:s,bytes:a}=t;return new jt(i,r,s,a??hf(i,r,s.bytes))}else if(t[PS]===!0){const{version:i,multihash:r,code:s}=t,a=SS(r);return jt.create(i,s,a)}else return null}static create(e,t,i){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(i.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Ns)throw new Error(`Version 0 CID must use dag-pb (code: ${Ns}) block encoding`);return new jt(e,t,i,i.bytes)}case 1:{const r=hf(e,t,i.bytes);return new jt(e,t,i,r)}default:throw new Error("Invalid version")}}static createV0(e){return jt.create(0,Ns,e)}static createV1(e,t){return jt.create(1,e,t)}static decode(e){const[t,i]=jt.decodeFirst(e);if(i.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=jt.inspectBytes(e),i=t.size-t.multihashSize,r=ha(e.subarray(i,i+t.multihashSize));if(r.byteLength!==t.multihashSize)throw new Error("Incorrect length");const s=r.subarray(t.multihashSize-t.digestSize),a=new pd(t.multihashCode,t.digestSize,s,r);return[t.version===0?jt.createV0(a):jt.createV1(t.codec,a),e.subarray(t.size)]}static inspectBytes(e){let t=0;const i=()=>{const[h,f]=wu(e.subarray(t));return t+=f,h};let r=i(),s=Ns;if(r===18?(r=0,t=0):s=i(),r!==0&&r!==1)throw new RangeError(`Invalid CID version ${r}`);const a=t,o=i(),l=i(),c=t+l,d=c-a;return{version:r,codec:s,multihashCode:o,digestSize:l,multihashSize:d,size:c}}static parse(e,t){const[i,r]=TS(e,t),s=jt.decode(r);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Su(s).set(i,e),s}};function TS(n,e){switch(n[0]){case"Q":{const t=e??hi;return[hi.prefix,t.decode(`${hi.prefix}${n}`)]}case hi.prefix:{const t=e??hi;return[hi.prefix,t.decode(n)]}case os.prefix:{const t=e??os;return[os.prefix,t.decode(n)]}case Mo.prefix:{const t=e??Mo;return[Mo.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function AS(n,e,t){const{prefix:i}=t;if(i!==hi.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const r=e.get(i);if(r==null){const s=t.encode(n).slice(1);return e.set(i,s),s}else return r}function CS(n,e,t){const{prefix:i}=t,r=e.get(i);if(r==null){const s=t.encode(n);return e.set(i,s),s}else return r}const Ns=112,RS=18;function hf(n,e,t){const i=Qo(n),r=i+Qo(e),s=new Uint8Array(r+t.byteLength);return Ko(n,s,0),Ko(e,s,i),s.set(t,r),s}const PS=Symbol.for("@ipld/js-cid/CID"),Mu={...sS,...Iw,...iS,...Aw,...Pw,...$w,...jw,...Qw,...tS,...Ow};function zm(n,e,t,i){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:i}}}const ff=zm("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),lc=zm("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Lm(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),km={utf8:ff,"utf-8":ff,hex:Mu.base16,latin1:lc,ascii:lc,binary:lc,...Mu};function Gm(n,e="utf8"){const t=km[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}function Zo(n,e="utf8"){const t=km[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.encoder.encode(n).substring(1)}class _r extends Error{constructor(){super(...arguments);j(this,"name","InvalidMultiaddrError")}}j(_r,"name","InvalidMultiaddrError");class _s extends Error{constructor(){super(...arguments);j(this,"name","ValidationError")}}j(_s,"name","ValidationError");class Vm extends Error{constructor(){super(...arguments);j(this,"name","UnknownProtocolError")}}j(Vm,"name","UnknownProtocolError");const DS=4,IS=6,LS=273,US=33,NS=41,FS=42,BS=43,OS=53,zS=54,kS=55,GS=56,VS=132,HS=301,WS=302,qS=400,XS=421,$S=444,YS=445,jS=446,KS=447,QS=448,ZS=449,JS=454,eM=460,tM=461,nM=465,iM=466,rM=480,sM=481,aM=443,oM=477,lM=478,cM=479,uM=277,dM=275,hM=276,fM=280,pM=281,mM=290,gM=777;function pf(n){return e=>Zo(e,n)}function mf(n){return e=>Gm(e,n)}function $s(n){return new DataView(n.buffer).getUint16(n.byteOffset).toString()}function Jr(n){const e=new ArrayBuffer(2);return new DataView(e).setUint16(0,typeof n=="string"?parseInt(n):n),new Uint8Array(e)}function vM(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==16)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion address.`);const t=Gm(e[0],"base32"),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const r=Jr(i);return Um([t,r],t.length+r.length)}function yM(n){const e=n.split(":");if(e.length!==2)throw new Error(`failed to parse onion addr: ["'${e.join('", "')}'"]' does not contain a port number`);if(e[0].length!==56)throw new Error(`failed to parse onion addr: ${e[0]} not a Tor onion3 address.`);const t=os.decode(`b${e[0]}`),i=parseInt(e[1],10);if(i<1||i>65536)throw new Error("Port number is not in range(1, 65536)");const r=Jr(i);return Um([t,r],t.length+r.length)}function gf(n){const e=n.subarray(0,n.length-2),t=n.subarray(n.length-2),i=Zo(e,"base32"),r=$s(t);return`${i}:${r}`}const Hm=function(n){n=n.toString().trim();const e=new Uint8Array(4);return n.split(/\./g).forEach((t,i)=>{const r=parseInt(t,10);if(isNaN(r)||r<0||r>255)throw new _r("Invalid byte value in IP address");e[i]=r}),e},xM=function(n){let e=0;n=n.toString().trim();const t=n.split(":",8);let i;for(i=0;i<t.length;i++){const s=Im(t[i]);let a;s&&(a=Hm(t[i]),t[i]=Zo(a.subarray(0,2),"base16")),a!=null&&++i<8&&t.splice(i,0,Zo(a.subarray(2,4),"base16"))}if(t[0]==="")for(;t.length<8;)t.unshift("0");else if(t[t.length-1]==="")for(;t.length<8;)t.push("0");else if(t.length<8){for(i=0;i<t.length&&t[i]!=="";i++);const s=[i,1];for(i=9-t.length;i>0;i--)s.push("0");t.splice.apply(t,s)}const r=new Uint8Array(e+16);for(i=0;i<t.length;i++){t[i]===""&&(t[i]="0");const s=parseInt(t[i],16);if(isNaN(s)||s<0||s>65535)throw new _r("Invalid byte value in IP address");r[e++]=s>>8&255,r[e++]=s&255}return r},bM=function(n){if(n.byteLength!==4)throw new _r("IPv4 address was incorrect length");const e=[];for(let t=0;t<n.byteLength;t++)e.push(n[t]);return e.join(".")},_M=function(n){if(n.byteLength!==16)throw new _r("IPv6 address was incorrect length");const e=[];for(let i=0;i<n.byteLength;i+=2){const r=n[i],s=n[i+1],a=`${r.toString(16).padStart(2,"0")}${s.toString(16).padStart(2,"0")}`;e.push(a)}const t=e.join(":");try{const i=new URL(`http://[${t}]`);return i.hostname.substring(1,i.hostname.length-1)}catch{throw new _r(`Invalid IPv6 address "${t}"`)}};function wM(n){try{const e=new URL(`http://[${n}]`);return e.hostname.substring(1,e.hostname.length-1)}catch{throw new _r(`Invalid IPv6 address "${n}"`)}}const cc=Object.values(Mu).map(n=>n.decoder),SM=(function(){let n=cc[0].or(cc[1]);return cc.slice(2).forEach(e=>n=n.or(e)),n})();function MM(n){return SM.decode(n)}function EM(n){return e=>n.encoder.encode(e)}function TM(n){if(parseInt(n).toString()!==n)throw new _s("Value must be an integer")}function AM(n){if(n<0)throw new _s("Value must be a positive integer, or zero")}function CM(n){return e=>{if(e>n)throw new _s(`Value must be smaller than or equal to ${n}`)}}function RM(...n){return e=>{for(const t of n)t(e)}}const io=RM(TM,AM,CM(65535)),bn=-1;class PM{constructor(){j(this,"protocolsByCode",new Map);j(this,"protocolsByName",new Map)}getProtocol(e){let t;if(typeof e=="string"?t=this.protocolsByName.get(e):t=this.protocolsByCode.get(e),t==null)throw new Vm(`Protocol ${e} was unknown`);return t}addProtocol(e){var t;this.protocolsByCode.set(e.code,e),this.protocolsByName.set(e.name,e),(t=e.aliases)==null||t.forEach(i=>{this.protocolsByName.set(i,e)})}removeProtocol(e){var i;const t=this.protocolsByCode.get(e);t!=null&&(this.protocolsByCode.delete(t.code),this.protocolsByName.delete(t.name),(i=t.aliases)==null||i.forEach(r=>{this.protocolsByName.delete(r)}))}}const DM=new PM,IM=[{code:DS,name:"ip4",size:32,valueToBytes:Hm,bytesToValue:bM,validate:n=>{if(!Im(n))throw new _s(`Invalid IPv4 address "${n}"`)}},{code:IS,name:"tcp",size:16,valueToBytes:Jr,bytesToValue:$s,validate:io},{code:LS,name:"udp",size:16,valueToBytes:Jr,bytesToValue:$s,validate:io},{code:US,name:"dccp",size:16,valueToBytes:Jr,bytesToValue:$s,validate:io},{code:NS,name:"ip6",size:128,valueToBytes:xM,bytesToValue:_M,stringToValue:wM,validate:n=>{if(!cw(n))throw new _s(`Invalid IPv6 address "${n}"`)}},{code:FS,name:"ip6zone",size:bn},{code:BS,name:"ipcidr",size:8,bytesToValue:pf("base10"),valueToBytes:mf("base10")},{code:OS,name:"dns",size:bn},{code:zS,name:"dns4",size:bn},{code:kS,name:"dns6",size:bn},{code:GS,name:"dnsaddr",size:bn},{code:VS,name:"sctp",size:16,valueToBytes:Jr,bytesToValue:$s,validate:io},{code:HS,name:"udt"},{code:WS,name:"utp"},{code:qS,name:"unix",size:bn,stringToValue:n=>decodeURIComponent(n),valueToString:n=>encodeURIComponent(n)},{code:XS,name:"p2p",aliases:["ipfs"],size:bn,bytesToValue:pf("base58btc"),valueToBytes:n=>n.startsWith("Q")||n.startsWith("1")?mf("base58btc")(n):ES.parse(n).multihash.bytes},{code:$S,name:"onion",size:96,bytesToValue:gf,valueToBytes:vM},{code:YS,name:"onion3",size:296,bytesToValue:gf,valueToBytes:yM},{code:jS,name:"garlic64",size:bn},{code:KS,name:"garlic32",size:bn},{code:QS,name:"tls"},{code:ZS,name:"sni",size:bn},{code:JS,name:"noise"},{code:eM,name:"quic"},{code:tM,name:"quic-v1"},{code:nM,name:"webtransport"},{code:iM,name:"certhash",size:bn,bytesToValue:EM(Bm),valueToBytes:MM},{code:rM,name:"http"},{code:sM,name:"http-path",size:bn,stringToValue:n=>`/${decodeURIComponent(n)}`,valueToString:n=>encodeURIComponent(n.substring(1))},{code:aM,name:"https"},{code:oM,name:"ws"},{code:lM,name:"wss"},{code:cM,name:"p2p-websocket-star"},{code:uM,name:"p2p-stardust"},{code:dM,name:"p2p-webrtc-star"},{code:hM,name:"p2p-webrtc-direct"},{code:fM,name:"webrtc-direct"},{code:pM,name:"webrtc"},{code:mM,name:"p2p-circuit"},{code:gM,name:"memory",size:bn}];IM.forEach(n=>{DM.addProtocol(n)});function Eu(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return yf(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return yf(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function LM(n){const e=new Uint8Array(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}const vf=4096;function UM(n){const e=n.length;if(e<=vf)return String.fromCharCode.apply(String,n);let t="",i=0;for(;i<e;)t+=String.fromCharCode.apply(String,n.subarray(i,i+=vf));return t}function NM(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function yf(n){return NM(n)?n:n.slice()}function FM(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var d=n.length,h=n.charAt(0),f=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function g(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,b=0,v=0,M=u.length;v!==M&&u[v]===0;)v++,y++;for(var S=(M-v)*p+1>>>0,E=new Uint8Array(S);v!==M;){for(var A=u[v],w=0,_=S-1;(A!==0||w<b)&&_!==-1;_--,w++)A+=256*E[_]>>>0,E[_]=A%d>>>0,A=A/d>>>0;if(A!==0)throw new Error("Non-zero carry");b=w,v++}for(var R=S-b;R!==S&&E[R]===0;)R++;for(var U=h.repeat(y);R<S;++R)U+=n.charAt(E[R]);return U}function x(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var b=0,v=0;u[y]===h;)b++,y++;for(var M=(u.length-y)*f+1>>>0,S=new Uint8Array(M);u[y];){var E=i[u.charCodeAt(y)];if(E===255)return;for(var A=0,w=M-1;(E!==0||A<v)&&w!==-1;w--,A++)E+=d*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");v=A,y++}if(u[y]!==" "){for(var _=M-v;_!==M&&S[_]===0;)_++;for(var R=new Uint8Array(b+(M-_)),U=b;_!==M;)R[U++]=S[_++];return R}}}function m(u){var y=x(u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:x,decode:m}}var BM=FM,OM=BM;let zM=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},kM=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Wm(this,e)}},GM=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return Wm(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Wm(n,e){return new GM({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let VM=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new zM(e,t,i),this.decoder=new kM(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function yl({name:n,prefix:e,encode:t,decode:i}){return new VM(n,e,t,i)}function Sa({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=OM(t,n,i);return yl({prefix:e,name:n,encode:r,decode:a=>Eu(s(a))})}function HM(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const d=e[n[c]];if(d===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|d,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function WM(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function qM(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function Wt({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=qM(i,r);return yl({prefix:e,name:n,encode(a){return WM(a,i,t)},decode(a){return HM(a,s,t,n)}})}Sa({prefix:"9",name:"base10",alphabet:"0123456789"});Wt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4,caseInsensitive:!0});Wt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4,caseInsensitive:!0});Wt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1});const qm=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),XM=qm.reduce((n,e,t)=>(n[t]=e,n),[]),$M=qm.reduce((n,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return n[i]=t,n},[]);function YM(n){return n.reduce((e,t)=>(e+=XM[t],e),"")}function jM(n){const e=[];for(const t of n){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const r=$M[i];if(r==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(r)}return new Uint8Array(e)}yl({prefix:"🚀",name:"base256emoji",encode:YM,decode:jM});Wt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});Wt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});Sa({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});Sa({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});Sa({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});Sa({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});Wt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6});Wt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6});Wt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6});Wt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6});Wt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3});yl({prefix:"\0",name:"identity",encode:n=>UM(Eu(n)),decode:n=>Eu(LM(n))});new TextEncoder;new TextDecoder;const KM="/",QM=new TextEncoder().encode(KM);QM[0];function ZM(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return n;if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return new Uint8Array(n.buffer,n.byteOffset,n.byteLength);throw new Error("Unknown type, must be binary type")}function JM(n){return new TextEncoder().encode(n)}function e2(n){return new TextDecoder().decode(n)}function t2(n,e){if(n.length>=255)throw new TypeError("Alphabet too long");for(var t=new Uint8Array(256),i=0;i<t.length;i++)t[i]=255;for(var r=0;r<n.length;r++){var s=n.charAt(r),a=s.charCodeAt(0);if(t[a]!==255)throw new TypeError(s+" is ambiguous");t[a]=r}var o=n.length,l=n.charAt(0),c=Math.log(o)/Math.log(256),d=Math.log(256)/Math.log(o);function h(g){if(g instanceof Uint8Array||(ArrayBuffer.isView(g)?g=new Uint8Array(g.buffer,g.byteOffset,g.byteLength):Array.isArray(g)&&(g=Uint8Array.from(g))),!(g instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(g.length===0)return"";for(var x=0,m=0,u=0,y=g.length;u!==y&&g[u]===0;)u++,x++;for(var b=(y-u)*d+1>>>0,v=new Uint8Array(b);u!==y;){for(var M=g[u],S=0,E=b-1;(M!==0||S<m)&&E!==-1;E--,S++)M+=256*v[E]>>>0,v[E]=M%o>>>0,M=M/o>>>0;if(M!==0)throw new Error("Non-zero carry");m=S,u++}for(var A=b-m;A!==b&&v[A]===0;)A++;for(var w=l.repeat(x);A<b;++A)w+=n.charAt(v[A]);return w}function f(g){if(typeof g!="string")throw new TypeError("Expected String");if(g.length===0)return new Uint8Array;var x=0;if(g[x]!==" "){for(var m=0,u=0;g[x]===l;)m++,x++;for(var y=(g.length-x)*c+1>>>0,b=new Uint8Array(y);g[x];){var v=t[g.charCodeAt(x)];if(v===255)return;for(var M=0,S=y-1;(v!==0||M<u)&&S!==-1;S--,M++)v+=o*b[S]>>>0,b[S]=v%256>>>0,v=v/256>>>0;if(v!==0)throw new Error("Non-zero carry");u=M,x++}if(g[x]!==" "){for(var E=y-u;E!==y&&b[E]===0;)E++;for(var A=new Uint8Array(m+(y-E)),w=m;E!==y;)A[w++]=b[E++];return A}}}function p(g){var x=f(g);if(x)return x;throw new Error(`Non-${e} character`)}return{encode:h,decodeUnsafe:f,decode:p}}var n2=t2,i2=n2;let r2=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},s2=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return Xm(this,e)}},a2=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return Xm(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function Xm(n,e){return new a2({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let o2=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new r2(e,t,i),this.decoder=new s2(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function xl({name:n,prefix:e,encode:t,decode:i}){return new o2(n,e,t,i)}function Ma({name:n,prefix:e,alphabet:t}){const{encode:i,decode:r}=i2(t,n);return xl({prefix:e,name:n,encode:i,decode:s=>ZM(r(s))})}function l2(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const d=e[n[c]];if(d===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|d,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function c2(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function u2(n){const e={};for(let t=0;t<n.length;++t)e[n[t]]=t;return e}function qt({name:n,prefix:e,bitsPerChar:t,alphabet:i}){const r=u2(i);return xl({prefix:e,name:n,encode(s){return c2(s,i,t)},decode(s){return l2(s,r,t,n)}})}const d2=Ma({prefix:"9",name:"base10",alphabet:"0123456789"}),h2=Object.freeze(Object.defineProperty({__proto__:null,base10:d2},Symbol.toStringTag,{value:"Module"})),f2=qt({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),p2=qt({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),m2=Object.freeze(Object.defineProperty({__proto__:null,base16:f2,base16upper:p2},Symbol.toStringTag,{value:"Module"})),g2=qt({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),v2=Object.freeze(Object.defineProperty({__proto__:null,base2:g2},Symbol.toStringTag,{value:"Module"})),$m=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),y2=$m.reduce((n,e,t)=>(n[t]=e,n),[]),x2=$m.reduce((n,e,t)=>{const i=e.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${e}`);return n[i]=t,n},[]);function b2(n){return n.reduce((e,t)=>(e+=y2[t],e),"")}function _2(n){const e=[];for(const t of n){const i=t.codePointAt(0);if(i==null)throw new Error(`Invalid character: ${t}`);const r=x2[i];if(r==null)throw new Error(`Non-base256emoji character: ${t}`);e.push(r)}return new Uint8Array(e)}const w2=xl({prefix:"🚀",name:"base256emoji",encode:b2,decode:_2}),S2=Object.freeze(Object.defineProperty({__proto__:null,base256emoji:w2},Symbol.toStringTag,{value:"Module"})),M2=qt({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),E2=qt({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),T2=qt({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),A2=qt({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),C2=qt({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),R2=qt({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),P2=qt({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),D2=qt({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),I2=qt({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),L2=Object.freeze(Object.defineProperty({__proto__:null,base32:M2,base32hex:C2,base32hexpad:P2,base32hexpadupper:D2,base32hexupper:R2,base32pad:T2,base32padupper:A2,base32upper:E2,base32z:I2},Symbol.toStringTag,{value:"Module"})),U2=Ma({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),N2=Ma({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),F2=Object.freeze(Object.defineProperty({__proto__:null,base36:U2,base36upper:N2},Symbol.toStringTag,{value:"Module"})),B2=Ma({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),O2=Ma({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),z2=Object.freeze(Object.defineProperty({__proto__:null,base58btc:B2,base58flickr:O2},Symbol.toStringTag,{value:"Module"})),k2=qt({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),G2=qt({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),V2=qt({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),H2=qt({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),W2=Object.freeze(Object.defineProperty({__proto__:null,base64:k2,base64pad:G2,base64url:V2,base64urlpad:H2},Symbol.toStringTag,{value:"Module"})),q2=qt({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),X2=Object.freeze(Object.defineProperty({__proto__:null,base8:q2},Symbol.toStringTag,{value:"Module"})),$2=xl({prefix:"\0",name:"identity",encode:n=>e2(n),decode:n=>JM(n)}),Y2=Object.freeze(Object.defineProperty({__proto__:null,identity:$2},Symbol.toStringTag,{value:"Module"}));new TextEncoder;new TextDecoder;const xf={...Y2,...v2,...X2,...h2,...m2,...L2,...F2,...z2,...W2,...S2};function Tu(n=0){return new Uint8Array(n)}function Jo(n=0){return new Uint8Array(n)}function Ym(n,e,t,i){return{name:n,prefix:e,encoder:{name:n,prefix:e,encode:t},decoder:{decode:i}}}const bf=Ym("utf8","u",n=>"u"+new TextDecoder("utf8").decode(n),n=>new TextEncoder().encode(n.substring(1))),uc=Ym("ascii","a",n=>{let e="a";for(let t=0;t<n.length;t++)e+=String.fromCharCode(n[t]);return e},n=>{n=n.substring(1);const e=Jo(n.length);for(let t=0;t<n.length;t++)e[t]=n.charCodeAt(t);return e}),j2={utf8:bf,"utf-8":bf,hex:xf.base16,latin1:uc,ascii:uc,binary:uc,...xf};function K2(n,e="utf8"){const t=j2[e];if(t==null)throw new Error(`Unsupported encoding "${e}"`);return t.decoder.decode(`${t.prefix}${n}`)}const Q2=Math.pow(2,7),Z2=Math.pow(2,14),J2=Math.pow(2,21),jm=Math.pow(2,28),Km=Math.pow(2,35),Qm=Math.pow(2,42),Zm=Math.pow(2,49),sn=128,Ii=127;function md(n){if(n<Q2)return 1;if(n<Z2)return 2;if(n<J2)return 3;if(n<jm)return 4;if(n<Km)return 5;if(n<Qm)return 6;if(n<Zm)return 7;if(Number.MAX_SAFE_INTEGER!=null&&n>Number.MAX_SAFE_INTEGER)throw new RangeError("Could not encode varint");return 8}function eE(n,e,t=0){switch(md(n)){case 8:e[t++]=n&255|sn,n/=128;case 7:e[t++]=n&255|sn,n/=128;case 6:e[t++]=n&255|sn,n/=128;case 5:e[t++]=n&255|sn,n/=128;case 4:e[t++]=n&255|sn,n>>>=7;case 3:e[t++]=n&255|sn,n>>>=7;case 2:e[t++]=n&255|sn,n>>>=7;case 1:{e[t++]=n&255,n>>>=7;break}default:throw new Error("unreachable")}return e}function tE(n,e){let t=n[e],i=0;if(i+=t&Ii,t<sn||(t=n[e+1],i+=(t&Ii)<<7,t<sn)||(t=n[e+2],i+=(t&Ii)<<14,t<sn)||(t=n[e+3],i+=(t&Ii)<<21,t<sn)||(t=n[e+4],i+=(t&Ii)*jm,t<sn)||(t=n[e+5],i+=(t&Ii)*Km,t<sn)||(t=n[e+6],i+=(t&Ii)*Qm,t<sn)||(t=n[e+7],i+=(t&Ii)*Zm,t<sn))return i;throw new RangeError("Could not decode varint")}const gd=new Float32Array([-0]),Bi=new Uint8Array(gd.buffer);function nE(n,e,t){gd[0]=n,e[t]=Bi[0],e[t+1]=Bi[1],e[t+2]=Bi[2],e[t+3]=Bi[3]}function iE(n,e){return Bi[0]=n[e],Bi[1]=n[e+1],Bi[2]=n[e+2],Bi[3]=n[e+3],gd[0]}const vd=new Float64Array([-0]),Kt=new Uint8Array(vd.buffer);function rE(n,e,t){vd[0]=n,e[t]=Kt[0],e[t+1]=Kt[1],e[t+2]=Kt[2],e[t+3]=Kt[3],e[t+4]=Kt[4],e[t+5]=Kt[5],e[t+6]=Kt[6],e[t+7]=Kt[7]}function sE(n,e){return Kt[0]=n[e],Kt[1]=n[e+1],Kt[2]=n[e+2],Kt[3]=n[e+3],Kt[4]=n[e+4],Kt[5]=n[e+5],Kt[6]=n[e+6],Kt[7]=n[e+7],vd[0]}const aE=BigInt(Number.MAX_SAFE_INTEGER),oE=BigInt(Number.MIN_SAFE_INTEGER);class Qt{constructor(e,t){j(this,"lo");j(this,"hi");this.lo=e|0,this.hi=t|0}toNumber(e=!1){if(!e&&this.hi>>>31>0){const t=~this.lo+1>>>0;let i=~this.hi>>>0;return t===0&&(i=i+1>>>0),-(t+i*4294967296)}return this.lo+this.hi*4294967296}toBigInt(e=!1){if(e)return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n);if(this.hi>>>31){const t=~this.lo+1>>>0;let i=~this.hi>>>0;return t===0&&(i=i+1>>>0),-(BigInt(t)+(BigInt(i)<<32n))}return BigInt(this.lo>>>0)+(BigInt(this.hi>>>0)<<32n)}toString(e=!1){return this.toBigInt(e).toString()}zzEncode(){const e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this}zzDecode(){const e=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this}length(){const e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,i=this.hi>>>24;return i===0?t===0?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:i<128?9:10}static fromBigInt(e){if(e===0n)return mr;if(e<aE&&e>oE)return this.fromNumber(Number(e));const t=e<0n;t&&(e=-e);let i=e>>32n,r=e-(i<<32n);return t&&(i=~i|0n,r=~r|0n,++r>_f&&(r=0n,++i>_f&&(i=0n))),new Qt(Number(r),Number(i))}static fromNumber(e){if(e===0)return mr;const t=e<0;t&&(e=-e);let i=e>>>0,r=(e-i)/4294967296>>>0;return t&&(r=~r>>>0,i=~i>>>0,++i>4294967295&&(i=0,++r>4294967295&&(r=0))),new Qt(i,r)}static from(e){return typeof e=="number"?Qt.fromNumber(e):typeof e=="bigint"?Qt.fromBigInt(e):typeof e=="string"?Qt.fromBigInt(BigInt(e)):e.low!=null||e.high!=null?new Qt(e.low>>>0,e.high>>>0):mr}}const mr=new Qt(0,0);mr.toBigInt=function(){return 0n};mr.zzEncode=mr.zzDecode=function(){return this};mr.length=function(){return 1};const _f=4294967296n;function lE(n){let e=0,t=0;for(let i=0;i<n.length;++i)t=n.charCodeAt(i),t<128?e+=1:t<2048?e+=2:(t&64512)===55296&&(n.charCodeAt(i+1)&64512)===56320?(++i,e+=4):e+=3;return e}function cE(n,e,t){if(t-e<1)return"";let r;const s=[];let a=0,o;for(;e<t;)o=n[e++],o<128?s[a++]=o:o>191&&o<224?s[a++]=(o&31)<<6|n[e++]&63:o>239&&o<365?(o=((o&7)<<18|(n[e++]&63)<<12|(n[e++]&63)<<6|n[e++]&63)-65536,s[a++]=55296+(o>>10),s[a++]=56320+(o&1023)):s[a++]=(o&15)<<12|(n[e++]&63)<<6|n[e++]&63,a>8191&&((r??(r=[])).push(String.fromCharCode.apply(String,s)),a=0);return r!=null?(a>0&&r.push(String.fromCharCode.apply(String,s.slice(0,a))),r.join("")):String.fromCharCode.apply(String,s.slice(0,a))}function Jm(n,e,t){const i=t;let r,s;for(let a=0;a<n.length;++a)r=n.charCodeAt(a),r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&((s=n.charCodeAt(a+1))&64512)===56320?(r=65536+((r&1023)<<10)+(s&1023),++a,e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128);return t-i}function Gn(n,e){return RangeError(`index out of range: ${n.pos} + ${e??1} > ${n.len}`)}function ro(n,e){return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0}class uE{constructor(e){j(this,"buf");j(this,"pos");j(this,"len");j(this,"_slice",Uint8Array.prototype.subarray);this.buf=e,this.pos=0,this.len=e.length}uint32(){let e=4294967295;if(e=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(e=(e|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(e=(e|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return e;if((this.pos+=5)>this.len)throw this.pos=this.len,Gn(this,10);return e}int32(){return this.uint32()|0}sint32(){const e=this.uint32();return e>>>1^-(e&1)|0}bool(){return this.uint32()!==0}fixed32(){if(this.pos+4>this.len)throw Gn(this,4);return ro(this.buf,this.pos+=4)}sfixed32(){if(this.pos+4>this.len)throw Gn(this,4);return ro(this.buf,this.pos+=4)|0}float(){if(this.pos+4>this.len)throw Gn(this,4);const e=iE(this.buf,this.pos);return this.pos+=4,e}double(){if(this.pos+8>this.len)throw Gn(this,4);const e=sE(this.buf,this.pos);return this.pos+=8,e}bytes(){const e=this.uint32(),t=this.pos,i=this.pos+e;if(i>this.len)throw Gn(this,e);return this.pos+=e,t===i?new Uint8Array(0):this.buf.subarray(t,i)}string(){const e=this.bytes();return cE(e,0,e.length)}skip(e){if(typeof e=="number"){if(this.pos+e>this.len)throw Gn(this,e);this.pos+=e}else do if(this.pos>=this.len)throw Gn(this);while((this.buf[this.pos++]&128)!==0);return this}skipType(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(e=this.uint32()&7)!==4;)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error(`invalid wire type ${e} at offset ${this.pos}`)}return this}readLongVarint(){const e=new Qt(0,0);let t=0;if(this.len-this.pos>4){for(;t<4;++t)if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(this.buf[this.pos]&127)<<28)>>>0,e.hi=(e.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return e;t=0}else{for(;t<3;++t){if(this.pos>=this.len)throw Gn(this);if(e.lo=(e.lo|(this.buf[this.pos]&127)<<t*7)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(this.buf[this.pos++]&127)<<t*7)>>>0,e}if(this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw Gn(this);if(e.hi=(e.hi|(this.buf[this.pos]&127)<<t*7+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}readFixed64(){if(this.pos+8>this.len)throw Gn(this,8);const e=ro(this.buf,this.pos+=4),t=ro(this.buf,this.pos+=4);return new Qt(e,t)}int64(){return this.readLongVarint().toBigInt()}int64Number(){return this.readLongVarint().toNumber()}int64String(){return this.readLongVarint().toString()}uint64(){return this.readLongVarint().toBigInt(!0)}uint64Number(){const e=tE(this.buf,this.pos);return this.pos+=md(e),e}uint64String(){return this.readLongVarint().toString(!0)}sint64(){return this.readLongVarint().zzDecode().toBigInt()}sint64Number(){return this.readLongVarint().zzDecode().toNumber()}sint64String(){return this.readLongVarint().zzDecode().toString()}fixed64(){return this.readFixed64().toBigInt()}fixed64Number(){return this.readFixed64().toNumber()}fixed64String(){return this.readFixed64().toString()}sfixed64(){return this.readFixed64().toBigInt()}sfixed64Number(){return this.readFixed64().toNumber()}sfixed64String(){return this.readFixed64().toString()}}function dE(n){return new uE(n instanceof Uint8Array?n:n.subarray())}function yd(n,e,t){const i=dE(n);return e.decode(i,void 0,t)}function hE(n){let i,r=8192;return function(a){if(a<1||a>4096)return Jo(a);r+a>8192&&(i=Jo(8192),r=0);const o=i.subarray(r,r+=a);return(r&7)!==0&&(r=(r|7)+1),o}}class Ys{constructor(e,t,i){j(this,"fn");j(this,"len");j(this,"next");j(this,"val");this.fn=e,this.len=t,this.next=void 0,this.val=i}}function dc(){}class fE{constructor(e){j(this,"head");j(this,"tail");j(this,"len");j(this,"next");this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}}const pE=hE();function mE(n){return globalThis.Buffer!=null?Jo(n):pE(n)}class Au{constructor(){j(this,"len");j(this,"head");j(this,"tail");j(this,"states");this.len=0,this.head=new Ys(dc,0,0),this.tail=this.head,this.states=null}_push(e,t,i){return this.tail=this.tail.next=new Ys(e,t,i),this.len+=t,this}uint32(e){return this.len+=(this.tail=this.tail.next=new vE((e=e>>>0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this}int32(e){return e<0?this._push(so,10,Qt.fromNumber(e)):this.uint32(e)}sint32(e){return this.uint32((e<<1^e>>31)>>>0)}uint64(e){const t=Qt.fromBigInt(e);return this._push(so,t.length(),t)}uint64Number(e){return this._push(eE,md(e),e)}uint64String(e){return this.uint64(BigInt(e))}int64(e){return this.uint64(e)}int64Number(e){return this.uint64Number(e)}int64String(e){return this.uint64String(e)}sint64(e){const t=Qt.fromBigInt(e).zzEncode();return this._push(so,t.length(),t)}sint64Number(e){const t=Qt.fromNumber(e).zzEncode();return this._push(so,t.length(),t)}sint64String(e){return this.sint64(BigInt(e))}bool(e){return this._push(hc,1,e?1:0)}fixed32(e){return this._push(Fs,4,e>>>0)}sfixed32(e){return this.fixed32(e)}fixed64(e){const t=Qt.fromBigInt(e);return this._push(Fs,4,t.lo)._push(Fs,4,t.hi)}fixed64Number(e){const t=Qt.fromNumber(e);return this._push(Fs,4,t.lo)._push(Fs,4,t.hi)}fixed64String(e){return this.fixed64(BigInt(e))}sfixed64(e){return this.fixed64(e)}sfixed64Number(e){return this.fixed64Number(e)}sfixed64String(e){return this.fixed64String(e)}float(e){return this._push(nE,4,e)}double(e){return this._push(rE,8,e)}bytes(e){const t=e.length>>>0;return t===0?this._push(hc,1,0):this.uint32(t)._push(yE,t,e)}string(e){const t=lE(e);return t!==0?this.uint32(t)._push(Jm,t,e):this._push(hc,1,0)}fork(){return this.states=new fE(this),this.head=this.tail=new Ys(dc,0,0),this.len=0,this}reset(){return this.states!=null?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new Ys(dc,0,0),this.len=0),this}ldelim(){const e=this.head,t=this.tail,i=this.len;return this.reset().uint32(i),i!==0&&(this.tail.next=e.next,this.tail=t,this.len+=i),this}finish(){let e=this.head.next;const t=mE(this.len);let i=0;for(;e!=null;)e.fn(e.val,t,i),i+=e.len,e=e.next;return t}}function hc(n,e,t){e[t]=n&255}function gE(n,e,t){for(;n>127;)e[t++]=n&127|128,n>>>=7;e[t]=n}class vE extends Ys{constructor(t,i){super(gE,t,i);j(this,"next");this.next=void 0}}function so(n,e,t){for(;n.hi!==0;)e[t++]=n.lo&127|128,n.lo=(n.lo>>>7|n.hi<<25)>>>0,n.hi>>>=7;for(;n.lo>127;)e[t++]=n.lo&127|128,n.lo=n.lo>>>7;e[t++]=n.lo}function Fs(n,e,t){e[t]=n&255,e[t+1]=n>>>8&255,e[t+2]=n>>>16&255,e[t+3]=n>>>24}function yE(n,e,t){e.set(n,t)}globalThis.Buffer!=null&&(Au.prototype.bytes=function(n){const e=n.length>>>0;return this.uint32(e),e>0&&this._push(xE,e,n),this},Au.prototype.string=function(n){const e=globalThis.Buffer.byteLength(n);return this.uint32(e),e>0&&this._push(bE,e,n),this});function xE(n,e,t){e.set(n,t)}function bE(n,e,t){n.length<40?Jm(n,e,t):e.utf8Write!=null?e.utf8Write(n,t):e.set(K2(n),t)}function _E(){return new Au}function xd(n,e){const t=_E();return e.encode(n,t,{lengthDelimited:!1}),t.finish()}var Cu;(function(n){n[n.VARINT=0]="VARINT",n[n.BIT64=1]="BIT64",n[n.LENGTH_DELIMITED=2]="LENGTH_DELIMITED",n[n.START_GROUP=3]="START_GROUP",n[n.END_GROUP=4]="END_GROUP",n[n.BIT32=5]="BIT32"})(Cu||(Cu={}));function wE(n,e,t,i){return{name:n,type:e,encode:t,decode:i}}function bd(n,e){return wE("message",Cu.LENGTH_DELIMITED,n,e)}class Ru extends Error{constructor(){super(...arguments);j(this,"code","ERR_MAX_LENGTH");j(this,"name","MaxLengthError")}}var qp,Xp;(Xp=(qp=globalThis.process)==null?void 0:qp.env)!=null&&Xp.DUMP_SESSION_KEYS;var el;(function(n){let e;n.codec=()=>(e==null&&(e=bd((t,i,r={})=>{if(r.lengthDelimited!==!1&&i.fork(),t.webtransportCerthashes!=null)for(const s of t.webtransportCerthashes)i.uint32(10),i.bytes(s);if(t.streamMuxers!=null)for(const s of t.streamMuxers)i.uint32(18),i.string(s);r.lengthDelimited!==!1&&i.ldelim()},(t,i,r={})=>{var o,l;const s={webtransportCerthashes:[],streamMuxers:[]},a=i==null?t.len:t.pos+i;for(;t.pos<a;){const c=t.uint32();switch(c>>>3){case 1:{if(((o=r.limits)==null?void 0:o.webtransportCerthashes)!=null&&s.webtransportCerthashes.length===r.limits.webtransportCerthashes)throw new Ru('Decode error - map field "webtransportCerthashes" had too many elements');s.webtransportCerthashes.push(t.bytes());break}case 2:{if(((l=r.limits)==null?void 0:l.streamMuxers)!=null&&s.streamMuxers.length===r.limits.streamMuxers)throw new Ru('Decode error - map field "streamMuxers" had too many elements');s.streamMuxers.push(t.string());break}default:{t.skipType(c&7);break}}}return s})),e),n.encode=t=>xd(t,n.codec()),n.decode=(t,i)=>yd(t,n.codec(),i)})(el||(el={}));var wf;(function(n){let e;n.codec=()=>(e==null&&(e=bd((t,i,r={})=>{r.lengthDelimited!==!1&&i.fork(),t.identityKey!=null&&t.identityKey.byteLength>0&&(i.uint32(10),i.bytes(t.identityKey)),t.identitySig!=null&&t.identitySig.byteLength>0&&(i.uint32(18),i.bytes(t.identitySig)),t.extensions!=null&&(i.uint32(34),el.codec().encode(t.extensions,i)),r.lengthDelimited!==!1&&i.ldelim()},(t,i,r={})=>{var o;const s={identityKey:Tu(0),identitySig:Tu(0)},a=i==null?t.len:t.pos+i;for(;t.pos<a;){const l=t.uint32();switch(l>>>3){case 1:{s.identityKey=t.bytes();break}case 2:{s.identitySig=t.bytes();break}case 4:{s.extensions=el.codec().decode(t,t.uint32(),{limits:(o=r.limits)==null?void 0:o.extensions});break}default:{t.skipType(l&7);break}}}return s})),e),n.encode=t=>xd(t,n.codec()),n.decode=(t,i)=>yd(t,n.codec(),i)})(wf||(wf={}));var Sf;(function(n){let e;n.codec=()=>(e==null&&(e=bd((t,i,r={})=>{if(r.lengthDelimited!==!1&&i.fork(),t.publicKey!=null&&t.publicKey.byteLength>0&&(i.uint32(10),i.bytes(t.publicKey)),t.addrs!=null)for(const s of t.addrs)i.uint32(18),i.bytes(s);r.lengthDelimited!==!1&&i.ldelim()},(t,i,r={})=>{var o;const s={publicKey:Tu(0),addrs:[]},a=i==null?t.len:t.pos+i;for(;t.pos<a;){const l=t.uint32();switch(l>>>3){case 1:{s.publicKey=t.bytes();break}case 2:{if(((o=r.limits)==null?void 0:o.addrs)!=null&&s.addrs.length===r.limits.addrs)throw new Ru('Decode error - map field "addrs" had too many elements');s.addrs.push(t.bytes());break}default:{t.skipType(l&7);break}}}return s})),e),n.encode=t=>xd(t,n.codec()),n.decode=(t,i)=>yd(t,n.codec(),i)})(Sf||(Sf={}));new TextEncoder;new TextDecoder("utf-8",{fatal:!0});new TextEncoder;new TextDecoder;function SE(n,e){if(n===e)return!0;if(n.byteLength!==e.byteLength)return!1;for(let t=0;t<n.byteLength;t++)if(n[t]!==e[t])return!1;return!0}function _d(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return pa(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return pa(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function ME(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function pa(n){return ME(n)?n:n.slice()}function EE(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var d=n.length,h=n.charAt(0),f=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function g(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,b=0,v=0,M=u.length;v!==M&&u[v]===0;)v++,y++;for(var S=(M-v)*p+1>>>0,E=new Uint8Array(S);v!==M;){for(var A=u[v],w=0,_=S-1;(A!==0||w<b)&&_!==-1;_--,w++)A+=256*E[_]>>>0,E[_]=A%d>>>0,A=A/d>>>0;if(A!==0)throw new Error("Non-zero carry");b=w,v++}for(var R=S-b;R!==S&&E[R]===0;)R++;for(var U=h.repeat(y);R<S;++R)U+=n.charAt(E[R]);return U}function x(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var b=0,v=0;u[y]===h;)b++,y++;for(var M=(u.length-y)*f+1>>>0,S=new Uint8Array(M);u[y];){var E=i[u.charCodeAt(y)];if(E===255)return;for(var A=0,w=M-1;(E!==0||A<v)&&w!==-1;w--,A++)E+=d*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");v=A,y++}if(u[y]!==" "){for(var _=M-v;_!==M&&S[_]===0;)_++;for(var R=new Uint8Array(b+(M-_)),U=b;_!==M;)R[U++]=S[_++];return R}}}function m(u){var y=x(u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:x,decode:m}}var TE=EE,AE=TE;let CE=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}},RE=class{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return e0(this,e)}},PE=class{constructor(e){j(this,"decoders");this.decoders=e}or(e){return e0(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}};function e0(n,e){return new PE({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}let DE=class{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new CE(e,t,i),this.decoder=new RE(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}};function t0({name:n,prefix:e,encode:t,decode:i}){return new DE(n,e,t,i)}function bl({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=AE(t,n,i);return t0({prefix:e,name:n,encode:r,decode:a=>_d(s(a))})}function IE(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const d=e[n[c]];if(d===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|d,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function LE(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function UE(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function Mi({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=UE(i,r);return t0({prefix:e,name:n,encode(a){return LE(a,i,t)},decode(a){return IE(a,s,t,n)}})}const Eo=Mi({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});Mi({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});const fc=bl({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});bl({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});const Ni=bl({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});bl({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});var NE=n0,Mf=128,FE=-128,BE=Math.pow(2,31);function n0(n,e,t){e=e||[],t=t||0;for(var i=t;n>=BE;)e[t++]=n&255|Mf,n/=128;for(;n&FE;)e[t++]=n&255|Mf,n>>>=7;return e[t]=n|0,n0.bytes=t-i+1,e}var OE=Pu,zE=128,Ef=127;function Pu(n,i){var t=0,i=i||0,r=0,s=i,a,o=n.length;do{if(s>=o)throw Pu.bytes=0,new RangeError("Could not decode varint");a=n[s++],t+=r<28?(a&Ef)<<r:(a&Ef)*Math.pow(2,r),r+=7}while(a>=zE);return Pu.bytes=s-i,t}var kE=Math.pow(2,7),GE=Math.pow(2,14),VE=Math.pow(2,21),HE=Math.pow(2,28),WE=Math.pow(2,35),qE=Math.pow(2,42),XE=Math.pow(2,49),$E=Math.pow(2,56),YE=Math.pow(2,63),jE=function(n){return n<kE?1:n<GE?2:n<VE?3:n<HE?4:n<WE?5:n<qE?6:n<XE?7:n<$E?8:n<YE?9:10},KE={encode:NE,decode:OE,encodingLength:jE},tl=KE;function Du(n,e=0){const t=tl.decode(n,e),i=tl.decode.bytes;if(i>9)throw new RangeError("Invalid varint: too long");if(i>1&&n[e+i-1]===0)throw new RangeError("Invalid varint: not minimally encoded");return[t,i]}function nl(n,e,t=0){return tl.encode(n,e,t),e}function il(n){return tl.encodingLength(n)}function QE(n,e){const t=e.byteLength,i=il(n),r=i+il(t),s=new Uint8Array(r+t);return nl(n,s,0),nl(t,s,i),s.set(e,r),new wd(n,t,e,s)}function ZE(n){const e=_d(n),[t,i]=Du(e),[r,s]=Du(e.subarray(i)),a=e.subarray(i+s);if(a.byteLength!==r)throw new Error("Incorrect length");return new wd(t,r,a,e)}function JE(n,e){if(n===e)return!0;{const t=e;return n.code===t.code&&n.size===t.size&&t.bytes instanceof Uint8Array&&SE(n.bytes,t.bytes)}}class wd{constructor(e,t,i,r){j(this,"code");j(this,"size");j(this,"digest");j(this,"bytes");this.code=e,this.size=t,this.digest=pa(i),this.bytes=pa(r)}}function Tf(n,e){const{bytes:t,version:i}=n;switch(i){case 0:return t3(t,Iu(n),e??Ni.encoder);default:return n3(t,Iu(n),e??Eo.encoder)}}const Af=new WeakMap;function Iu(n){const e=Af.get(n);if(e==null){const t=new Map;return Af.set(n,t),t}return e}var $p;class kt{constructor(e,t,i,r){j(this,"code");j(this,"version");j(this,"multihash");j(this,"bytes");j(this,"/");j(this,$p,"CID");this.code=t,this.version=e,this.multihash=i,this.bytes=pa(r),this["/"]=this.bytes}get asCID(){return this}get byteOffset(){return this.bytes.byteOffset}get byteLength(){return this.bytes.byteLength}toV0(){switch(this.version){case 0:return this;case 1:{const{code:e,multihash:t}=this;if(e!==Bs)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==i3)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return kt.createV0(t)}default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,i=QE(e,t);return kt.createV1(this.code,i)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`)}}equals(e){return kt.equals(this,e)}static equals(e,t){const i=t;return i!=null&&e.code===i.code&&e.version===i.version&&JE(e.multihash,i.multihash)}toString(e){return Tf(this,e)}toJSON(){return{"/":Tf(this)}}link(){return this}[($p=Symbol.toStringTag,Symbol.for("nodejs.util.inspect.custom"))](){return`CID(${this.toString()})`}static asCID(e){if(e==null)return null;const t=e;if(t instanceof kt)return t;if(t["/"]!=null&&t["/"]===t.bytes||t.asCID===t){const{version:i,code:r,multihash:s,bytes:a}=t;return new kt(i,r,s,a??Cf(i,r,s.bytes))}else if(t[r3]===!0){const{version:i,multihash:r,code:s}=t,a=ZE(r);return kt.create(i,s,a)}else return null}static create(e,t,i){if(typeof t!="number")throw new Error("String codecs are no longer supported");if(!(i.bytes instanceof Uint8Array))throw new Error("Invalid digest");switch(e){case 0:{if(t!==Bs)throw new Error(`Version 0 CID must use dag-pb (code: ${Bs}) block encoding`);return new kt(e,t,i,i.bytes)}case 1:{const r=Cf(e,t,i.bytes);return new kt(e,t,i,r)}default:throw new Error("Invalid version")}}static createV0(e){return kt.create(0,Bs,e)}static createV1(e,t){return kt.create(1,e,t)}static decode(e){const[t,i]=kt.decodeFirst(e);if(i.length!==0)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=kt.inspectBytes(e),i=t.size-t.multihashSize,r=_d(e.subarray(i,i+t.multihashSize));if(r.byteLength!==t.multihashSize)throw new Error("Incorrect length");const s=r.subarray(t.multihashSize-t.digestSize),a=new wd(t.multihashCode,t.digestSize,s,r);return[t.version===0?kt.createV0(a):kt.createV1(t.codec,a),e.subarray(t.size)]}static inspectBytes(e){let t=0;const i=()=>{const[h,f]=Du(e.subarray(t));return t+=f,h};let r=i(),s=Bs;if(r===18?(r=0,t=0):s=i(),r!==0&&r!==1)throw new RangeError(`Invalid CID version ${r}`);const a=t,o=i(),l=i(),c=t+l,d=c-a;return{version:r,codec:s,multihashCode:o,digestSize:l,multihashSize:d,size:c}}static parse(e,t){const[i,r]=e3(e,t),s=kt.decode(r);if(s.version===0&&e[0]!=="Q")throw Error("Version 0 CID string must not include multibase prefix");return Iu(s).set(i,e),s}}function e3(n,e){switch(n[0]){case"Q":{const t=e??Ni;return[Ni.prefix,t.decode(`${Ni.prefix}${n}`)]}case Ni.prefix:{const t=e??Ni;return[Ni.prefix,t.decode(n)]}case Eo.prefix:{const t=e??Eo;return[Eo.prefix,t.decode(n)]}case fc.prefix:{const t=e??fc;return[fc.prefix,t.decode(n)]}default:{if(e==null)throw Error("To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided");return[n[0],e.decode(n)]}}}function t3(n,e,t){const{prefix:i}=t;if(i!==Ni.prefix)throw Error(`Cannot string encode V0 in ${t.name} encoding`);const r=e.get(i);if(r==null){const s=t.encode(n).slice(1);return e.set(i,s),s}else return r}function n3(n,e,t){const{prefix:i}=t,r=e.get(i);if(r==null){const s=t.encode(n);return e.set(i,s),s}else return r}const Bs=112,i3=18;function Cf(n,e,t){const i=il(n),r=i+il(e),s=new Uint8Array(r+t.byteLength);return nl(n,s,0),nl(e,s,i),s.set(t,r),s}const r3=Symbol.for("@ipld/js-cid/CID");function s3(n){if(n instanceof Uint8Array&&n.constructor.name==="Uint8Array")return Rf(n);if(n instanceof ArrayBuffer)return new Uint8Array(n);if(ArrayBuffer.isView(n))return Rf(new Uint8Array(n.buffer,n.byteOffset,n.byteLength));throw new Error("Unknown type, must be binary type")}function a3(n){return(n==null?void 0:n.buffer)instanceof ArrayBuffer}function Rf(n){return a3(n)?n:n.slice()}function o3(n,e,t){if(n.length>=255)throw new TypeError("Alphabet too long");for(var i=new Uint8Array(256),r=0;r<i.length;r++)i[r]=255;for(var s=0;s<n.length;s++){var a=n.charAt(s),o=a.charCodeAt(0);if(i[o]!==255)throw new TypeError(a+" is ambiguous");if(i[o]=s,t){var l=a.toLowerCase().charCodeAt(0),c=a.toUpperCase().charCodeAt(0);l!==o&&(i[l]=s),c!==o&&(i[c]=s)}}var d=n.length,h=n.charAt(0),f=Math.log(d)/Math.log(256),p=Math.log(256)/Math.log(d);function g(u){if(u instanceof Uint8Array||(ArrayBuffer.isView(u)?u=new Uint8Array(u.buffer,u.byteOffset,u.byteLength):Array.isArray(u)&&(u=Uint8Array.from(u))),!(u instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(u.length===0)return"";for(var y=0,b=0,v=0,M=u.length;v!==M&&u[v]===0;)v++,y++;for(var S=(M-v)*p+1>>>0,E=new Uint8Array(S);v!==M;){for(var A=u[v],w=0,_=S-1;(A!==0||w<b)&&_!==-1;_--,w++)A+=256*E[_]>>>0,E[_]=A%d>>>0,A=A/d>>>0;if(A!==0)throw new Error("Non-zero carry");b=w,v++}for(var R=S-b;R!==S&&E[R]===0;)R++;for(var U=h.repeat(y);R<S;++R)U+=n.charAt(E[R]);return U}function x(u){if(typeof u!="string")throw new TypeError("Expected String");if(u.length===0)return new Uint8Array;var y=0;if(u[y]!==" "){for(var b=0,v=0;u[y]===h;)b++,y++;for(var M=(u.length-y)*f+1>>>0,S=new Uint8Array(M);u[y];){var E=i[u.charCodeAt(y)];if(E===255)return;for(var A=0,w=M-1;(E!==0||A<v)&&w!==-1;w--,A++)E+=d*S[w]>>>0,S[w]=E%256>>>0,E=E/256>>>0;if(E!==0)throw new Error("Non-zero carry");v=A,y++}if(u[y]!==" "){for(var _=M-v;_!==M&&S[_]===0;)_++;for(var R=new Uint8Array(b+(M-_)),U=b;_!==M;)R[U++]=S[_++];return R}}}function m(u){var y=x(u);if(y)return y;throw new Error(`Non-${e} character`)}return{encode:g,decodeUnsafe:x,decode:m}}var l3=o3,c3=l3;class u3{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseEncode");this.name=e,this.prefix=t,this.baseEncode=i}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class d3{constructor(e,t,i){j(this,"name");j(this,"prefix");j(this,"baseDecode");j(this,"prefixCodePoint");this.name=e,this.prefix=t;const r=t.codePointAt(0);if(r===void 0)throw new Error("Invalid prefix character");this.prefixCodePoint=r,this.baseDecode=i}decode(e){if(typeof e=="string"){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}else throw Error("Can only multibase decode strings")}or(e){return i0(this,e)}}class h3{constructor(e){j(this,"decoders");this.decoders=e}or(e){return i0(this,e)}decode(e){const t=e[0],i=this.decoders[t];if(i!=null)return i.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}function i0(n,e){return new h3({...n.decoders??{[n.prefix]:n},...e.decoders??{[e.prefix]:e}})}class f3{constructor(e,t,i,r){j(this,"name");j(this,"prefix");j(this,"baseEncode");j(this,"baseDecode");j(this,"encoder");j(this,"decoder");this.name=e,this.prefix=t,this.baseEncode=i,this.baseDecode=r,this.encoder=new u3(e,t,i),this.decoder=new d3(e,t,r)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}function r0({name:n,prefix:e,encode:t,decode:i}){return new f3(n,e,t,i)}function _l({name:n,prefix:e,alphabet:t,caseInsensitive:i=!1}){const{encode:r,decode:s}=c3(t,n,i);return r0({prefix:e,name:n,encode:r,decode:a=>s3(s(a))})}function p3(n,e,t,i){let r=n.length;for(;n[r-1]==="=";)--r;const s=new Uint8Array(r*t/8|0);let a=0,o=0,l=0;for(let c=0;c<r;++c){const d=e[n[c]];if(d===void 0)throw new SyntaxError(`Non-${i} character`);o=o<<t|d,a+=t,a>=8&&(a-=8,s[l++]=255&o>>a)}if(a>=t||(255&o<<8-a)!==0)throw new SyntaxError("Unexpected end of data");return s}function m3(n,e,t){const i=e[e.length-1]==="=",r=(1<<t)-1;let s="",a=0,o=0;for(let l=0;l<n.length;++l)for(o=o<<8|n[l],a+=8;a>t;)a-=t,s+=e[r&o>>a];if(a!==0&&(s+=e[r&o<<t-a]),i)for(;(s.length*t&7)!==0;)s+="=";return s}function g3(n,e){const t={};for(let i=0;i<n.length;++i)if(t[n[i]]=i,e){const r=n[i].toLowerCase(),s=n[i].toUpperCase();r!==n[i]&&(t[r]=i),s!==n[i]&&(t[s]=i)}return t}function Ei({name:n,prefix:e,bitsPerChar:t,alphabet:i,caseInsensitive:r=!1}){const s=g3(i,r);return r0({prefix:e,name:n,encode(a){return m3(a,i,t)},decode(a){return p3(a,s,t,n)}})}Ei({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5,caseInsensitive:!0});Ei({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5});_l({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz",caseInsensitive:!0});_l({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",caseInsensitive:!0});_l({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"});_l({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"});new TextDecoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextEncoder;new TextDecoder;new TextEncoder;new TextDecoder;new TextEncoder;new TextDecoder;const v3="peercompute.gpu.resident-stage-executor.v0",y3="peercompute.gpu.resident-stage-worker-policy.v0";function Hn(n,e=null){return String(n??"").trim()||e}function pc(n){return n==null?null:JSON.parse(JSON.stringify(n))}function Pf(n,e=!1){return typeof n=="boolean"?n:e}function x3(n,e=null){const t=Math.floor(Number(n));return Number.isFinite(t)&&t>=0?t:e}function b3(n={},e=null){const t=n&&typeof n=="object"?n:{},i=Hn(t.mode??t.residencyMode,null),r=!!(t.worker||t.workerReady||t.workerModuleUrl||t.workerType),s=i||(r?"dedicated-worker":"inline"),a=Pf(t.workerReady,!1)||!!t.worker,o=s==="dedicated-worker"||s==="webgpu-worker"||s==="gpu-compute-worker",l=o?"dedicated-worker":"inline",c=o?a?"worker-ready":"blocked-worker-backend-missing":"inline-ready";return{schema:y3,stageId:e,mode:l,status:c,workerType:Hn(t.workerType,o?"webgpu-compute-worker":null),workerModuleUrl:Hn(t.workerModuleUrl??t.moduleUrl,null),startupMode:Hn(t.startupMode,o?"warm-on-first-use":"inline"),idleTtlMs:x3(t.idleTtlMs,o?6e4:null),sameDeviceRequired:Pf(t.sameDeviceRequired,o),bufferTransferPolicy:Hn(t.bufferTransferPolicy,o?"worker-owns-device-and-retained-buffers-required":"main-thread-gpuhub-inline"),fallbackRuntimeTarget:c==="blocked-worker-backend-missing"?"gpu-hub-inline-stage-executor":null,authority:"compute-manager-gpuhub-resident-stage-worker-policy"}}async function _3(n,e){if(typeof n=="function")return n(e);if(n&&typeof n.runStage=="function")return n.runStage(e);throw new Error("[GPUHubManager] Resident stage worker backend must be a function or expose runStage()")}class w3{constructor(e={}){this.frameBudgetMs=e.frameBudgetMs??4,this.hotStore=e.hotStore||new Map,this.device=null,this.tasks=new Map,this.residentStageExecutors=new Map,this.residentStageExecutorAliases=new Map}async initialize(e={}){if(e.device)return this.device=e.device,this.device;if(typeof navigator>"u"||!navigator.gpu)throw new Error("[GPUHubManager] WebGPU not available in this environment");const t=await navigator.gpu.requestAdapter(e.adapterOptions);if(!t)throw new Error("[GPUHubManager] Failed to acquire GPU adapter");return this.device=await t.requestDevice(e.deviceDescriptor),this.device}setDevice(e){this.device=e}getHotStore(){return this.hotStore}registerHotBuffer(e,t){this.hotStore.set(e,t)}registerHotBufferSet(e,t){this.hotStore.set(e,t)}getHotBufferSet(e){return this.hotStore.get(e)}getHotBuffer(e){return this.hotStore.get(e)}createHotBuffer(e,t,i,r){if(!this.device)throw new Error("[GPUHubManager] Device not initialized");const s=this.device.createBuffer({size:t,usage:i,label:r});return this.hotStore.set(e,s),s}removeHotBuffer(e){this.hotStore.delete(e)}registerResidentStageExecutor(e,t=null){var l;const i=typeof e=="string"?{stageId:e,executor:t}:{...e||{}},r=Hn(i.stageId??i.id,null);if(!r)throw new Error("[GPUHubManager] Resident stage executor requires a stageId");const s=i.executor||t,a=i.workerRunner||i.workerBackend||((l=i.workerPolicy)==null?void 0:l.workerRunner)||null;if(typeof s!="function"&&!a)throw new Error(`[GPUHubManager] Resident stage executor must be a function: ${r}`);const o={schema:v3,stageId:r,lawNodeId:Hn(i.lawNodeId,null),runtimeTarget:Hn(i.runtimeTarget,a?"gpu-hub-resident-stage-worker":"gpu-hub-inline-stage-executor"),executor:typeof s=="function"?s:null,workerRunner:a,workerPolicy:b3({...i.workerPolicy||i.workerResidency||{},workerReady:(i.workerPolicy||i.workerResidency||{}).workerReady||!!a},r),metadata:pc(i.metadata||{}),registeredAt:Date.now()};return this.residentStageExecutors.set(r,o),o.lawNodeId&&this.residentStageExecutorAliases.set(o.lawNodeId,r),this.describeResidentStageExecutor(r)}describeResidentStageExecutor(e){const t=this.getResidentStageExecutorRecord(e);return t?{schema:t.schema,stageId:t.stageId,lawNodeId:t.lawNodeId,runtimeTarget:t.runtimeTarget,workerPolicy:pc(t.workerPolicy),metadata:pc(t.metadata||{}),registeredAt:t.registeredAt}:null}getResidentStageExecutorRecord(e){const t=Hn(typeof e=="string"?e:(e==null?void 0:e.id)??(e==null?void 0:e.stageId),null),i=Hn(typeof e=="string"?null:e==null?void 0:e.lawNodeId,null);if(t&&this.residentStageExecutors.has(t))return this.residentStageExecutors.get(t);const r=i?this.residentStageExecutorAliases.get(i):null;return r?this.residentStageExecutors.get(r):null}hasResidentStageExecutor(e){return!!this.getResidentStageExecutorRecord(e)}listResidentStageExecutors(){return[...this.residentStageExecutors.keys()].sort().map(e=>this.describeResidentStageExecutor(e))}async executeResidentStage(e={}){var r,s;const t=this.getResidentStageExecutorRecord(e.stage);if(!t){const a=Hn(((r=e.stage)==null?void 0:r.id)??((s=e.stage)==null?void 0:s.stageId),"unknown"),o=new Error(`[GPUHubManager] Missing resident stage executor: ${a}`);throw o.code="ERR_GPU_HUB_RESIDENT_STAGE_EXECUTOR_MISSING",o.stage=e.stage||null,o}const i={...e,gpuHub:this,device:this.device,executor:this.describeResidentStageExecutor(t.stageId)};return t.workerRunner?_3(t.workerRunner,i):t.executor(i)}registerTask(e,t){this.tasks.set(e,t)}unregisterTask(e){this.tasks.delete(e)}tick(){}}const Os="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",zs="5ce3fd841676adf2c1a10d7193637d46007e88f7",Df=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],S3="This catalog supports verified storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function s0(n){for(const e of Object.values(n))e&&typeof e=="object"&&s0(e);return Object.freeze(n)}const M3=s0({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Os,revision:zs,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:S3},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Os}/blob/${zs}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Os,revision:zs,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Os}/blob/${zs}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Os,revision:zs},weightBytes:14199740480,totalBytes:Df.reduce((n,e)=>n+e.size,0),files:Df}});function a0(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(a0),Object.freeze(n)),n}const E3=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental text)",repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",dtype:"q5_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-Q5_K_M.gguf",size:6467969824,sha256:"bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README.md",size:4013,sha256:"825f21663874cbfa09dbb791849ff9c7f233a043317f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7274149e70cfd0dc7940d87",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwen3.5 9B Claude HighIQ Thinking Heretic (DavidAU via mradermacher Q4_K_M, text)",repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"heretic",notice:"Publisher-described heretic fine-tune; not a guarantee of refusal-free output or factual accuracy. This is mradermacher's GGUF conversion of the requested DavidAU source. The browser adapter currently runs text only."},files:[{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf",size:5627045888,sha256:"b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"README.md",size:5730,sha256:"eea5e514740c521432aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e17cf35bea52a3a2d74e42b14a24a",source:{repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",path:"README.md"}},{path:"SOURCE_README.md",size:79602,sha256:"0afc6c4508d99e8966cfd6164d6a3ea924c6781c97319223170c5c2f0abdef76",gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",source:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-9B",revision:"c202236235762e1c871ad0ccb60c8ee5ba337b9a",path:"LICENSE"}}]},{id:"qwen3.5-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q8_0, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q8_0",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,sha256:"e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-evil-mradermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q4_K_M, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q4_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf",size:5780091392,sha256:"cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],T3=a0(Object.fromEntries(E3.map(n=>{const{dtype:e,sourceModel:t,blockCount:i,nextnPredictLayers:r,...s}=n,o=s.files.find(l=>l.path==="LICENSE").source;return[s.id,{...s,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. These exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/"+o.repository+"/blob/"+o.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and available modification notices are included."},provenance:{repository:s.repository,revision:s.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/"+s.repository+"/blob/"+s.revision+"/README.md",sourceModel:{...t,revisionPurpose:"Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:i,nextnPredictLayers:r,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only package omits the optional projector and the current managed GGUF adapter rejects images.",behavior:s.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:e,modalities:["text"],requiredFeatures:["shader-f16"],repository:s.repository,revision:s.revision},weightBytes:s.files[0].size,totalBytes:s.files.reduce((l,c)=>l+c.size,0)}]})));function Sd(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Sd),Object.freeze(n)),n}const fi="Tsotchke-Corporation",o0=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${fi}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",architecture:"qwen3_moe",quantizationTypes:["F32","Q8_0","Q4_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3-Coder-30B-A3B-Instruct-abliterated",revision:"b84c58d52ac44041774fe9542e1943e4d971b5f4"},publisherLimitations:"Experimental lossy mixed quantization of an abliterated parent. Behavioral quality, SAE certification and runtime qualification are untested.",files:[{path:".gitattributes",size:1609,gitBlobSha1:"3a433079d93d83ef24990f9ca0b33672cbcc8edd"},{path:"LICENSE",size:11343,gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab"},{path:"NOTICE",size:574,gitBlobSha1:"687c4673ece140e83416522e0d00b53880e8bb13"},{path:"Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-MIXED-Q4_K.gguf",size:18587950144,sha256:"2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51"},{path:"README.md",size:2765,gitBlobSha1:"00227290350d0484631d06756736f4dff2e8bd66"},{path:"artifact-manifest.json",size:7659,gitBlobSha1:"87e9f2092c05a30a4c2840073729aa952e6e5d05"},{path:"chat_template.jinja",size:6853,gitBlobSha1:"3656cd64ff2fcc6ae59312eb87a709e0aa25b2eb"},{path:"config.json",size:1065,gitBlobSha1:"5288c67c42b574d39f790e6bf8836f57ec477483"},{path:"generation_config.json",size:235,gitBlobSha1:"f1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee"},{path:"tokenizer_config.json",size:5644,gitBlobSha1:"b2cbe86ae45a1274c9b93ec060466ea8a4665c9b"},{path:"verify_artifact.py",size:1403,gitBlobSha1:"57027eb456280780650ef6bc44524b396734cbcf"}]},{id:"qwen3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${fi}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac671898b95",architecture:"qwen3_5_moe",quantizationTypes:["F32","Q8_0","Q5_K","IQ4_XS","Q6_K"],sourceModel:{repository:"ericpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-bf16",revision:"f6ab91b5bdc2a7e7e1a1e2263c98a409509c79ed"},publisherLimitations:"The publisher records a failed coding-quality gate and no complete capability certificate. Its internal qLLM Metal gguf-c20 runtime is not a public portable-runtime qualification; a public pinned clean-machine recipe remains unverified. This is not the GeoRefine TBE codec.",files:[{path:".gitattributes",size:1699,gitBlobSha1:"f44e4e63e69c8b9a20797fd820049ea27bcf95fc"},{path:"C20-MANIFEST.json",size:2392163,gitBlobSha1:"3cb693fce32249c21d7a621060df41dbf5df64a9"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:465,gitBlobSha1:"4852a35fe237eb4335504e78cd61cdb15834c02f"},{path:"Qwen3.6-35B-A3B-GeoRefine-C20-MIXED-IQ4_XS.gguf",size:19998783936,sha256:"027f3c99a065fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce911c96"},{path:"README.md",size:4914,gitBlobSha1:"601a361b4a8308e9121749810fb103b644c581c1"},{path:"artifact-manifest.json",size:2726,gitBlobSha1:"2706dafb0ea785ed8df0eae767a008315f8a1a9f"},{path:"config.json",size:3148,gitBlobSha1:"09981f690fa954e74c4ae3d66163bb68435d14ca"},{path:"generation_config.json",size:243,gitBlobSha1:"be05abc6b17ea7880b71c67d31f7264f92c34fc0"},{path:"special_tokens_map.json",size:437,gitBlobSha1:"1838f3b7f5e64b0f32abbd98181ea3ca8b3abfbc"},{path:"tokenizer.json",size:19991323,sha256:"adfe67f1d28892e2c9dc17110ceac44bab368d488499115adfea19ff992d9ac7"},{path:"tokenizer_config.json",size:15148,gitBlobSha1:"ab21e994b5ad9d2e9777ebe294b4fc98dd7fc6ec"},{path:"verify_c20.py",size:886,gitBlobSha1:"2ba7e98dd936d250bff3e3f2a38cae09c81dae86"}]},{id:"qwen3.8-27b-georefine-l162-gguf",name:"Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${fi}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd3e198e56a4c6da",architecture:"qwen3_5",quantizationTypes:["F32","Q4_K","Q8_0","Q5_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3.8-27B-abliterated",revision:"739e3c5b89849f6c238ce1e5b70008612ae42cdd"},publisherLimitations:"Experimental lossy mixed quantization; behavioral quality and runtime qualification are untested. Q4_K_M_CUSTOM labels a custom allocation of standard GGUF tensor types, not a custom codec or the standard llama.cpp Q4_K_M allocation recipe. The inherited Q8_0 header label does not describe the tensor mix.",files:[{path:".gitattributes",size:1694,gitBlobSha1:"f41c1739e40b19b0a39816d1819e9e1d82245e5e"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:515,gitBlobSha1:"f153f97bba2134be8cd813690301cb2b5cd997b8"},{path:"Qwen3.8-27B-GeoRefine-L162-abl-MIXED-Q4_K_M_CUSTOM.gguf",size:16249419840,sha256:"191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd"},{path:"README.md",size:3913,gitBlobSha1:"5fd10161fbf27f1436861018bb15946d31ab4d8b"},{path:"artifact-manifest.json",size:5897,gitBlobSha1:"fff04f79d87dc6253f0f3908dddf67c0ab66a8fd"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}]}],A3=Sd(Object.fromEntries(o0.map(n=>{const{architecture:e,quantizationTypes:t,sourceModel:i,publisherLimitations:r,...s}=n;return[n.id,{...s,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; current file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${n.repository}/blob/${n.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},provenance:{repository:n.repository,revision:n.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https://huggingface.co/${n.repository}/blob/${n.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:i,publisherLimitations:r,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not establish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:e,format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:t,modalities:["text"],requiredFeatures:["shader-f16"],repository:n.repository,revision:n.revision},weightBytes:n.files.filter(a=>a.path.endsWith(".gguf")).reduce((a,o)=>a+o.size,0),totalBytes:n.files.reduce((a,o)=>a+o.size,0)}]})));Sd({organization:fi,sourceUrl:`https://huggingface.co/${fi}`,checkedAt:"2026-11-04",repositories:[...o0.map(({id:n,repository:e,revision:t})=>({repository:e,revision:t,catalogId:n,format:"GGUF",codecRequired:!1})),{repository:`${fi}/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefine-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${fi}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX tensors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${fi}/Qwen3.8-27B-GeoRefine-Context-abliterated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},{repository:`${fi}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or full BF16 export."}]});const To="BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF",Ao="036d46331b5ef633654ff516e73973e81c8eca79",If="mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf",Lf=`https://huggingface.co/${To}/blob/${Ao}/README.md`,mc=[{path:"MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf",size:5629105280,sha256:"8798617e1da0b324a7d4c04659c59bb8f712dd5a7332b4703a5a2875d977ecf2"},{path:"README.md",size:7258,sha256:"ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028c9b6991e8b74cdd7a",gitBlobSha1:"1b0eb905e11ce299d5402e7b75fece713a63682b"}];function l0(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(l0),Object.freeze(n)),n}const C3=l0({[If]:{id:If,name:"MiMo V2.6 Distill Qwen 9B Abliterated (GGUF Q4_K_M, text)",repository:To,revision:Ao,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission are still required."},behavior:{kind:"abliterated",notice:"Publisher-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"MIT",sourceUrl:Lf,notice:"The publisher declares MIT in the included model card. Neither this conversion nor its linked parent supplies a separate LICENSE file at the checked revisions."},provenance:{repository:To,revision:Ao,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:Lf,sourceModel:{repository:"XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",revision:"1f09ddcc1a0ea45751ae0dfe2af20d533168c46f",revisionPurpose:"Pinned parent metadata reference; not a verified conversion input revision.",conversionInputRevisionVerified:!1},vision:"Text-only package. The publisher does not claim vision for these GGUF files; no projector is included.",publisherEvaluation:"The model card reports completed evaluations for Q8_0 only; Q4_K_M is listed as built but untested.",userReportedExecution:{checkedAt:"2026-11-10",application:"PeerCompute",result:"working",evidence:"User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not supplied.",independentlyReproduced:!1}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:To,revision:Ao},weightBytes:mc[0].size,totalBytes:mc.reduce((n,e)=>n+e.size,0),files:mc}}),Co="TrevorJS/gemma-4-12B-it-uncensored-GGUF",Ro="d878d412b001a720b9a62eaac432d00aac9d1b4f",Uf="gemma4-12b-uncensored-q4-k-m-gguf",R3=`https://huggingface.co/${Co}/blob/${Ro}/README.md`,Nf="TrevorJS/gemma-4-12B-it-uncensored",Ff="159eb7a8a04efb31ed43887e4732ff3edccff8ac",gc=[{path:"gemma-4-12B-it-uncensored-Q4_K_M.gguf",size:7381382208,sha256:"6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494"},{path:"README.md",size:1629,sha256:"aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41",gitBlobSha1:"b0817c994d69e95961e18b9a380366eb9ed3d6ee"}];function c0(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(c0),Object.freeze(n)),n}const u0=c0({[Uf]:{id:Uf,name:"Gemma 4 12B Uncensored (GGUF Q4_K_M, text)",repository:Co,revision:Ro,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"User reported successful PeerCompute text inference on 2026-11-10; this exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires shader-f16, isolation, shared WASM memory64/JSPI and device memory admission."},behavior:{kind:"abliterated",notice:"Publisher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:"https://ai.google.dev/gemma/apache_2",notice:"Google and both publisher cards declare Apache-2.0. The conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENSE file."},provenance:{repository:Co,revision:Ro,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:R3,sourceModel:{repository:Nf,revision:Ff,modelCardUrl:`https://huggingface.co/${Nf}/blob/${Ff}/README.md`,modelCardBytes:4929,modelCardSha256:"d2994dbe94e6a1c3fce070b0b6efc5fe8e9aa4a7803b41f29c1479713bad352b",revisionPurpose:"Pinned source metadata reference; not a verified conversion input revision.",conversionInputRevisionVerified:!1},upstreamModel:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",revisionPurpose:"Pinned upstream metadata and license reference.",architecture:"Gemma4UnifiedForConditionalGeneration",modalities:["text","image","audio"]},vision:"The upstream model is multimodal; this is a text-only GGUF package without a vision or audio projector. Upstream capabilities do not establish browser support.",publisherEvaluation:"The source card reports native llama.cpp Q8 testing; it does not establish Q4_K_M browser execution.",runtimeRequirement:"Gemma4Unified support from llama.cpp PR #24118 (2026-06-04 or later), including the gemma4 tokenizer.",ggufHeader:{version:3,architecture:"gemma4",tokenizer:"gemma4",blockCount:48,tensorCount:667,contextLength:262144,completeHeaderBytes:15822379,tensorTypes:["F32","Q4_K","Q6_K"]}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"gemma4",format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:Co,revision:Ro},weightBytes:gc[0].size,totalBytes:gc.reduce((n,e)=>n+e.size,0),files:gc}});function d0(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(d0),Object.freeze(n)),n}const Lu=d0({id:"gemma4-unified-trevor-159eb7a8-f16-v1",converterRevision:"46ca246de9bb1c35269722a6240d37d9dfd79cad",source:{repository:"TrevorJS/gemma-4-12B-it-uncensored",revision:"159eb7a8a04efb31ed43887e4732ff3edccff8ac",url:"https://huggingface.co/TrevorJS/gemma-4-12B-it-uncensored/resolve/159eb7a8a04efb31ed43887e4732ff3edccff8ac/model.safetensors",size:23919549408,publisherSha256:"dd7fcab67274aea3adaf0f29fb6bc120b504f8b1a597124f03c15259e20c6f84"},sourceTensorBytes:104759808,size:122030944,sha256:"ee1fed84b7d15ffc4d13c44b59fff59e50fe89f36adcc5ec4900c83efd0edc27",headerHex:"47475546030000000b000000000000001b00000000000000140000000000000067656e6572616c2e617263686974656374757265080000000400000000000000636c69700c0000000000000067656e6572616c2e747970650800000006000000000000006d6d70726f6a0c0000000000000067656e6572616c2e6e616d6508000000230000000000000047656d6d61342031324220547265766f7220556e696669656420436f6d70616e696f6e120000000000000067656e6572616c2e73697a655f6c6162656c08000000030000000000000035324d110000000000000067656e6572616c2e66696c655f7479706504000000010000001700000000000000636c69702e6861735f766973696f6e5f656e636f64657207000000011a00000000000000636c69702e766973696f6e2e70726f6a656374696f6e5f64696d04000000000f00001600000000000000636c69702e766973696f6e2e696d6167655f73697a6504000000e00000001600000000000000636c69702e766973696f6e2e70617463685f73697a6504000000100000001c00000000000000636c69702e766973696f6e2e656d62656464696e675f6c656e67746804000000000f00001f00000000000000636c69702e766973696f6e2e666565645f666f72776172645f6c656e67746804000000000000001700000000000000636c69702e766973696f6e2e626c6f636b5f636f756e7404000000000000002000000000000000636c69702e766973696f6e2e617474656e74696f6e2e686561645f636f756e7404000000000000001600000000000000636c69702e766973696f6e2e696d6167655f6d65616e090000000600000003000000000000000000000000000000000000001500000000000000636c69702e766973696f6e2e696d6167655f737464090000000600000003000000000000000000803f0000803f0000803f1600000000000000636c69702e6861735f617564696f5f656e636f64657207000000011900000000000000636c69702e617564696f2e70726f6a656374696f6e5f64696d04000000000f00001b00000000000000636c69702e617564696f2e656d62656464696e675f6c656e67746804000000800200001e00000000000000636c69702e617564696f2e666565645f666f72776172645f6c656e67746804000000000000001600000000000000636c69702e617564696f2e626c6f636b5f636f756e7404000000000000001f00000000000000636c69702e617564696f2e617474656e74696f6e2e686561645f636f756e7404000000000000001a00000000000000636c69702e766973696f6e2e70726f6a6563746f725f7479706508000000080000000000000067656d6d613475762800000000000000636c69702e766973696f6e2e617474656e74696f6e2e6c617965725f6e6f726d5f657073696c6f6e06000000bd3786351900000000000000636c69702e617564696f2e70726f6a6563746f725f7479706508000000080000000000000067656d6d613475611700000000000000636c69702e617564696f2e6e756d5f6d656c5f62696e7304000000800000002700000000000000636c69702e617564696f2e617474656e74696f6e2e6c617965725f6e6f726d5f657073696c6f6e06000000bd3786351c0000000000000067656e6572616c2e7175616e74697a6174696f6e5f76657273696f6e04000000020000001c000000000000006d6d2e612e696e7075745f70726f6a656374696f6e2e776569676874020000008002000000000000000f0000000000000100000000000000000000001a000000000000006d6d2e696e7075745f70726f6a656374696f6e2e77656967687402000000000f000000000000000f0000000000000100000000004b00000000001100000000000000762e70617463685f656d62642e6269617301000000000f0000000000000000000000000d02000000001300000000000000762e70617463685f656d62642e77656967687402000000001b000000000000000f00000000000001000000003c0d02000000001300000000000000762e70617463685f6e6f726d2e312e6269617301000000001b00000000000000000000003c3705000000001500000000000000762e70617463685f6e6f726d2e312e77656967687401000000001b0000000000000000000000a83705000000001300000000000000762e70617463685f6e6f726d2e322e6269617301000000000f0000000000000000000000143805000000001500000000000000762e70617463685f6e6f726d2e322e77656967687401000000000f0000000000000000000000503805000000001600000000000000762e706f736974696f6e5f656d62642e77656967687403000000000f0000000000006004000000000000020000000000000000000000008c3805000000001300000000000000762e70617463685f6e6f726d2e332e6269617301000000000f00000000000000000000008c4507000000001500000000000000762e70617463685f6e6f726d2e332e77656967687401000000000f0000000000000000000000c845070000000000000000000000000000000000000000000000",tensors:[{sourceName:"model.embed_audio.embedding_projection.weight",sourceOffset:88960,sourceBytes:4915200,sourceSha256:"13acfa416b1b5462172e035f4d0bfa8b5687ffcbe8e39a641c0f6255deae55aa",transform:"identity",outputName:"mm.a.input_projection.weight",outputType:"f16",outputOffset:1888,outputBytes:4915200},{sourceName:"model.embed_vision.embedding_projection.weight",sourceOffset:5004160,sourceBytes:29491200,sourceSha256:"24b039b273e7abb78598449b14ca508f52b2b6f8a9dee02636eb999dd74b76cb",transform:"identity",outputName:"mm.input_projection.weight",outputType:"f16",outputOffset:4917088,outputBytes:29491200},{sourceName:"model.vision_embedder.patch_dense.bias",sourceOffset:23849196e3,sourceBytes:7680,sourceSha256:"cff453202ce800f6ae86de0155916397807569cf9982aff6ecbf4d338d4e6367",transform:"identity",outputName:"v.patch_embd.bias",outputType:"f32",outputOffset:34408288,outputBytes:15360},{sourceName:"model.vision_embedder.patch_dense.weight",sourceOffset:23849203680,sourceBytes:53084160,sourceSha256:"3e6de438f7269759f3f380cf17ea4b7be38f66fb1bf080a13afe52d08db2d8cb",transform:"patch-chw",outputName:"v.patch_embd.weight",outputType:"f16",outputOffset:34423648,outputBytes:53084160},{sourceName:"model.vision_embedder.patch_ln1.bias",sourceOffset:23902287840,sourceBytes:13824,sourceSha256:"59feb36622246d1b1e063f36c13e0219b0ea8bf85387c963ef74e4572f9c4a62",transform:"patch-chw",outputName:"v.patch_norm.1.bias",outputType:"f32",outputOffset:87507808,outputBytes:27648},{sourceName:"model.vision_embedder.patch_ln1.weight",sourceOffset:23902301664,sourceBytes:13824,sourceSha256:"9f24ede566712933ce0e196985bda3678db26d2ba9986de83473d601236c266a",transform:"patch-chw",outputName:"v.patch_norm.1.weight",outputType:"f32",outputOffset:87535456,outputBytes:27648},{sourceName:"model.vision_embedder.patch_ln2.bias",sourceOffset:23902315488,sourceBytes:7680,sourceSha256:"7f0c14a2d8e734bcd6441ae26199efb5c29d08b51b43bbd32d65b8e4865e3df9",transform:"identity",outputName:"v.patch_norm.2.bias",outputType:"f32",outputOffset:87563104,outputBytes:15360},{sourceName:"model.vision_embedder.patch_ln2.weight",sourceOffset:23902323168,sourceBytes:7680,sourceSha256:"a4abbf0ce48d752c4b605d2f5bc882c84e4f02729c0dfcd3421e0905f7a03a90",transform:"identity",outputName:"v.patch_norm.2.weight",outputType:"f32",outputOffset:87578464,outputBytes:15360},{sourceName:"model.vision_embedder.pos_embedding",sourceOffset:23902330848,sourceBytes:17203200,sourceSha256:"fec250580622e6ae1e39ee89cf9c173e0a15a7987d75c5dcb1975ba08df178d0",transform:"position-xy",outputName:"v.position_embd.weight",outputType:"f32",outputOffset:87593824,outputBytes:34406400},{sourceName:"model.vision_embedder.pos_norm.bias",sourceOffset:23919534048,sourceBytes:7680,sourceSha256:"43b0a2fbb80dcb85bb0602a686588ca8387703da9bf65ae55e20f8e763368aa1",transform:"identity",outputName:"v.patch_norm.3.bias",outputType:"f32",outputOffset:122000224,outputBytes:15360},{sourceName:"model.vision_embedder.pos_norm.weight",sourceOffset:23919541728,sourceBytes:7680,sourceSha256:"712aba394794531a970fdfb9451492cc8286ecbb431951950dc2296c18697e5d",transform:"identity",outputName:"v.patch_norm.3.weight",outputType:"f32",outputOffset:122015584,outputBytes:15360}]}),Uu=Object.freeze({path:"mmproj-gemma4-unified-f16.gguf",size:Lu.size,sha256:Lu.sha256}),js=u0["gemma4-12b-uncensored-q4-k-m-gguf"],Bf="gemma4-12b-uncensored-q4-k-m-multimodal-gguf",Of=[...js.files,Uu],ks=Lu;function h0(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(h0),Object.freeze(n)),n}const P3=h0({[Bf]:{...js,id:Bf,name:"Gemma 4 12B Uncensored (Q4_K_M, vision + audio)",files:Of,description:"Image and audio understanding with text replies. Reuses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading this package to avoid keeping two 12B models in GPU memory.",capabilities:{...js.capabilities,executionStatus:"tested",executionReason:"Tested November 10, 2026 in hardware Chrome on an RTX 5060 Ti: text, changing images, speech transcription, retained reload and encrypted peer inference. Requires the pinned companion and normal device admission. Audio input produces text; speech synthesis uses a separate model."},model:{...js.model,modalities:["text","image","audio"],ggufMedia:{profile:"gemma4-unified-v1",projectorPath:Uu.path}},provenance:{...js.provenance,vision:"A separately derived Gemma4Unified companion supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browser execution remains unverified.",derivedArtifacts:[{path:Uu.path,recipe:ks.id,sourceRepository:ks.source.repository,sourceRevision:ks.source.revision,sourcePath:"model.safetensors",sourceFileSha256:ks.source.publisherSha256,sourceDigestVerification:"Publisher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source checkpoint is not downloaded.",converter:{repository:"ggml-org/llama.cpp",revision:ks.converterRevision,outputType:"f16"},processor:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",path:"processor_config.json",sha256:"6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9",notice:"Processor settings are sourced explicitly from Google because the Trevor source omits this file."}}],outputModalities:"Text only. Image/audio understanding and transcription are distinct from image or speech generation."},totalBytes:Of.reduce((n,e)=>n+e.size,0)}}),Gs="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Vs="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",vc=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],Nu=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function f0(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(f0),Object.freeze(n)),n}const D3=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated.q4_k_m.gguf",size:396704896,sha256:"a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",size:2525,sha256:"bf87a238c72dda7f21fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f7103979938cc420c932911dbb",source:{repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",path:"README.md"}},{path:"LICENSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7d9483f310cd292e92e",gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"c1899de289a04d12100db370d81485cdf75e47ca",path:"LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.8B Abliterated (GGUF Q4_K_M, text)",repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",architecture:"qwen3_5",files:[{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"eef9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678ef4472737b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:n,...e})=>[e.id,f0({...e,status:"execution-candidate",format:"GGUF",capabilities:Nu,behavior:{kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${e.files[2].source.repository}/blob/${e.files[2].source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:e.repository,revision:e.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${e.repository}/blob/${e.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:n,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:e.repository,revision:e.revision},weightBytes:e.files[0].size,totalBytes:e.files.reduce((t,i)=>t+i.size,0)})]));Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Gs,revision:Vs,status:"execution-candidate",format:"GGUF",capabilities:Nu,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Gs}/blob/${Vs}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Gs,revision:Vs,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Gs}/blob/${Vs}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:Gs,revision:Vs},weightBytes:vc[0].size,totalBytes:vc.reduce((n,e)=>n+e.size,0),files:vc},...D3,...T3,...C3,...u0,...P3,...A3,...Object.fromEntries(Object.entries(M3).map(([n,e])=>[n,{...e,status:"execution-candidate",capabilities:Nu}]))});function wl(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(wl),Object.freeze(n)),n}const p0=wl({"triposr-q8-onnx":{id:"triposr-q8-onnx",name:"TripoSR · image to 3D (Q8)",repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",status:"tested",pipeline:"triposr",architecture:"triposr",dtype:"q8",files:[{path:"triplane_q8.onnx",size:885712,sha256:"7721f5a45e79e02de8c6e909c21fb8e922fd0b594038a8fc1cfefa42c79ad6d5",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx"}},{path:"triplane_q8.onnx.data",size:483785728,sha256:"50bf9b1c1218dc2c7fb6051d0d2cb7a48a1c5f75cc86e67a9d0e09a931298e35",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"triplane_q8.onnx.data"}},{path:"decoder.onnx",size:173796,sha256:"6ff43581f1d2b46aa61764c2729a8d33985b51cb6c8088cf36ffee3fd70355eb",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"decoder.onnx"}},{path:"README.md",size:3633,sha256:"179a47df133504635c15498b74a7a700f80ed3d43aa12c864ad58539fc667a78",source:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",path:"README.md"}}],license:{spdx:"MIT",sourceUrl:"https://github.com/VAST-AI-Research/TripoSR/blob/107cefdc244c39106fa830359024f6a2f1c78871/LICENSE",notice:`MIT License

Copyright (c) 2024 Tripo AI & Stability AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`},capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"tested",executionReason:"Tested on NVIDIA WebGPU without shader-f16: real chair image to colored GLB locally and over encrypted inference v5, cancellation/recovery and source-off retained restart. Two CubeChat pages fetched and rendered the same CID; the owner restored it after reload without regeneration. Requires the managed ORT native WebGPU worker. Static objects only; no rigging or animation.",executionEvidence:{checkedAt:"2026-11-11",scope:"local managed worker, encrypted v5 peer inference, and two CubeChat pages",gpuArchitecture:"NVIDIA Blackwell",shaderF16Required:!1,fixture:"TripoSR MIT chair.png",meshSha256:"778fb251bd61ef74ee256622ffe5602d512f1455e8678911f91f866e67af6f24",meshBytes:590056,triangles:4908,gpuDispatches:1207,cancellationRecovery:!0,retainedRestart:!0,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",peerCancellationRecovery:!0,peerOutputMatchesLocal:!0,cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}},provenance:{repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",format:"ONNX",metadataCheckedAt:"2026-11-11",modelCardUrl:"https://huggingface.co/cgb/triposr-onnx-webgpu/blob/048725e957f485cc6bc082a9d6a239fcf7d8880a/README.md"},model:{runtime:"onnx-mesh",runtimeVersion:"1.31.1",task:"image-to-3d",format:"ONNX",pipeline:"triposr",architecture:"triposr",dtype:"q8",modalities:["image"],outputModalities:["mesh"],requiredFeatures:[],repository:"cgb/triposr-onnx-webgpu",revision:"048725e957f485cc6bc082a9d6a239fcf7d8880a",resolution:64,densityThreshold:25,radius:.87,imageSize:512,foregroundRatio:.85},weightBytes:484845236,totalBytes:484848869}});wl(Object.values(p0));const ci=p0["triposr-q8-onnx"],ao=[{path:"u2netp.onnx",size:4574861,sha256:"309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"u2netp.onnx"}},{path:"u2netp.README.md",size:2597,sha256:"e447db65818dba51c001c1a5c9fc43c56c5c60e5ed2cd858c2bad3a239847ef4",source:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",path:"README.md"}}],zf={spdx:"Apache-2.0",sourceUrl:"https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE",notice:`                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
`},I3={spdx:"MIT",sourceUrl:"https://raw.githubusercontent.com/danielgatis/rembg/991927b77667946dab59c50df31f7d4640e80457/LICENSE.txt",notice:`MIT License

Copyright (c) 2020 Daniel Gatis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`};wl({"triposr-q8-onnx":{...ci,model:{...ci.model,backgroundRemoval:"u2netp"},files:[...ci.files,...ao],weightBytes:ci.weightBytes+ao[0].size,totalBytes:ci.totalBytes+ao.reduce((n,e)=>n+e.size,0),license:{spdx:"MIT AND Apache-2.0",sourceUrl:ci.license.sourceUrl,notice:"TripoSR © 2024 Tripo AI & Stability AI (MIT). U²-Net weights: Apache-2.0; rembg distribution © 2020 Daniel Gatis (MIT). Full original license texts are retained in this package.",components:[ci.license,zf,I3]},provenance:{...ci.provenance,foreground:{repository:"edgetools/u2netp",revision:"25dee37ab19c5b6ad64ba6578eba63f1ae07720c",sourceUrl:"https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx",modelCardUrl:"https://huggingface.co/edgetools/u2netp/blob/25dee37ab19c5b6ad64ba6578eba63f1ae07720c/README.md",sha256:ao[0].sha256,licenseUrl:zf.sourceUrl}},capabilities:{...ci.capabilities,executionStatus:"tested",executionReason:"Tested in the managed WebGPU worker: actual CubeChat owner chat through peer Qwen and DreamShaper to U2NetP foreground removal and TripoSR. Both CubeChat peers displayed the same isolated chair CID; owner reload restored it without regeneration. Static, coarse geometry; no rigging or animation. No shader-f16 required.",executionEvidence:{checkedAt:"2026-11-11",scope:"Actual owner chat, peer language/image/3D inference, two CubeChat pages and retained object reload",shaderF16Required:!1,foregroundModel:"u2netp",input:"Opaque DreamShaper 512x512 RGBA chair",meshSha256:"277a963c5b9b66361f7ef7e43deea2fc5e90b770f5897def6b58ea83f186ae16",meshBytes:883820,triangles:7356,peerExecution:"tested",peerProtocol:"/peercompute/inference/5.0.0",cubeChat:{pages:2,sameArtifactCid:!0,renderedOnBothPages:!0,ownerReloadWithoutGeneration:!0,unpinnedObserverCacheCollected:!0}}}}});new TextEncoder;new TextDecoder("utf-8",{fatal:!0});const rl=1024**3,Vi=Object.freeze({maximumBytes:8*rl,maximumFileBytes:2*rl-1,maximumConfigBytes:1024**2,contextTokens:2048,legacyMaximumBytes:1536*1024**2}),m0=Object.freeze(["q4","q4f16","q8","fp16","fp32"]),L3=["qwen2","qwen3","llama"],kf=["phi","phi3","gemma","gemma2","gemma3_text","mistral","granite","starcoder2","smollm3","olmo","olmo2","nemotron_h"],Gf=["idefics3","smolvlm","qwen3_5"],U3=["llama","qwen2","qwen3","qwen35","gemma","gemma2","gemma3","gemma4","phi3","phi2","granite","starcoder2","olmo","olmo2","stablelm","nemotron","smollm3"],N3=Object.freeze([...[...L3,...kf,...Gf].map(n=>{const e=Gf.includes(n);return Object.freeze({runtime:"transformers.js",runtimeVersion:"4.3.2",architecture:n,task:e?"image-text-to-text":"text-generation",qualification:"candidate",modalities:Object.freeze(e?["text","image"]:["text"]),modules:Object.freeze(e?["embed_tokens","vision_encoder","decoder_model_merged"]:["model"]),dtypes:n==="qwen3_5"?Object.freeze(["q4"]):m0,requiresMemoryProfile:kf.includes(n),contextTokens:2048,maximumBytes:e?n==="qwen3_5"?2*rl:Vi.legacyMaximumBytes:Vi.maximumBytes,maximumFileBytes:Vi.maximumFileBytes})}),...U3.map(n=>Object.freeze({runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:n,modelArchitecture:n==="qwen35"?"qwen3_5":n,task:"text-generation",modalities:Object.freeze(["text"]),qualification:"candidate"}))]);function Md(n,e){return N3.find(t=>t.runtime===n&&t.architecture===e)??null}function F3(n){const e=typeof n=="string"?[n]:n&&typeof n=="object"&&!Array.isArray(n)?Object.values(n):[];if(!e.length||e.length>16||e.some(t=>!m0.includes(t)))throw new Error("Unsupported ONNX precision");return e}function g0(n){const e=(n==null?void 0:n["transformers.js_config"])??{},t=e.device_config??{};return Object.hasOwn(t,"webgpu")?{...e,...t.webgpu}:{...e}}function B3(n,e={}){const t=F3(n),i=g0(e).kv_cache_dtype;return t.some(s=>["fp16","q4f16"].includes(s)||(typeof i=="string"?i:i==null?void 0:i[s])==="float16")?["shader-f16"]:[]}function _n(n,e,t=1048576,i=1){if(!Number.isSafeInteger(n)||n<i||n>t)throw new Error(`Invalid model memory dimension: ${e}`);return n}function O3(n){const e=g0(n).free_dimension_overrides;if(e&&(typeof e!="object"||Array.isArray(e)||Object.keys(e).length))throw new Error("Dynamic ONNX free_dimension_overrides are not admitted by this memory profile");const t=n==null?void 0:n.model_type,i=Md("transformers.js",t);if(!i)throw new Error("Unsupported model memory architecture");const r=i.task==="image-text-to-text"?n.text_config??n:n,s=r.layer_types??r.layers_block_type,a=_n(r.num_hidden_layers??(s==null?void 0:s.length),"layers",512),o=_n(r.hidden_size,"hidden size",65536),l=_n(r.num_attention_heads,"attention heads",1024),c=_n(r.num_key_value_heads??l,"KV heads",1024),d=_n(r.head_dim??o/l,"head dimension",4096),h=_n(r.vocab_size??n.vocab_size,"vocabulary");if(s!==void 0&&(!Array.isArray(s)||s.length!==a||s.some(b=>!["attention","mamba","mlp","moe","full_attention","sliding_attention","linear_attention"].includes(b))))throw new Error("Invalid model memory layer types");let f=a,p=0,g=0,x=0,m=0,u=0,y=0;if(t==="nemotron_h"){if(!s)throw new Error("Nemotron requires explicit recurrent layer types");if(f=s.filter(v=>v==="attention").length,p=s.filter(v=>v==="mamba").length,s.some(v=>!["attention","mamba","mlp","moe"].includes(v)))throw new Error("Unsupported Nemotron layer type");m=_n(r.mamba_num_heads,"SSM heads",1024),u=_n(r.mamba_head_dim,"SSM head dimension",4096),y=_n(r.ssm_state_size,"SSM state size",4096);const b=_n(r.n_groups,"SSM groups",1024);x=_n(r.conv_kernel,"convolution kernel",256),g=_n(m*u+2*b*y,"convolution channels")}return Sl({schema:"peercompute.onnx.memory.v1",architecture:t,layers:a,hiddenSize:o,heads:l,kvHeads:c,headDim:d,vocabulary:h,attentionLayers:f,recurrentLayers:p,convChannels:g,convKernel:x,ssmHeads:m,ssmHeadDim:u,stateSize:y})}function Sl(n){const e=["schema","architecture","layers","hiddenSize","heads","kvHeads","headDim","vocabulary","attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"];if(!n||n.schema!=="peercompute.onnx.memory.v1"||!Md("transformers.js",n.architecture)||Object.keys(n).some(i=>!e.includes(i)))throw new Error("Invalid model memory profile");for(const i of e.slice(2))_n(n[i],i,1048576,["attentionLayers","recurrentLayers","convChannels","convKernel","ssmHeads","ssmHeadDim","stateSize"].includes(i)?0:1);if(n.layers>512||n.attentionLayers+n.recurrentLayers>n.layers||n.kvHeads>n.heads||n.architecture!=="nemotron_h"&&n.recurrentLayers)throw new Error("Invalid model memory layer geometry");const t=2*(2*n.attentionLayers*n.kvHeads*n.headDim*2048*4+n.recurrentLayers*(n.ssmHeads*n.ssmHeadDim*n.stateSize+n.convChannels*n.convKernel)*4);if(!Number.isSafeInteger(t)||t>16*rl)throw new Error("Model cache/state exceeds its bounded memory envelope");return Object.fromEntries(e.map(i=>[i,n[i]]))}function z3(n){const e=Sl(n);return 2*(2*e.attentionLayers*e.kvHeads*e.headDim*2048*4+e.recurrentLayers*(e.ssmHeads*e.ssmHeadDim*e.stateSize+e.convChannels*e.convKernel)*4)}function v0(n,e){if((e==null?void 0:e.model_type)!==n.architecture)throw new Error("Model config architecture does not match its admitted manifest");if(e.auto_map&&Object.keys(e.auto_map).length)throw new Error("Custom model code is not admitted");if(n.memoryProfile&&JSON.stringify(Sl(n.memoryProfile))!==JSON.stringify(O3(e)))throw new Error("Model memory profile differs from its verified config");return B3(n.dtype,e)}const Vf="transformers.js",y0="4.3.2",Rt=Object.freeze({maxManifestBytes:256*1024,maxFiles:1024,maxModelBytes:Vi.maximumBytes,maxFileBytes:Vi.maximumFileBytes,maxContextTokens:2048,maxNewTokens:1024,maxPromptBytes:64*1024,maxOutputBytes:64*1024,maxMessages:64,maxQueued:4,chunkBytes:256*1024,maxReads:4,maxImagePixels:1024*1024,maxImageBytes:4*1024*1024}),k3=Object.freeze({maxModelBytes:2*1024**3,maxFileBytes:Rt.maxFileBytes,minimumCpuBytes:8*1024**3,minimumGpuBytes:8*1024**3,maxProcessedImagePixels:512*512}),x0=Object.freeze({maxModelBytes:Rt.maxModelBytes,maxFileBytes:Rt.maxFileBytes,minimumCpuBytes:0,minimumGpuBytes:0,maxProcessedImagePixels:Rt.maxImagePixels}),G3=Object.freeze({...x0,maxModelBytes:Vi.legacyMaximumBytes});function b0(n,{files:e,totalBytes:t,config:i}={}){const r=(n==null?void 0:n.architecture)==="qwen3_5"?k3:["idefics3","smolvlm"].includes(n==null?void 0:n.architecture)?G3:x0;if(i&&v0(n,i),e){t=0;for(const c of e){if(!Number.isSafeInteger(c.size)||c.size<0)throw new Error("Invalid model file size");if(c.size>Rt.maxFileBytes)throw Object.assign(new Error("Model file exceeds its bounded file budget (each ONNX file must be smaller than 2 GiB)"),{code:"ERR_MODEL_FILE_TOO_LARGE"});t+=c.size}}if(t!==void 0&&(!Number.isSafeInteger(t)||t<0||t>r.maxModelBytes))throw Object.assign(new Error(`Model exceeds its admitted file budget of ${r.maxModelBytes/1024**3} GiB`),{code:"ERR_MODEL_PACKAGE_TOO_LARGE"});const s=(n==null?void 0:n.memoryProfile)&&Sl(n.memoryProfile);if(s&&s.architecture!==n.architecture)throw new Error("Model memory architecture mismatch");if(!s&&!(t>Vi.legacyMaximumBytes))return r;const a=t??0,o=s?z3(s):0,l=1024**3;return{...r,minimumCpuBytes:Math.max(r.minimumCpuBytes,2*a+2*l+o),minimumGpuBytes:Math.max(r.minimumGpuBytes,2*a+l+o),cacheBytes:o}}function Fu(n="Operation cancelled"){return(n==null?void 0:n.name)==="AbortError"?n:new DOMException(typeof n=="string"?n:"Operation cancelled","AbortError")}function rn(n){if(n!=null&&n.aborted)throw Fu(n.reason)}function oo(n){if(typeof n!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(n))throw new Error("Invalid model session ID");return n}function Bu(n){if(typeof n!="string"||!n||new TextEncoder().encode(n).length>512||/[\\%?#:\u0000-\u001f\u007f]/.test(n)||n.startsWith("/")||n.split("/").some(e=>!e||e==="."||e===".."))throw new Error("Invalid model artifact path");return n}function V3(n){var h;let e;try{e=JSON.stringify(n)}catch{throw new Error("Invalid model manifest")}if(!e||new TextEncoder().encode(e).length>Rt.maxManifestBytes)throw new Error("Model manifest exceeds its metadata budget");const t=JSON.parse(e);if(((h=t.model)==null?void 0:h.composition)!==void 0)throw new Error("This ONNX runtime does not support model adapters");if(t.schema!=="peercompute.artifact.manifest.v1"||!Array.isArray(t.files)||!t.files.length||t.files.length>Rt.maxFiles)throw new Error("Invalid model manifest files");const i=new Set,r=b0(t.model,{files:t.files});let s=0;for(const f of t.files){if(Bu(f.path),i.has(f.path))throw new Error("Duplicate model artifact path");i.add(f.path);const p=kt.parse(f.cid);if(![85,112].includes(p.code)||p.multihash.code!==18||p.multihash.size!==32)throw new Error("Unsupported model artifact CID");if(!Number.isSafeInteger(f.size)||f.size<0||!/^[a-f0-9]{64}$/i.test(f.sha256??""))throw new Error("Invalid model file size/digest");if(f.sha256=f.sha256.toLowerCase(),s+=f.size,!Number.isSafeInteger(s)||s>r.maxModelBytes)throw new Error("Model exceeds its admitted file budget")}const a=t.model,o=Md(Vf,a==null?void 0:a.architecture);if((a==null?void 0:a.runtime)!==Vf||a.runtimeVersion!==y0||!o)throw new Error("Model runtime, architecture or dtype is not approved");if(a.task??(a.task=o.task),a.task!==o.task)throw new Error("Model task does not match its admitted architecture");if((o.requiresMemoryProfile||o.task==="text-generation"&&s>Vi.legacyMaximumBytes)&&!a.memoryProfile)throw new Error("This model requires a verified config memory profile");const l=typeof a.dtype=="string"?[["model",a.dtype]]:a.dtype&&typeof a.dtype=="object"&&!Array.isArray(a.dtype)?Object.entries(a.dtype):[];if(!l.length||l.length>16||l.some(([f,p])=>!/^[A-Za-z0-9_-]{1,100}$/.test(f)||!["fp32","fp16","q4","q4f16","q8"].includes(p)))throw new Error("Invalid model dtype configuration");if(a.architecture==="qwen3_5"&&l.some(([,f])=>f!=="q4"))throw new Error("Qwen3.5 admits q4 language and vision modules");const c=f=>f==="fp32"?"":f==="q8"?"_quantized":`_${f}`,d=["config.json","tokenizer.json","tokenizer_config.json"];if((typeof a.dtype!="string"||a.task==="text-generation")&&d.push(...l.map(([f,p])=>`onnx/${f}${c(p)}.onnx`)),a.task==="image-text-to-text")for(const f of["embed_tokens","vision_encoder","decoder_model_merged"]){const p=typeof a.dtype=="string"?a.dtype:a.dtype[f];if(!p)throw new Error("Multimodal dtype configuration is missing a module");d.push(`onnx/${f}${c(p)}.onnx`),a.architecture==="qwen3_5"&&d.push(`onnx/${f}${c(p)}.onnx_data`)}if(d.some(f=>!i.has(f)))throw new Error("Incomplete model package");if(a.task==="image-text-to-text"&&!i.has("preprocessor_config.json")&&!i.has("processor_config.json"))throw new Error("Multimodal processor configuration is missing");if(a.requiredFeatures!==void 0&&(!Array.isArray(a.requiredFeatures)||a.requiredFeatures.length>32||a.requiredFeatures.some(f=>typeof f!="string"||f.length>80)))throw new Error("Invalid model GPU features");return{manifest:t,totalBytes:s,resourcePolicy:r}}function H3(n,e){const t=new URL(e),i={};for(const r of["mjs","wasm"]){if(typeof(n==null?void 0:n[r])!="string")throw new Error("Trusted ORT runtime assets are required");const s=new URL(n[r],t);if(s.origin!==t.origin||s.username||s.password||s.hash||!["http:","https:"].includes(s.protocol)||!s.pathname.endsWith(`.${r}`))throw new Error("ORT assets must be approved same-origin runtime files");i[r]=s.href}return i}const W3="peercompute.model-artifact-read.v1",_0=W3;function q3(n,e){var i;const t=r=>e(r.data);return n.addEventListener("message",t),(i=n.start)==null||i.call(n),()=>n.removeEventListener("message",t)}function Li(n,e,t=[]){n.postMessage({protocol:_0,...e},t)}function X3(n,{manifest:e,baseUrl:t,signal:i,chunkBytes:r=Rt.chunkBytes,maxReads:s=Rt.maxReads,maxQueuedReads:a=32}={}){if(!Number.isInteger(s)||s<1||s>Rt.maxReads||!Number.isInteger(a)||a<0||a>32)throw new RangeError("Invalid artifact reader limits");const o=new URL(t),l=new Map(e.files.map(u=>[Bu(u.path),u])),c=new Map,d=[];let h=0,f=!1;function p(){for(;!f&&c.size<s&&d.length;){const u=d.shift();c.set(u.id,u),u.active=!0,Li(n,{type:"open",id:u.id,path:u.path})}}function g(u,y){var v,M,S,E;c.delete(u.id);const b=d.indexOf(u);if(b>=0&&d.splice(b,1),i==null||i.removeEventListener("abort",u.abort),(v=u.requestSignal)==null||v.removeEventListener("abort",u.abort),y){(M=u.reject)==null||M.call(u,y);try{(S=u.streamController)==null||S.error(y)}catch{}}(E=u.resolvePull)==null||E.call(u),p()}const x=q3(n,u=>{if((u==null?void 0:u.protocol)!==_0)return;const y=c.get(u.id);if(y){if(u.type==="error"){g(y,new Error(u.message));return}if(u.type==="ready"){if(y.ready||u.size!==y.file.size){g(y,new Error("Invalid artifact response size")),Li(n,{type:"cancel",id:y.id});return}y.ready=!0,Li(n,{type:"pull",id:y.id})}else if(u.type==="chunk"){if(!y.ready||!y.resolvePull||!(u.bytes instanceof Uint8Array)||!u.bytes.byteLength||u.bytes.byteLength>r||y.received+u.bytes.byteLength>y.file.size){Li(n,{type:"cancel",id:y.id}),g(y,new Error("Invalid artifact chunk"));return}y.received+=u.bytes.byteLength,y.streamController.enqueue(u.bytes);const b=y.resolvePull;y.resolvePull=null,b()}else u.type==="end"&&(!y.ready||y.received!==y.file.size?g(y,new Error("Truncated artifact response")):(y.streamController.close(),g(y)))}});async function m(u,y={}){if(f)throw new Error("Artifact bridge is closed");if(rn(i),rn(y.signal),y.method&&y.method!=="GET")throw new Error("Model adapter supports GET only");const b=String(u);if(/[\\]/.test(b)||/%(?:2e|2f|5c|00)/i.test(b)||/\/(?:\.|\.\.)(?:\/|$)/.test(b))throw new Error("Invalid artifact URL");const v=new URL(b,o);if(v.origin!==o.origin||v.username||v.password||v.search||v.hash||!v.pathname.startsWith(o.pathname))throw new Error("Model path is outside its manifest");const M=Bu(decodeURIComponent(v.pathname.slice(o.pathname.length))),S=l.get(M);if(!S)return new Response("Artifact path is not in the manifest",{status:404});const E=`read-${++h}`,A={id:E,path:M,file:S,requestSignal:y.signal,received:0,ready:!1,active:!1,queued:!1};A.abort=()=>{var _;A.active&&Li(n,{type:"cancel",id:E}),g(A,Fu((i==null?void 0:i.reason)??((_=y.signal)==null?void 0:_.reason)))};const w=new ReadableStream({start(_){A.streamController=_},pull(){if(f)throw new Error("Artifact bridge is closed");if(rn(i),rn(y.signal),!A.active&&!A.queued&&c.size>=s&&d.length>=a)throw new Error("Artifact reader limit reached");return new Promise(_=>{var R;A.resolvePull=_,A.ready?Li(n,{type:"pull",id:E}):A.queued||(A.queued=!0,i==null||i.addEventListener("abort",A.abort,{once:!0}),(R=y.signal)==null||R.addEventListener("abort",A.abort,{once:!0}),d.push(A),p())})},cancel(){A.active&&Li(n,{type:"cancel",id:E}),g(A)}},{highWaterMark:0});return new Response(w,{headers:{"Content-Length":String(S.size),"Content-Type":S.mediaType||"application/octet-stream"}})}return{fetch:m,close(u="Artifact bridge closed"){if(!f){f=!0;for(const y of[...c.values(),...d])y.active&&Li(n,{type:"cancel",id:y.id}),g(y,Fu(u));x(),n.close()}}}}const $3="4.3.2",Y3=new Set(["qwen3_5","qwen3_5_text"]),yc=new WeakMap,xc="_get_text_only_rope_index";function Hf(n,e,t){var s,a,o,l;const[i,r]=n??[];if((i==null?void 0:i.type)!=="int64"||(r==null?void 0:r.type)!=="int64"||((s=i.dims)==null?void 0:s.length)!==3||i.dims[0]!==3||i.dims[1]!==e||i.dims[2]!==t||((a=r.dims)==null?void 0:a.length)!==2||r.dims[0]!==e||r.dims[1]!==1||((o=i.data)==null?void 0:o.length)!==3*e*t||((l=r.data)==null?void 0:l.length)!==e)throw new Error("Unsupported Qwen text position result");return{positions:i,deltas:r}}function j3(n,e){var o,l,c;if(((o=e==null?void 0:e.env)==null?void 0:o.version)!==$3||!Y3.has((l=n==null?void 0:n.config)==null?void 0:l.model_type))return!1;if(yc.has(n)){if(n[xc]!==yc.get(n))throw new Error("Qwen text position compatibility was replaced");return!0}const t=n[xc];if(typeof t!="function"||typeof e.Tensor!="function")throw new Error("Qwen text position compatibility is unavailable");const i=new e.Tensor("int64",[10n,11n],[1,2]),r=new e.Tensor("int64",[1n,1n],[1,2]);let s;try{s=t.call(n,i,r);const{positions:d,deltas:h}=Hf(s,1,2);if([...d.data].some((f,p)=>f!==BigInt(p%2)))throw new Error("Unsupported Qwen text position calculation");if(h.data[0]===0n)return!1;if(h.data[0]!==4n)throw new Error("Unsupported Qwen text position offset")}finally{for(const d of new Set([i,r,...Array.isArray(s)?s:[]]))(c=d==null?void 0:d.dispose)==null||c.call(d)}function a(d,h){var p,g;const f=t.call(this,d,h);if(!h)return f;try{const[x,m]=h.dims??[];if(((p=h.dims)==null?void 0:p.length)!==2||!Number.isSafeInteger(x)||x<1||!Number.isSafeInteger(m)||m<1)throw new Error("Invalid Qwen text position dimensions");const{positions:u,deltas:y}=Hf(f,x,m);for(let v=0;v<x;v++){let M=u.data[v*m];for(let S=1;S<m;S++){const E=u.data[v*m+S];E>M&&(M=E)}if(y.data[v]!==M+1n+BigInt(m))throw new Error("Qwen text position behavior changed")}const b=2n*BigInt(m);for(let v=0;v<x;v++)y.data[v]-=b;return f}catch(x){for(const m of new Set(Array.isArray(f)?f:[]))(g=m==null?void 0:m.dispose)==null||g.call(m);throw x}}return Object.defineProperty(n,xc,{value:a,configurable:!0,writable:!0}),yc.set(n,a),!0}const Po=n=>new TextEncoder().encode(n).byteLength;function K3(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("Model inference requires a ComputeManager-owned worker")}function Q3(n){if(n==null)return null;if(!Number.isSafeInteger(n.width)||!Number.isSafeInteger(n.height)||n.width<1||n.height<1||n.width*n.height>Rt.maxImagePixels||n.channels!==4||!(n.data instanceof Uint8Array||n.data instanceof Uint8ClampedArray)||n.data.byteLength!==n.width*n.height*4||n.data.byteLength>Rt.maxImageBytes)throw new Error("Image must contain bounded RGBA pixels; image URLs and encoded files are not accepted");return n}function Z3(n){const e=n.messages??(typeof n.prompt=="string"?[{role:"user",content:n.prompt}]:null);if(!Array.isArray(e)||!e.length||e.length>Rt.maxMessages)throw new Error("Invalid inference messages");let t=0;return e.map(i=>{if(!i||!["system","user","assistant"].includes(i.role)||typeof i.content!="string")throw new Error("Only text message content is accepted");if(t+=Po(i.content),t>Rt.maxPromptBytes)throw new Error("Prompt exceeds its byte budget");return{role:i.role,content:i.content}})}async function w0(n){var i;if(!n)return;let e;const t=new Set;for(const r of[n.model,n.processor,n.tokenizer])if(!(!r||t.has(r))){t.add(r);try{await((i=r.dispose)==null?void 0:i.call(r))}catch(s){e??(e=s)}}if(e)throw e}function Ou(n,e=new Set){if(!(!n||typeof n!="object"||e.has(n))){if(e.add(n),typeof n.dispose=="function"){n.dispose();return}for(const t of Object.values(n))Ou(t,e)}}function J3(n){const e=n.findIndex(i=>i.role==="user");if(e<0)return null;const t=n.findIndex((i,r)=>r>e&&i.role==="user");return t<0?null:n.filter((i,r)=>r<e||r>=t||i.role==="system")}function eT(n,e,t){const i={...n.config};for(const o of["decoder","generator","text_config"])Object.assign(i,i[o]);Object.assign(i,n.generation_config);const r=Array.isArray(i.eos_token_id)?i.eos_token_id:[i.eos_token_id],s=e.at(-1),a=o=>typeof o=="bigint"||Number.isSafeInteger(o)&&o>=0;return a(s)&&r.some(o=>a(o)&&BigInt(o)===BigInt(s))?"stop":e.length>=t?"length":"unknown"}function Vn(n,e,t){const i=n==="out-of-memory"?"GPU out of memory. Close GPU-heavy apps or unload other models, then reload this model.":`GPU ${n}: ${String((e==null?void 0:e.message)??e??"operation failed").slice(0,240)}`,r=new Error(`Model session lost: ${t} ${i}`,{cause:e});return r.code=n==="out-of-memory"?"ERR_MODEL_GPU_OUT_OF_MEMORY":"ERR_MODEL_GPU",r}function tT(n){let e,t,i=!1;const r=o=>{var l;i||(n.lost=!0,(!n.gpuFailure||o.code==="ERR_MODEL_GPU_OUT_OF_MEMORY")&&(n.gpuFailure=o),(l=n.active)==null||l.abort(o))},s=({error:o})=>{var l;return r(Vn(((l=o==null?void 0:o.constructor)==null?void 0:l.name)==="GPUOutOfMemoryError"?"out-of-memory":"uncaptured error",o,(t==null?void 0:t.stage)??"resident model"))},a=()=>{if(!(!t||t.device)){t.device=e;for(const o of["validation","out-of-memory","internal"])e.pushErrorScope(o),t.filters.push(o)}};return{attach(o){var l,c;if(e&&e!==o)throw Vn("device changed",null,"load");if(!e){if(!o||typeof o.pushErrorScope!="function"||typeof o.popErrorScope!="function"||typeof((l=o.queue)==null?void 0:l.onSubmittedWorkDone)!="function"||typeof o.addEventListener!="function"||typeof o.removeEventListener!="function"||typeof o.destroy!="function"||typeof((c=o.lost)==null?void 0:c.then)!="function")throw Vn("device unavailable",null,"load");e=o,n.runtimeDevice=e,e.addEventListener("uncapturederror",s),e.lost.then(d=>r(Vn("device lost",d,(t==null?void 0:t.stage)??"resident model")),d=>r(Vn("device lost",d,(t==null?void 0:t.stage)??"resident model")))}try{a()}catch(d){const h=Vn("error scope failure",d,(t==null?void 0:t.stage)??"load");throw r(h),h}},async run(o,l){if(n.lost)throw n.gpuFailure??Vn("device lost",null,o);if(t)throw new Error("Overlapping model GPU operations are not allowed");const c={stage:o,filters:[],device:null};t=c;let d,h;try{if(e&&this.attach(e),d=await l(),!e)throw Vn("device unavailable",null,o)}catch(g){h=g}if(e)try{await e.queue.onSubmittedWorkDone()}catch(g){r(Vn("queue failure",g,o))}const f=await Promise.all(c.filters.reverse().map(async g=>{try{return{filter:g,error:await c.device.popErrorScope()}}catch(x){return{filter:g,error:x,scopeFailed:!0}}}));t=null;for(const g of f)g.scopeFailed&&r(Vn("error scope failure",g.error,o));const p=["out-of-memory","internal","validation"].map(g=>f.find(x=>x.filter===g&&x.error&&!x.scopeFailed)).find(Boolean);if(p&&r(Vn(p.filter,p.error,o)),h instanceof WebAssembly.RuntimeError||/^failed to call OrtRun\(\)\./.test((h==null?void 0:h.message)??"")){const g=new Error("Model session lost: native inference runtime failed",{cause:h});g.code="ERR_MODEL_RUNTIME",r(g)}if(typeof(h==null?void 0:h.code)=="string"&&h.code.startsWith("ERR_MODEL_GPU")&&r(h),n.gpuFailure)throw n.gpuFailure;if(h)throw h;return d},dispose(){i=!0,e==null||e.removeEventListener("uncapturederror",s)}}}function nT(n){var r;const e=["maxBindGroups","maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension","maxStorageBuffersPerShaderStage","maxStorageBufferBindingSize","maxBufferSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ"],t={};for(const s of e){const a=(r=n.limits)==null?void 0:r[s];if(!Number.isSafeInteger(a)||a<=0)throw new Error(`WebGPU adapter has an invalid ${s} limit`);t[s]=a}const i=["chromium-experimental-subgroup-matrix","timestamp-query","shader-f16","subgroups","subgroup-size-control"].filter(s=>n.features.has(s));return{requiredLimits:t,requiredFeatures:i}}async function Wf(n){var e,t,i;await w0(n.components),(e=n.restoreGpuEvidence)==null||e.call(n),(t=n.gpuGuard)==null||t.dispose(),(i=n.ownedDevice)==null||i.destroy(),n.ownedDevice=null}async function iT({library:n,modelPath:e,options:t,manifest:i,adapterFeatures:r=[]}){const s={};try{const a=await n.AutoConfig.from_pretrained(e,t),o=v0(i.model,a);for(const c of o)if(!r.includes(c))throw new Error(`Model config requires unsupported GPU feature: ${c}`);const l={...t,config:a};if(i.model.architecture==="qwen3_5"&&(l.use_external_data_format=1),i.model.task==="image-text-to-text"){if(s.processor=await n.AutoProcessor.from_pretrained(e,t),i.model.architecture==="qwen3_5"){const c=s.processor.image_processor;if(!c)throw new Error("Qwen3.5 image processor is unavailable");c.min_pixels=256*256,c.max_pixels=b0(i.model).maxProcessedImagePixels,c.do_normalize??(c.do_normalize=!0)}s.tokenizer=s.processor.tokenizer,s.model=await n.AutoModelForImageTextToText.from_pretrained(e,l)}else s.tokenizer=await n.AutoTokenizer.from_pretrained(e,t),s.model=await n.AutoModelForCausalLM.from_pretrained(e,l);return s}catch(a){throw await w0(s),a}}function qf(n){return{sessionId:n.sessionId,manifestCid:n.manifestCid,status:n.lost?"lost":n.status,task:n.manifest.model.task,dtype:n.manifest.model.dtype,workerId:n.workerId,adapter:n.adapter,runtimeAdapter:n.runtimeAdapter??null,gpuDispatches:n.gpuDispatches??0,gpuSubmissions:n.gpuSubmissions??0,gpuProfileSamples:n.gpuProfileSamples??0,collectGpuEvidence:n.collectGpuEvidence===!0,runtimeFeatures:n.runtimeFeatures??[],generatedRequests:n.generatedRequests,qwenTextRopeCompatibility:n.qwenTextRopeCompatibility===!0}}function rT({loadLibrary:n=()=>iw(()=>import("./transformers.web-B_0RCN0l.js"),[],import.meta.url),loadModel:e=iT,gpu:t=(s=>(s=globalThis.navigator)==null?void 0:s.gpu)(),baseUrl:i=(a=>(a=globalThis.location)==null?void 0:a.href)(),assertWorker:r=K3}={}){const o=new Map;let l;async function c(h,f){var y,b,v,M,S,E;if(o.size)throw new Error("This inference worker already has a resident/loading model");const p=oo(h.sessionId),{manifest:g}=V3(h.manifest),x=H3(h.runtimeAssets,i);if(!((y=h.artifactPort)!=null&&y.postMessage))throw new Error("An artifact reader port is required");rn(f.signal);const m={sessionId:p,manifest:g,manifestCid:h.manifestCid,status:"loading",workerId:f.workerId??null,generatedRequests:0,components:null};o.set(p,m);let u;try{const A=await(t==null?void 0:t.requestAdapter({powerPreference:"high-performance"}));if(rn(f.signal),!A||(b=A.info)!=null&&b.isFallbackAdapter||A.isFallbackAdapter)throw new Error("A hardware WebGPU adapter is required; CPU/software fallback is disabled");const w=typeof g.model.dtype=="string"?[g.model.dtype]:Object.values(g.model.dtype),_=new Set(g.model.requiredFeatures??[]);w.some(H=>["fp16","q4f16"].includes(H))&&_.add("shader-f16");for(const H of _)if(!A.features.has(H))throw new Error(`Model requires unsupported GPU feature: ${H}`);m.adapter={vendor:((v=A.info)==null?void 0:v.vendor)??"",architecture:((M=A.info)==null?void 0:M.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[..._]};const R=await(l??(l=n()));if(rn(f.signal),R.env.version!==y0)throw new Error("Unexpected Transformers runtime version");const U=new URL("/__peercompute_models/",i);u=X3(h.artifactPort,{manifest:g,baseUrl:new URL(`${p}/`,U).href,signal:f.signal});const{env:L}=R;L.logLevel=50,L.allowLocalModels=!0,L.allowRemoteModels=!1,L.localModelPath=U.pathname,L.useBrowserCache=!1,L.useFSCache=!1,L.useWasmCache=!1,L.fetch=async(...H)=>{var z;try{return await u.fetch(...H)}catch(Y){throw(z=f.emitProgress)==null||z.call(f,{type:"artifact-read-error",sessionId:p,message:Y.message}),Y}},L.backends.onnx.wasm.proxy=!1,L.backends.onnx.wasm.numThreads=1,L.backends.onnx.wasm.wasmPaths=x,m.gpuDispatches=0,m.gpuProfileSamples=0,m.gpuSubmissions=0,m.collectGpuEvidence=h.collectGpuEvidence===!0,L.backends.onnx.webgpu&&(L.backends.onnx.webgpu.profiling={mode:h.collectGpuEvidence===!0?"default":"off",ondata:()=>{m.gpuProfileSamples+=1}});const O={local_files_only:!0,device:"webgpu",dtype:g.model.dtype,session_options:{executionProviders:["webgpu"]},progress_callback:H=>{var z,Y;(z=f.signal)!=null&&z.aborted||(Y=f.emitProgress)==null||Y.call(f,{type:"model-load",sessionId:p,status:String(H.status??"").slice(0,40),file:typeof H.file=="string"?H.file.slice(0,512):void 0,loaded:Number.isFinite(H.loaded)?H.loaded:void 0,total:Number.isFinite(H.total)?H.total:void 0})}};m.library=R,m.gpuGuard=tT(m),await m.gpuGuard.run("load",async()=>{const H=L.backends.onnx.webgpu;if(!H)throw new Error("The WebGPU runtime is unavailable");H.adapter=A,m.ownedDevice=await A.requestDevice(nT(A)),m.gpuGuard.attach(m.ownedDevice),O.session_options.executionProviders=[{name:"webgpu",device:m.ownedDevice}],m.components=await e({library:R,modelPath:p,options:O,manifest:g,adapterFeatures:[...A.features]}),m.qwenTextRopeCompatibility=j3(m.components.model,R);for(const z of _)if(!m.runtimeDevice.features.has(z))throw new Error(`ORT device is missing required GPU feature: ${z}`);rn(f.signal)});const V=m.runtimeDevice;if(m.runtimeFeatures=[...(V==null?void 0:V.features)??[]],m.collectGpuEvidence&&V){const H=V.createCommandEncoder.bind(V),z=V.queue.submit.bind(V.queue),Y=Object.getOwnPropertyDescriptor(V,"createCommandEncoder"),ne=Object.getOwnPropertyDescriptor(V.queue,"submit");m.restoreGpuEvidence=()=>{Y?Object.defineProperty(V,"createCommandEncoder",Y):delete V.createCommandEncoder,ne?Object.defineProperty(V.queue,"submit",ne):delete V.queue.submit,m.restoreGpuEvidence=null},V.createCommandEncoder=(...le)=>{const oe=H(...le),ge=oe.beginComputePass.bind(oe);return oe.beginComputePass=(...X)=>{const K=ge(...X);for(const ie of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const ee=K[ie].bind(K);K[ie]=(...ve)=>{const fe=ee(...ve);return m.gpuDispatches+=1,fe}}return K},oe},V.queue.submit=(...le)=>{const oe=z(...le);return m.gpuSubmissions+=1,oe}}const k=(V==null?void 0:V.adapterInfo)??((E=(S=L.backends.onnx.webgpu)==null?void 0:S.adapter)==null?void 0:E.info);if(k){if(k.isFallbackAdapter)throw new Error("ORT selected a software GPU adapter");m.runtimeAdapter={vendor:k.vendor,architecture:k.architecture,isFallbackAdapter:k.isFallbackAdapter??!1}}if(rn(f.signal),m.lost)throw m.gpuFailure;return m.status="ready",qf(m)}catch(A){try{await Wf(m),o.delete(p)}catch(w){m.status="ready",m.lost=!0;const _=new Error(`MODEL_DISPOSE_FAILED: ${w.message}`);throw _.code="MODEL_DISPOSE_FAILED",_}throw A}finally{u==null||u.close(),u||h.artifactPort.close()}}async function d(h,f){var L,O,V,k;const p=o.get(oo(h.sessionId));if(!p||p.lost)throw new Error("Model session lost or not loaded");if(p.status!=="ready")throw new Error("Model session is busy");const g=oo(h.requestId),x=h.maxNewTokens??Rt.maxNewTokens;if(!Number.isInteger(x)||x<1||x>Rt.maxNewTokens)throw new Error("Generation exceeds its output-token budget");let m=Z3(h);const u=Q3(h.image);if(u&&p.manifest.model.task!=="image-text-to-text")throw new Error("This model does not admit image inputs");rn(f.signal);const y=new AbortController,b=new p.library.InterruptableStoppingCriteria,v=()=>{var H;y.abort((H=f.signal)==null?void 0:H.reason),b.interrupt()};(L=f.signal)==null||L.addEventListener("abort",v,{once:!0}),y.signal.addEventListener("abort",()=>b.interrupt(),{once:!0}),p.active=y,p.requestId=g,p.status="generating";let M,S,E=0,A=0,w,_=!1;const R=p.gpuDispatches??0,U=p.gpuSubmissions??0;try{rn(f.signal);const{tokenizer:H,processor:z,model:Y}=p.components;let ne;for(;;){rn(y.signal);let K=m;if(z&&(K=m.map(fe=>({role:fe.role,content:[{type:"text",text:fe.content}]})),u)){const fe=K.findLast(Ge=>Ge.role==="user");if(!fe)throw new Error("An image requires a user message");fe.content.unshift({type:"image"})}const ie=(z??H).apply_chat_template(K,{tokenize:!1,add_generation_prompt:!0,enable_thinking:!1});if(typeof ie!="string"||Po(ie)>Rt.maxPromptBytes)throw new Error("Templated prompt exceeds its byte budget");if(u){const fe=new p.library.RawImage(u.data,u.width,u.height,u.channels);M=await z(ie,fe,{do_image_splitting:!1})}else M=await H(ie,{truncation:!1,padding:!1});if(rn(y.signal),ne=(V=(O=M.input_ids)==null?void 0:O.dims)==null?void 0:V.at(-1),!Number.isSafeInteger(ne)||ne<1)throw new Error("Invalid model input token count");if(ne+x<=Rt.maxContextTokens)break;const ee=J3(m);if(!ee)throw new Error("Latest prompt/image and system instructions exceed the context budget; shorten the prompt or request fewer output tokens");const ve=M;M=void 0,Ou(ve),m=ee,_=!0}rn(y.signal);const le=new p.library.TextStreamer(H,{skip_prompt:!0,skip_special_tokens:!0,callback_function:K=>{var ie;if(!(y.signal.aborted||w)){if(A+=Po(K),A>Rt.maxOutputBytes){w=new Error("Generated text exceeded its byte budget"),y.abort(w);return}try{if(((ie=f.emitProgress)==null?void 0:ie.call(f,{type:"token",sessionId:p.sessionId,requestId:g,sequence:E++,text:K}))===!1)throw new Error("Token consumer rejected output")}catch(ee){w=ee,y.abort(ee)}}}});if(await p.gpuGuard.run("generation",async()=>{S=await Y.generate({...M,max_new_tokens:x,do_sample:!1,streamer:le,stopping_criteria:[b]})}),w)throw w;if(p.lost)throw p.gpuFailure;rn(y.signal);const oe=S.tolist();if(oe.length!==1||oe[0].length<ne||oe[0].length>ne+x)throw new Error("Model returned an over-budget token sequence");const ge=oe[0].slice(ne),X=H.decode(ge,{skip_special_tokens:!0});if(Po(X)>Rt.maxOutputBytes)throw new Error("Generated text exceeds its byte budget");return p.generatedRequests+=1,{sessionId:p.sessionId,requestId:g,text:X,inputTokens:ne,outputTokens:ge.length,finishReason:eT(Y,ge,x),contextTruncated:_,workerId:p.workerId,gpuDispatches:(p.gpuDispatches??0)-R,gpuSubmissions:(p.gpuSubmissions??0)-U,gpuProfileSamples:p.gpuProfileSamples??0}}catch(H){throw p.gpuFailure??H}finally{(k=f.signal)==null||k.removeEventListener("abort",v);try{const H=new Set;let z;for(const Y of[M,S])try{Ou(Y,H)}catch(ne){z??(z=ne)}if(z){p.lost=!0;const Y=p.gpuFailure??new Error("Model session lost: tensor cleanup failed",{cause:z});throw Y.code??(Y.code="MODEL_DISPOSE_FAILED"),p.gpuFailure=Y,Y}}finally{p.active=null,p.requestId=null,p.status="ready"}}}return async function(f={},p={}){var x;if(r(),f.command==="load")return c(f,p);if(f.command==="generate")return d(f,p);const g=o.get(oo(f.sessionId));if(f.command==="status")return g?qf(g):{sessionId:f.sessionId,status:"absent"};if(f.command==="cancel")return(g==null?void 0:g.requestId)===f.requestId&&((x=g.active)==null||x.abort("Generation cancelled")),{sessionId:f.sessionId,cancellationRequested:!0};if(f.command==="unload"){if(!g)return{sessionId:f.sessionId,status:"absent"};if(g.status!=="ready")throw new Error("Cancel and await active model work before unloading");g.status="unloading";try{await Wf(g)}catch(m){g.status="ready",g.lost=!0;const u=new Error(`MODEL_DISPOSE_FAILED: ${m.message}`);throw u.code="MODEL_DISPOSE_FAILED",u}return o.delete(f.sessionId),{sessionId:f.sessionId,status:"unloaded"}}throw new Error("Unknown model task command")}}rT();const sT=Object.freeze(["hadamard","pauli_x","pauli_z","cnot"]);Object.freeze([...sT,"compute_probabilities"]);let qr=null,Xf=null;async function zu(){if(qr)return qr;try{return Xf=new w3({frameBudgetMs:6}),qr=await Xf.initialize(),qr}catch(n){if(console.warn("[planetgen] GPU hub unavailable, falling back to local WebGPU init",n),typeof navigator>"u"||!navigator.gpu)return null;const e=await navigator.gpu.requestAdapter();return e?(qr=await e.requestDevice(),qr):null}}function ae(n,e,t){return Math.min(Math.max(n,e),t)}function Dn(n){return ae(n,0,1)}function aT(n){let e=1/0,t=-1/0;for(let r=0;r<n.length;r++){const s=n[r];s<e&&(e=s),s>t&&(t=s)}const i=Math.max(t-e,1e-5);for(let r=0;r<n.length;r++)n[r]=(n[r]-e)/i}function oT(n,e,t=1){if(t<=0)return;const i=new Float32Array(n.length);for(let r=0;r<t;r++){for(let s=0;s<e;s++){const a=Math.max(0,s-1),o=Math.min(e-1,s+1);for(let l=0;l<e;l++){const c=(l-1+e)%e,d=(l+1)%e,h=s*e+l,f=n[h]*2+n[s*e+c]+n[s*e+d]+n[a*e+l]+n[o*e+l];i[h]=f/6}}n.set(i)}}function Es(){return window.matchMedia("(max-width: 768px)").matches||/Mobi|Android|iP(ad|hone|od)|IEMobile|BlackBerry|Kindle|Silk|Opera Mini/i.test(navigator.userAgent||"")}function S0(n,e,t){const i=n==null?void 0:n.image,r=i==null?void 0:i.data,s=(i==null?void 0:i.width)??0,a=(i==null?void 0:i.height)??0;if(!r||!s||!a)return{r:0,g:0,b:0,a:0};const o=(e%1+1)%1,l=ae(t,0,1),c=Math.min(s-1,Math.floor(o*s)),h=(Math.min(a-1,Math.floor(l*a))*s+c)*4;return{r:r[h]??0,g:r[h+1]??0,b:r[h+2]??0,a:r[h+3]??0}}class lT{constructor(e){this.sceneManager=e,this.forge=null,this.planet=null,this.water=null,this.freshwater=null,this.cloudLayerSettings=[],this.lastSettings=null,this.atmosphereSystem=new K1(e.planetGroup),this.cloudSystem=new Q1(e.planetGroup),this.oceanComputeSystem=null,this.useComputeOcean=!0,this.waterUniforms={time:{value:0},deepColor:{value:new Se(532543)},shallowColor:{value:new Se(1396618)},opacity:{value:.9},fresnelPower:{value:3.4},iceCap:{value:0},iceColor:{value:new Se(14283263)},windStrength:{value:.5}}}async initOceanCompute(){if(!this.oceanComputeSystem)try{const e=await zu();this.oceanComputeSystem=await fd.create({gridWidth:256,gridHeight:128,device:e||void 0}),console.log("[PlanetManager] Ocean compute system initialized")}catch(e){console.warn("[PlanetManager] Failed to init ocean compute:",e),this.oceanComputeSystem=null}}async generate(e,t){const i=r=>{t&&t(r)};try{i(`Tectonics: ${e.numPlates} plates`),await new Promise(a=>requestAnimationFrame(a)),this.forge=new j1(e.resolution),this.forge.generateTectonics({numPlates:e.numPlates,jitter:e.jitter,oceanFloor:.2,plateDelta:e.plateDelta,faultType:e.faultType,plateSizeVariance:e.plateSizeVariance,desymmetrizeTiling:e.desymmetrizeTiling}),i(`Erosion: ${e.iterations.toLocaleString()} droplets`),await new Promise(a=>requestAnimationFrame(a)),this.forge.applyErosion({iterations:e.iterations,erosionRate:e.erosionRate,evaporation:e.evaporation}),aT(this.forge.data),oT(this.forge.data,this.forge.size,e.smoothPasses),this.forge.applyHydrology({seaLevel:e.seaLevel,riverDepth:.015,lakeThreshold:.003}),i("Meshing planet…"),await new Promise(a=>requestAnimationFrame(a)),this.lastSettings={...e};const r=this.forge.createMesh(e.radius,e.heightScale,e.seaLevel,e.subdivisions,e.iceCap);r.userData.forge=this.forge,r.userData.settings=e,r.rotation.x=.25,r.castShadow=!0,r.receiveShadow=!0,this.replacePlanet(r),this.replaceWater(this.buildWaterMesh(e.radius,e.subdivisions,e.seaLevel,e.heightScale,e.iceCap,e.waterShader||"balanced")),this.replaceFreshwater(this.forge.createFreshwaterMesh(e.radius,e.heightScale,e.seaLevel,e.subdivisions));const s=this.sceneManager.getSunDir();this.atmosphereSystem.updateVisuals(e,e.radius,e.subdivisions,e.heightScale,s),this.cloudSystem.rebuild(s,e.radius,e.seaLevel,e.heightScale,e.subdivisions,this.cloudLayerSettings),this.applyPlanetScale(e.planetDiameterKm),i(`${e.resolution}² map · ${e.iterations.toLocaleString()} steps`)}catch(r){console.error(r),i("Generation failed – check console")}}update(e,t=!0){var i,r,s,a,o,l,c,d,h,f,p,g;if(this.planet&&t&&(this.planet.rotation.y+=9e-4),this.water){if(this.waterUniforms.time.value+=.016,(r=(i=this.water.material)==null?void 0:i.uniforms)!=null&&r.time&&(this.water.material.uniforms.time.value+=e),(a=(s=this.water.material)==null?void 0:s.uniforms)!=null&&a.eye&&((o=this.sceneManager)!=null&&o.camera)&&this.water.material.uniforms.eye.value.copy(this.sceneManager.camera.position),(c=(l=this.water.material)==null?void 0:l.uniforms)!=null&&c.sunDirection){const x=(d=this.sceneManager)==null?void 0:d.getSunDir();x&&this.water.material.uniforms.sunDirection.value.copy(x)}(f=(h=this.water.material)==null?void 0:h.uniforms)!=null&&f.oceanMap&&((p=this.oceanComputeSystem)!=null&&p.enabled)&&(this.water.material.uniforms.oceanMap.value=this.oceanComputeSystem.getTexture(),this.water.material.uniforms.useOceanMap.value=1)}this.freshwater&&(this.freshwater.material.uniforms.time.value+=.016),(g=this.oceanComputeSystem)!=null&&g.enabled&&this.oceanComputeSystem.update(e),this.atmosphereSystem.update(e),this.cloudSystem.update(e)}updateOceanMouse(e,t,i,r){var s;(s=this.oceanComputeSystem)!=null&&s.enabled&&this.oceanComputeSystem.setMouseInteraction(e,t,i,r)}clearOceanMouse(){var e;(e=this.oceanComputeSystem)!=null&&e.enabled&&this.oceanComputeSystem.clearMouseInteraction()}setAtmosphereWeather(e,t){var i;(i=this.atmosphereSystem)==null||i.setWeather(e,t)}setOceanWindTexture(e){var i,r;if(!((r=(i=this.water)==null?void 0:i.material)!=null&&r.uniforms))return;const t=this.water.material.uniforms;t.windAuxMap&&(t.windAuxMap.value=e),t.useLocalWind&&(t.useLocalWind.value=e?1:0)}setOceanWindField(e){var t;(t=this.oceanComputeSystem)!=null&&t.enabled&&this.oceanComputeSystem.setWindField(e)}setOceanWindVector(e){var s;if(!((s=this.oceanComputeSystem)!=null&&s.enabled)||!e)return;const t=new Ee(e.x,e.z),i=t.length();i>1e-6&&t.normalize();const r=Math.min(Math.max(i/40,0),2);this.oceanComputeSystem.setConfig({windStrength:r,windDirectionX:t.x,windDirectionY:t.y})}replacePlanet(e){var t,i;this.planet&&(this.planet.geometry.dispose(),Array.isArray(this.planet.material)?this.planet.material.forEach(r=>{var s;return(s=r.dispose)==null?void 0:s.call(r)}):(i=(t=this.planet.material).dispose)==null||i.call(t),this.sceneManager.planetGroup.remove(this.planet)),this.planet=e,this.planet.castShadow=!0,this.planet.receiveShadow=!0,this.sceneManager.planetGroup.add(e)}replaceWater(e){var t,i;this.water&&(this.water.geometry.dispose(),Array.isArray(this.water.material)?this.water.material.forEach(r=>{var s;return(s=r.dispose)==null?void 0:s.call(r)}):(i=(t=this.water.material).dispose)==null||i.call(t),this.sceneManager.planetGroup.remove(this.water)),this.water=e,this.water.castShadow=!0,this.water.receiveShadow=!0,this.sceneManager.planetGroup.add(e)}replaceFreshwater(e){var t,i;this.freshwater&&(this.freshwater.geometry.dispose(),(i=(t=this.freshwater.material).dispose)==null||i.call(t),this.freshwater.parent&&this.freshwater.parent.remove(this.freshwater)),this.freshwater=e,this.freshwater.renderOrder=1,this.freshwater.castShadow=!0,this.freshwater.receiveShadow=!0,this.planet?this.planet.add(e):this.sceneManager.planetGroup.add(e)}buildWaterMesh(e,t,i,r,s,a="balanced"){var d;const o=e+(i-.5)*r+.01,l=new Ji(o,Math.max(0,Math.floor(t)));this.waterUniforms.iceCap.value=s??0;let c;return a==="compute"&&((d=this.oceanComputeSystem)!=null&&d.enabled)?c=this.buildComputeOceanMaterial(o):a==="fast"?c=this.buildFastOceanMaterial():c=this.buildBalancedOceanMaterial(),new Gt(l,c)}buildComputeOceanMaterial(e,t=null){var s,a,o;const i={time:{value:0},deepColor:{value:new Se(673904)},midColor:{value:new Se(1732752)},shallowColor:{value:new Se(2461872)},sunDirection:{value:new D(.3,.8,.45).normalize()},windAuxMap:{value:t},useLocalWind:{value:t?1:0},globalWindDir:{value:new D(1,0,.5).normalize()},eye:{value:new D},waveHeight:{value:1},waveScale:{value:.6},windStrength:{value:.8},maxWind:{value:60},fetchLength:{value:1.5},waterRadius:{value:e},oceanMap:{value:((a=(s=this.oceanComputeSystem)==null?void 0:s.getTexture)==null?void 0:a.call(s))??null},useOceanMap:{value:(o=this.oceanComputeSystem)!=null&&o.enabled?1:0},oceanHeightScale:{value:.35},oceanNormalScale:{value:.6},oceanFoamScale:{value:.7}},r=new Vt({uniforms:i,transparent:!0,depthWrite:!0,side:En,vertexShader:`
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
            `});return r.uniforms=i,r}buildBalancedOceanMaterial(){const e={time:{value:0},color:{value:new Se(5086166)},sunDirection:{value:new D(.3,.8,.45).normalize()},eye:{value:new D}},t=new Vt({uniforms:e,transparent:!0,depthWrite:!0,side:En,vertexShader:`
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
            `});return t.uniforms=e,t}buildFastOceanMaterial(){const e={time:{value:0},sunDirection:{value:new D(.3,.8,.45).normalize()},eye:{value:new D},uColor:{value:new Se(871286)}},t=new Vt({uniforms:e,transparent:!0,depthWrite:!0,side:En,vertexShader:`
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
            `});return t.uniforms=e,t}applyPlanetScale(e){const t=(e||Gi)/Gi;this.sceneManager.planetGroup.scale.setScalar(t),this.sceneManager.controls.minDistance=Math.max(.2,10*t*.1)}updateAtmosphere(e,t){if(!this.lastSettings)return;const i=this.sceneManager.getSunDir();this.atmosphereSystem.updateVisuals(e,this.lastSettings.radius,this.lastSettings.subdivisions,this.lastSettings.heightScale,i),t&&this.atmosphereSystem.setWeather(t.map,t.rainHaze)}rebuildClouds(e){this.lastSettings&&this.cloudSystem.rebuild(e,this.lastSettings.radius,this.lastSettings.seaLevel,this.lastSettings.heightScale,this.lastSettings.subdivisions,this.cloudLayerSettings)}}const bc={type:"change"},Ed={type:"start"},Td={type:"end"},$f=1e-6,et={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},lo=new Ee,Ui=new Ee,cT=new D,co=new D,_c=new D,Xr=new $n,Yf=new D,uo=new D,wc=new D,ho=new D;class uT extends $v{constructor(e,t=null){super(e,t),this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:rs.ROTATE,MIDDLE:rs.DOLLY,RIGHT:rs.PAN},this.state=et.NONE,this.keyState=et.NONE,this.target=new D,this._lastPosition=new D,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new D,this._movePrev=new Ee,this._moveCurr=new Ee,this._lastAxis=new D,this._zoomStart=new Ee,this._zoomEnd=new Ee,this._panStart=new Ee,this._panEnd=new Ee,this._pointers=[],this._pointerPositions={},this._onPointerMove=hT.bind(this),this._onPointerDown=dT.bind(this),this._onPointerUp=fT.bind(this),this._onPointerCancel=pT.bind(this),this._onContextMenu=_T.bind(this),this._onMouseWheel=bT.bind(this),this._onKeyDown=gT.bind(this),this._onKeyUp=mT.bind(this),this._onTouchStart=wT.bind(this),this._onTouchMove=ST.bind(this),this._onTouchEnd=MT.bind(this),this._onMouseDown=vT.bind(this),this._onMouseMove=yT.bind(this),this._onMouseUp=xT.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,t!==null&&(this.connect(),this.handleResize()),this.update()}connect(){window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const e=this.domElement.getBoundingClientRect(),t=this.domElement.ownerDocument.documentElement;this.screen.left=e.left+window.pageXOffset-t.clientLeft,this.screen.top=e.top+window.pageYOffset-t.clientTop,this.screen.width=e.width,this.screen.height=e.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>$f&&(this.dispatchEvent(bc),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>$f||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(bc),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=et.NONE,this.keyState=et.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(bc),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(Ui.copy(this._panEnd).sub(this._panStart),Ui.lengthSq()){if(this.object.isOrthographicCamera){const e=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,t=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;Ui.x*=e,Ui.y*=t}Ui.multiplyScalar(this._eye.length()*this.panSpeed),co.copy(this._eye).cross(this.object.up).setLength(Ui.x),co.add(cT.copy(this.object.up).setLength(Ui.y)),this.object.position.add(co),this.target.add(co),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(Ui.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){ho.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let e=ho.length();e?(this._eye.copy(this.object.position).sub(this.target),Yf.copy(this._eye).normalize(),uo.copy(this.object.up).normalize(),wc.crossVectors(uo,Yf).normalize(),uo.setLength(this._moveCurr.y-this._movePrev.y),wc.setLength(this._moveCurr.x-this._movePrev.x),ho.copy(uo.add(wc)),_c.crossVectors(ho,this._eye).normalize(),e*=this.rotateSpeed,Xr.setFromAxisAngle(_c,e),this._eye.applyQuaternion(Xr),this.object.up.applyQuaternion(Xr),this._lastAxis.copy(_c),this._lastAngle=e):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),Xr.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(Xr),this.object.up.applyQuaternion(Xr)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let e;this.state===et.TOUCH_ZOOM_PAN?(e=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=Go.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(e=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,e!==1&&e>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=Go.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(e,t){return lo.set((e-this.screen.left)/this.screen.width,(t-this.screen.top)/this.screen.height),lo}_getMouseOnCircle(e,t){return lo.set((e-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-t))/this.screen.width),lo}_addPointer(e){this._pointers.push(e)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId==e.pointerId){this._pointers.splice(t,1);return}}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ee,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[t.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function dT(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n))}function hT(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function fT(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchEnd(n):this._onMouseUp(),this._removePointer(n),this._pointers.length===0&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function pT(n){this._removePointer(n)}function mT(){this.enabled!==!1&&(this.keyState=et.NONE,window.addEventListener("keydown",this._onKeyDown))}function gT(n){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===et.NONE&&(n.code===this.keys[et.ROTATE]&&!this.noRotate?this.keyState=et.ROTATE:n.code===this.keys[et.ZOOM]&&!this.noZoom?this.keyState=et.ZOOM:n.code===this.keys[et.PAN]&&!this.noPan&&(this.keyState=et.PAN)))}function vT(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case rs.DOLLY:this.state=et.ZOOM;break;case rs.ROTATE:this.state=et.ROTATE;break;case rs.PAN:this.state=et.PAN;break;default:this.state=et.NONE}const t=this.keyState!==et.NONE?this.keyState:this.state;t===et.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY)),this._movePrev.copy(this._moveCurr)):t===et.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(n.pageX,n.pageY)),this._zoomEnd.copy(this._zoomStart)):t===et.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(n.pageX,n.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(Ed)}function yT(n){const e=this.keyState!==et.NONE?this.keyState:this.state;e===et.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY))):e===et.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(n.pageX,n.pageY)):e===et.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(n.pageX,n.pageY))}function xT(){this.state=et.NONE,this.dispatchEvent(Td)}function bT(n){if(this.enabled!==!1&&this.noZoom!==!0){switch(n.preventDefault(),n.deltaMode){case 2:this._zoomStart.y-=n.deltaY*.025;break;case 1:this._zoomStart.y-=n.deltaY*.01;break;default:this._zoomStart.y-=n.deltaY*25e-5;break}this.dispatchEvent(Ed),this.dispatchEvent(Td)}}function _T(n){this.enabled!==!1&&n.preventDefault()}function wT(n){switch(this._trackPointer(n),this._pointers.length){case 1:this.state=et.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);break;default:this.state=et.TOUCH_ZOOM_PAN;const e=this._pointers[0].pageX-this._pointers[1].pageX,t=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(e*e+t*t);const i=(this._pointers[0].pageX+this._pointers[1].pageX)/2,r=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(i,r)),this._panEnd.copy(this._panStart);break}this.dispatchEvent(Ed)}function ST(n){switch(this._trackPointer(n),this._pointers.length){case 1:this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY));break;default:const e=this._getSecondPointerPosition(n),t=n.pageX-e.x,i=n.pageY-e.y;this._touchZoomDistanceEnd=Math.sqrt(t*t+i*i);const r=(n.pageX+e.x)/2,s=(n.pageY+e.y)/2;this._panEnd.copy(this._getMouseOnScreen(r,s));break}}function MT(n){switch(this._pointers.length){case 0:this.state=et.NONE;break;case 1:this.state=et.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(n.pageX,n.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=et.TOUCH_ZOOM_PAN;for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId!==n.pointerId){const t=this._pointerPositions[this._pointers[e].pointerId];this._moveCurr.copy(this._getMouseOnCircle(t.x,t.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(Td)}class ET{constructor(e){if(this.canvas=e,this.canvas&&this.canvas.setAttribute&&this.canvas.setAttribute("tabindex","0"),this.renderer=this.createRenderer(e),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(329487),this.renderer.outputColorSpace=wn,this.renderer.xr.enabled=!0,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=jp,this.scene=new Pv,this.scene.background=new Se(329487),this.scene.fog=new sd(329487,30,120),this.planetGroup=new Qr,this.scene.add(this.planetGroup),this.userGroup=new Qr,this.scene.add(this.userGroup),this.camera=new In(60,window.innerWidth/window.innerHeight,1e-16,2e3),this.userGroup.add(this.camera),this.camera.position.set(0,10,28),this.controls=new uT(this.camera,this.renderer.domElement),this.controls.rotateSpeed=2.2,this.controls.zoomSpeed=2,this.controls.panSpeed=1,this.controls.dynamicDampingFactor=.1,this.controls.noPan=!0,this.controls.minDistance=12,this.controls.maxDistance=60,typeof this.controls.onTouchMove=="function"){const i=this.controls.onTouchMove.bind(this.controls);this.controls.onTouchMove=r=>{if(!(!r.touches||r.touches.length===0))return i(r)}}if(typeof this.controls.onTouchEnd=="function"){const i=this.controls.onTouchEnd.bind(this.controls);this.controls.onTouchEnd=r=>{if(r.touches)return i(r)}}this.scene.add(new Gv(14215167,658450,9e-4)),this.dirLight=new Wv(16777215,1.35),this.dirLight.position.set(12,16,10),this.dirLight.castShadow=!0,this.dirLight.shadow.mapSize.set(2048,2048),this.dirLight.shadow.camera.near=.5,this.dirLight.shadow.camera.far=300;const t=80;this.dirLight.shadow.camera.left=-t,this.dirLight.shadow.camera.right=t,this.dirLight.shadow.camera.top=t,this.dirLight.shadow.camera.bottom=-t,this.scene.add(this.dirLight.target),this.scene.add(this.dirLight),this.sunMesh=null,this.scene.add(this.buildStarfield()),this.onResize=this.onResize.bind(this),window.addEventListener("resize",this.onResize)}createRenderer(e){const t=[{ctor:oc,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!0}},{ctor:oc,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!1}},{ctor:oc,opts:{antialias:!1,canvas:e,logarithmicDepthBuffer:!1}},{ctor:void 0,opts:{antialias:!0,canvas:e,logarithmicDepthBuffer:!1}}];for(let i=0;i<t.length;i++){const{ctor:r,opts:s}=t[i];try{return new r(s)}catch(a){console.warn(`WebGL init failed (attempt ${i+1})`,a)}}throw new Error("WebGL context could not be created. Enable WebGL/hardware acceleration or try a different browser/XR emulator configuration.")}buildStarfield(){const t=new Float32Array(3600);for(let s=0;s<1200;s++){const a=90+Math.random()*60,o=Math.random()*Math.PI*2,l=Math.random()*2-1,c=Math.acos(l),d=Math.sin(c);t[s*3]=a*d*Math.cos(o),t[s*3+1]=a*Math.cos(c),t[s*3+2]=a*d*Math.sin(o)}const i=new Jt;i.setAttribute("position",new It(t,3));const r=new _m({color:8246268,size:.5,sizeAttenuation:!0,transparent:!0,opacity:.7});return new Fv(i,r)}onResize(){const{innerWidth:e,innerHeight:t}=window;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.controls.handleResize()}update(e=!0){e&&this.controls&&this.controls.update(),this.renderer.render(this.scene,this.camera)}getSunDir(){return this.dirLight.position.clone().normalize()}}const jf=()=>({forward:!1,backward:!1,left:!1,right:!1,up:!1,down:!1,run:!1,rollLeft:!1,rollRight:!1}),Sc=new Set(["flyToggle","jump","exit","surface"]);class TT{constructor(e=document){this.target=e,this.state=jf(),this.once=new Set,this.lookDelta={x:0,y:0},this.mode="desktop",this.lookMode="orbit"}setMode(e){this.mode=e}setLookMode(e){this.lookMode=e}consume(e){if(!Sc.has(e))return!1;const t=this.once.has(e);return t&&this.once.delete(e),t}setAction(e,t){e in this.state?this.state[e]=!!t:Sc.has(e)&&t&&this.once.add(e)}trigger(e){Sc.has(e)&&this.once.add(e)}addLookDelta(e,t){this.lookDelta.x+=e,this.lookDelta.y+=t}consumeLookDelta(){const{x:e,y:t}=this.lookDelta;return this.lookDelta.x=0,this.lookDelta.y=0,{x:e,y:t}}getState(){return this.state}clear(){this.state=jf(),this.once.clear(),this.lookDelta={x:0,y:0}}dispose(){}}function AT(n,e){const t=Math.cos(n);return{x:t*Math.cos(e),y:Math.sin(n),z:t*Math.sin(e)}}function Mc(n,e,t,i){const r=Dn(n)*(i-1),s=Dn(1-e)*(i-1),a=Math.floor(r),o=Math.floor(s),l=Math.min(i-1,a+1),c=Math.min(i-1,o+1),d=r-a,h=s-o,f=t[o*i+a],p=t[o*i+l],g=t[c*i+a],x=t[c*i+l],m=f*(1-d)+p*d,u=g*(1-d)+x*d,y=m*(1-h)+u*h;return Number.isFinite(y)?y:0}function CT(n,e,t){const i=Math.abs(n.x),r=Math.abs(n.y),s=Math.abs(n.z),a=i+r+s+1e-6,o=i/a,l=r/a,c=s/a,d={u:n.z*.5+.5,v:n.y*.5+.5},h={u:n.x*.5+.5,v:n.z*.5+.5},f={u:n.x*.5+.5,v:n.y*.5+.5},p=Mc(d.u,d.v,e,t),g=Mc(h.u,h.v,e,t),x=Mc(f.u,f.v,e,t);return p*o+g*l+x*c}function M0({heightmap:n,size:e,seaLevel:t,gridWidth:i,gridHeight:r}){const s=i*r,a=new Float32Array(s*4);for(let o=0;o<r;o++){const c=((o+.5)/r-.5)*Math.PI;for(let d=0;d<i;d++){const f=((d+.5)/i-.5)*Math.PI*2,p=AT(c,f),g=CT(p,n,e),x=g<t?1:0,m=x?0:Dn((g-t)/Math.max(1e-6,1-t)),u=(o*i+d)*4;a[u+0]=x,a[u+1]=m,a[u+2]=g,a[u+3]=0}}return a}const RT=256,PT=128;function Kf(n,e,t){const i=new ti(n,e,t,St,Lt);return i.needsUpdate=!0,i.wrapS=Tn,i.wrapT=pt,i.minFilter=it,i.magFilter=it,i.generateMipmaps=!1,i.colorSpace=Bt,i}class Ad{constructor({gridWidth:e=RT,gridHeight:t=PT}={}){this.gridWidth=e,this.gridHeight=t,this.cellCount=e*t,this.enabled=!1,this.ready=!1,this.device=null,this.pipeline=null,this.bindGroups=null,this.uniformBuffer=null,this.uniformData=new Float32Array(32),this.stateBuffers=null,this.surfaceBuffer=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.readbackVersion=0,this.ping=0,this.hasSurface=!1,this.simTimeS=0,this.timeScale=1200,this.readbackIntervalS=.15,this.readbackTimerS=0,this.evapStrength=1,this.precipStrength=1,this.windStrength=1,this.oceanInertia=.25,this.moistureLayers=2,this.planetRadiusM=5e5,this.textureData=new Uint8Array(this.cellCount*4),this.weatherTexture=Kf(this.textureData,e,t),this.auxTextureData=new Uint8Array(this.cellCount*4),this.weatherAuxTexture=Kf(this.auxTextureData,e,t)}setConfig({timeScale:e,readbackIntervalS:t,evapStrength:i,precipStrength:r,windStrength:s,oceanInertia:a,moistureLayers:o}={}){Number.isFinite(e)&&(this.timeScale=Math.max(0,e)),Number.isFinite(t)&&(this.readbackIntervalS=Math.max(.01,t)),Number.isFinite(i)&&(this.evapStrength=Math.max(0,i)),Number.isFinite(r)&&(this.precipStrength=Math.max(0,r)),Number.isFinite(s)&&(this.windStrength=Math.max(0,s)),Number.isFinite(a)&&(this.oceanInertia=Dn(a)),Number.isFinite(o)&&(this.moistureLayers=Math.max(1,Math.min(4,Math.round(o))))}static async create(e={}){const{device:t,...i}=e,r=new Ad(i);return await r.init({device:t}),r}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[WaterCycleSystem] WebGPU not available; weather simulation disabled."),this.enabled=!1;return}const o=await navigator.gpu.requestAdapter();if(!o){console.warn("[WaterCycleSystem] No GPU adapter found; weather simulation disabled."),this.enabled=!1;return}this.device=await o.requestDevice(),this.enabled=!0}const t=this.device,i=48,r=16,s=8;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.stateBuffers=[t.createBuffer({size:this.cellCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.cellCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.surfaceBuffer=t.createBuffer({size:this.cellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.outputBuffer=t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:this.cellCount*s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})];const a=t.createShaderModule({code:this._wgsl()});this.pipeline=t.createComputePipeline({layout:"auto",compute:{module:a,entryPoint:"main"}}),this.bindGroups=[t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.stateBuffers[0]}},{binding:2,resource:{buffer:this.stateBuffers[1]}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]}),t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:this.stateBuffers[1]}},{binding:2,resource:{buffer:this.stateBuffers[0]}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:this.outputBuffer}}]})],this.ready=!0}getTexture(){return this.weatherTexture}getAuxTexture(){return this.weatherAuxTexture}setPlanetSurface({heightmap:e,size:t,seaLevel:i,planetRadiusM:r}){if(!this.enabled||!this.ready||!e||!t)return;this.planetRadiusM=r??this.planetRadiusM;const s=M0({heightmap:e,size:t,seaLevel:i,gridWidth:this.gridWidth,gridHeight:this.gridHeight}),a=new Float32Array(this.cellCount*12),o=288,l=8e3,c=(h,f)=>{const p=Math.sin(h*127.1+f*311.7)*43758.5453123;return p-Math.floor(p)};for(let h=0;h<this.gridHeight;h++){const p=((h+.5)/this.gridHeight-.5)*Math.PI,g=Math.abs(Math.sin(p));for(let x=0;x<this.gridWidth;x++){const m=h*this.gridWidth+x,u=s[m*4+0],y=s[m*4+1],b=y*l,v=(c(x,h)-.5)*2,M=o-55*g-b*.0065+v*1.2,S=this._qsApprox(M),E=(u?.94:.65)*S,A=E*.85,w=A*.72,_=w*.55,R=u?25e-5*(1-g):5e-5*(1-g)*(1-y),U=v*700+Math.sin(p*3)*250,L=10*Math.sin(p*2);a[m*12+0]=M,a[m*12+1]=E,a[m*12+2]=R,a[m*12+3]=0,a[m*12+4]=U,a[m*12+5]=L,a[m*12+6]=0,a[m*12+7]=u?1:.25,a[m*12+8]=A,a[m*12+9]=w,a[m*12+10]=_,a[m*12+11]=0}}const d=this.device;d.queue.writeBuffer(this.surfaceBuffer,0,s),d.queue.writeBuffer(this.stateBuffers[0],0,a),d.queue.writeBuffer(this.stateBuffers[1],0,a);for(let h=0;h<this.cellCount;h++){const f=a[h*12+0],p=a[h*12+2],g=a[h*12+4],x=a[h*12+5],m=a[h*12+6],u=a[h*12+7],y=Dn(p*600),b=Dn(.5+g*(1/6e3)),v=Dn(u);this.textureData[h*4+0]=Math.round(y*255),this.textureData[h*4+1]=0,this.textureData[h*4+2]=Math.round(b*255),this.textureData[h*4+3]=Math.round(v*255);const M=Dn((f-240)/70),S=Dn(.5+x*(1/120)),E=Dn(.5+m*(1/120));this.auxTextureData[h*4+0]=Math.round(M*255),this.auxTextureData[h*4+1]=0,this.auxTextureData[h*4+2]=Math.round(S*255),this.auxTextureData[h*4+3]=Math.round(E*255)}this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.simTimeS=0,this.ping=0,this.hasSurface=!0}update(e,t,i={}){if(!this.enabled||!this.ready||!this.hasSurface)return;const r=Math.min(Math.max(e??0,0),.25),s=Number.isFinite(i.dtSimOverride)?i.dtSimOverride:r*this.timeScale,a=Math.min(Math.max(s,0),900);if(a<=0)return;this.simTimeS+=a,this.readbackTimerS+=r,this._writeUniforms(a,this.simTimeS,t);const o=this.device,l=o.createCommandEncoder(),c=l.beginComputePass();c.setPipeline(this.pipeline),c.setBindGroup(0,this.bindGroups[this.ping]),c.dispatchWorkgroups(Math.ceil(this.gridWidth/8),Math.ceil(this.gridHeight/8)),c.end();let d=null;if(!!i.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const f=this.readbackWriteIndex&1;this.readbackInFlight[f]||(l.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[f],0,this.cellCount*8),d=f,this.readbackWriteIndex++,this.readbackTimerS=0)}o.queue.submit([l.finish()]),d!==null&&this._scheduleReadback(d),this.ping=1-this.ping}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange(),r=new Uint8Array(i),s=this.cellCount*4;this.textureData.set(r.subarray(0,s)),this.auxTextureData.set(r.subarray(s,s*2)),t.unmap(),this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.readbackVersion++}).catch(i=>{console.warn("[WaterCycleSystem] Readback failed",i)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e,t,i){const r=this.uniformData;r[0]=this.gridWidth,r[1]=this.gridHeight,r[2]=e,r[3]=t,r[4]=this.planetRadiusM,r[5]=2*Math.PI/86400,r[6]=288,r[7]=.0065,r[8]=8e3,r[9]=8e3,r[10]=.0098,r[11]=this.moistureLayers,r[12]=(i==null?void 0:i.x)??0,r[13]=(i==null?void 0:i.y)??1,r[14]=(i==null?void 0:i.z)??0,r[15]=0,r[16]=18,r[17]=1/21600,r[18]=3e-5*this.evapStrength,r[19]=12e-6*this.evapStrength,r[20]=1/1800,r[21]=1/1200*this.precipStrength,r[22]=1/1800,r[23]=1/3600,r[24]=1/7200*this.windStrength,r[25]=1/14400,r[26]=2e-5,r[27]=60*this.windStrength,r[28]=120,r[29]=45e3,r[30]=1/7200,r[31]=this.oceanInertia,this.device.queue.writeBuffer(this.uniformBuffer,0,r)}_qsApprox(e){const t=e-273.15,r=6.112*Math.exp(17.67*t/(t+243.5))*100;return .622*r/Math.max(101325-r,1)}_wgsl(){return`
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
        `}}const DT=256,IT=128,LT=8;function Ec(n,e,t,{wrapS:i=pt,wrapT:r=pt,minFilter:s=Dt,magFilter:a=Dt}={}){const o=new ti(n,e,t,St,Lt);return o.needsUpdate=!0,o.wrapS=i,o.wrapT=r,o.minFilter=s,o.magFilter=a,o.generateMipmaps=!1,o.colorSpace=Bt,o}function UT(n){const e=Math.max(1,Math.ceil(Math.sqrt(n))),t=Math.max(1,Math.ceil(n/e));return{tilesX:e,tilesY:t,atlasW:e*n,atlasH:t*n}}class Cd{constructor({volumeN:e=LT,surfaceW:t=DT,surfaceH:i=IT}={}){this.volumeN=Math.max(1,Math.min(192,Math.round(e))),this.surfaceW=Math.max(8,Math.min(1024,Math.round(t))),this.surfaceH=Math.max(8,Math.min(1024,Math.round(i))),this.voxelCount=this.volumeN*this.volumeN*this.volumeN,this.surfaceCellCount=this.surfaceW*this.surfaceH;const r=UT(this.volumeN);this.tilesX=r.tilesX,this.tilesY=r.tilesY,this.atlasW=r.atlasW,this.atlasH=r.atlasH,this.atlasPixelCount=this.atlasW*this.atlasH,this.weatherW=this.surfaceW,this.weatherH=this.surfaceH,this.weatherCellCount=this.weatherW*this.weatherH,this.weatherOffset=this.atlasPixelCount,this.auxOffset=this.atlasPixelCount+this.weatherCellCount,this.totalOutPixels=this.atlasPixelCount+this.weatherCellCount*2,this.enabled=!1,this.ready=!1,this.device=null,this.pipelineSim=null,this.pipelineCollapse=null,this.bindGroupLayout=null,this.bindGroupsSim=null,this.bindGroupsCollapse=null,this.uniformBuffer=null,this.uniformData=new Float32Array(48),this.stateBuffers=null,this.surfaceBuffer=null,this.surfaceStateBuffers=null,this.outputBuffer=null,this.readbackBuffers=null,this.readbackInFlight=[!1,!1],this.readbackWriteIndex=0,this.readbackVersion=0,this.ping=0,this.hasSurface=!1,this.simTimeS=0,this.timeScale=1200,this.readbackIntervalS=.15,this.readbackTimerS=0,this.evapStrength=1,this.precipStrength=1,this.windStrength=1,this.windShear=.6,this.surfaceDrag=.4,this.oceanInertia=.25,this.planetRadiusM=5e5,this.atmoThicknessM=2e4,this.mountainHeightM=8e3,this.volumeTextureData=new Uint8Array(this.atlasPixelCount*4),this.volumeAtlasTexture=Ec(this.volumeTextureData,this.atlasW,this.atlasH,{wrapS:pt,wrapT:pt,minFilter:Dt,magFilter:Dt}),this.weatherTextureData=new Uint8Array(this.weatherCellCount*4),this.weatherTexture=Ec(this.weatherTextureData,this.weatherW,this.weatherH,{wrapS:Tn,wrapT:pt,minFilter:it,magFilter:it}),this.auxTextureData=new Uint8Array(this.weatherCellCount*4),this.weatherAuxTexture=Ec(this.auxTextureData,this.weatherW,this.weatherH,{wrapS:Tn,wrapT:pt,minFilter:it,magFilter:it})}static async create(e={}){const{device:t,...i}=e,r=new Cd(i);return await r.init({device:t}),r}setConfig({timeScale:e,readbackIntervalS:t,evapStrength:i,precipStrength:r,windStrength:s,oceanInertia:a,atmoThicknessM:o,windShear:l,surfaceDrag:c}={}){Number.isFinite(e)&&(this.timeScale=Math.max(0,e)),Number.isFinite(t)&&(this.readbackIntervalS=Math.max(.01,t)),Number.isFinite(i)&&(this.evapStrength=Math.max(0,i)),Number.isFinite(r)&&(this.precipStrength=Math.max(0,r)),Number.isFinite(s)&&(this.windStrength=Math.max(0,s)),Number.isFinite(a)&&(this.oceanInertia=Dn(a)),Number.isFinite(o)&&(this.atmoThicknessM=Math.max(1e3,o)),Number.isFinite(l)&&(this.windShear=Math.max(0,l)),Number.isFinite(c)&&(this.surfaceDrag=Math.max(0,c))}getVolumeTexture(){return this.volumeAtlasTexture}getVolumeMeta(){return{n:this.volumeN,tilesX:this.tilesX,tilesY:this.tilesY,atlasW:this.atlasW,atlasH:this.atlasH,extentM:this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,planetRadiusM:this.planetRadiusM,atmoThicknessM:this.atmoThicknessM}}getTexture(){return this.weatherTexture}getAuxTexture(){return this.weatherAuxTexture}async init({device:e}={}){if(e)this.device=e,this.enabled=!0;else{if(typeof navigator>"u"||!navigator.gpu){console.warn("[WaterCycleVolumeSystem] WebGPU not available; volume weather disabled."),this.enabled=!1;return}const h=await navigator.gpu.requestAdapter();if(!h){console.warn("[WaterCycleVolumeSystem] No GPU adapter found; volume weather disabled."),this.enabled=!1;return}this.device=await h.requestDevice(),this.enabled=!0}const t=this.device,i=32,r=16,s=16,a=this.totalOutPixels*4;this.uniformBuffer=t.createBuffer({size:this.uniformData.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.stateBuffers=[t.createBuffer({size:this.voxelCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.voxelCount*i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.surfaceBuffer=t.createBuffer({size:this.surfaceCellCount*r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.surfaceStateBuffers=[t.createBuffer({size:this.weatherCellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),t.createBuffer({size:this.weatherCellCount*s,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})],this.outputBuffer=t.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.readbackBuffers=[t.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ})],this.bindGroupLayout=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:6,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]});const o=t.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),l=t.createShaderModule({code:this._wgslSim()}),c=t.createShaderModule({code:this._wgslCollapse()});this.pipelineSim=t.createComputePipeline({layout:o,compute:{module:l,entryPoint:"main"}}),this.pipelineCollapse=t.createComputePipeline({layout:o,compute:{module:c,entryPoint:"main"}});const d=({volumeSrc:h,volumeDst:f,surfaceStateSrc:p,surfaceStateDst:g})=>t.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:{buffer:h}},{binding:2,resource:{buffer:f}},{binding:3,resource:{buffer:this.surfaceBuffer}},{binding:4,resource:{buffer:p}},{binding:5,resource:{buffer:g}},{binding:6,resource:{buffer:this.outputBuffer}}]});this.bindGroupsSim=[d({volumeSrc:this.stateBuffers[0],volumeDst:this.stateBuffers[1],surfaceStateSrc:this.surfaceStateBuffers[0],surfaceStateDst:this.surfaceStateBuffers[1]}),d({volumeSrc:this.stateBuffers[1],volumeDst:this.stateBuffers[0],surfaceStateSrc:this.surfaceStateBuffers[1],surfaceStateDst:this.surfaceStateBuffers[0]})],this.bindGroupsCollapse=[d({volumeSrc:this.stateBuffers[1],volumeDst:this.stateBuffers[0],surfaceStateSrc:this.surfaceStateBuffers[0],surfaceStateDst:this.surfaceStateBuffers[1]}),d({volumeSrc:this.stateBuffers[0],volumeDst:this.stateBuffers[1],surfaceStateSrc:this.surfaceStateBuffers[1],surfaceStateDst:this.surfaceStateBuffers[0]})],this.ready=!0}setPlanetSurface({heightmap:e,size:t,seaLevel:i,planetRadiusM:r}={}){if(!this.enabled||!this.ready||!(e&&t&&Number.isFinite(i)))return;Number.isFinite(r)&&(this.planetRadiusM=Math.max(1,r)),this.seaLevel=Dn(i);const s=M0({heightmap:e,size:t,seaLevel:this.seaLevel,gridWidth:this.surfaceW,gridHeight:this.surfaceH});this.device.queue.writeBuffer(this.surfaceBuffer,0,s),this._resetState(),this.hasSurface=!0}_resetState(){const e=this.volumeN,t=this.voxelCount,i=8,r=new Float32Array(t*i),s=(this.seaLevel-.5)*this.mountainHeightM,a=this.planetRadiusM+s,o=this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,c=2*o/Math.max(e,1)*.5,d=288,h=.0065,f=8e3,p=m=>{const u=m-273.15,b=6.112*Math.exp(17.67*u/(u+243.5))*100;return .622*b/Math.max(101325-b,1)};let g=0;for(let m=0;m<e;m++){const y=((m+.5)/e*2-1)*o;for(let b=0;b<e;b++){const M=((b+.5)/e*2-1)*o;for(let S=0;S<e;S++){const A=((S+.5)/e*2-1)*o,w=Math.hypot(A,M,y),_=w-a;let R=0,U=0;if(w>.001){const L=A/w,O=M/w,V=y/w,k=c*(Math.abs(L)+Math.abs(O)+Math.abs(V)),H=_-k;if(_+k>0&&H<this.atmoThicknessM){const Y=Math.min(Math.max(H,0),this.atmoThicknessM),ne=Math.abs(O);R=d-55*ne-h*Y;const oe=p(R),ge=Y<2e3?.85:.55;U=oe*ge*Math.exp(-Y/(f*1.25)),Y<2e3&&(r[g+2]=oe*.02)}}r[g+0]=R,r[g+1]=U,r[g+2]=0,r[g+3]=0,r[g+4]=0,r[g+5]=0,r[g+6]=0,r[g+7]=0,g+=i}}}const x=new Float32Array(this.weatherCellCount*4);for(let m=0;m<this.weatherCellCount;m++)x[m*4+0]=.15,x[m*4+1]=0,x[m*4+2]=0,x[m*4+3]=0;this.device.queue.writeBuffer(this.stateBuffers[0],0,r),this.device.queue.writeBuffer(this.stateBuffers[1],0,r),this.device.queue.writeBuffer(this.surfaceStateBuffers[0],0,x),this.device.queue.writeBuffer(this.surfaceStateBuffers[1],0,x),this.simTimeS=0,this.readbackTimerS=0,this.ping=0,this.lastDiag={maxCloud:0,maxRain:0}}update(e,t,i={}){if(!this.enabled||!this.ready||!this.hasSurface)return;const r=Math.min(Math.max(e??0,0),.25),s=Number.isFinite(i.dtSimOverride)?i.dtSimOverride:r*this.timeScale;let a=Math.max(s,0);if(a<=0)return;const l=2*(this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM)/Math.max(this.volumeN,1),c=Math.max(5,60*this.windStrength),d=.25*l/c,f=Math.max(.5,Math.min(10,d)),p=64;this.readbackTimerS+=r;const g=this.device,x=g.createCommandEncoder();let m=0;for(;a>0&&m<p;){const b=Math.min(a,f);if(b<=0)break;a-=b,this.simTimeS+=b,this._writeUniforms(b,this.simTimeS,t);{const v=x.beginComputePass();v.setPipeline(this.pipelineSim),v.setBindGroup(0,this.bindGroupsSim[this.ping]);const M=4;v.dispatchWorkgroups(Math.ceil(this.volumeN/M),Math.ceil(this.volumeN/M),Math.ceil(this.volumeN/M)),v.end()}{const v=x.beginComputePass();v.setPipeline(this.pipelineCollapse),v.setBindGroup(0,this.bindGroupsCollapse[this.ping]),v.dispatchWorkgroups(Math.ceil(this.weatherW/8),Math.ceil(this.weatherH/8)),v.end()}this.ping=1-this.ping,m++}let u=null;if(!!i.forceReadback||this.readbackTimerS>=this.readbackIntervalS){const b=this.readbackWriteIndex&1;this.readbackInFlight[b]||(x.copyBufferToBuffer(this.outputBuffer,0,this.readbackBuffers[b],0,this.totalOutPixels*4),u=b,this.readbackWriteIndex++,this.readbackTimerS=0)}g.queue.submit([x.finish()]),u!==null&&this._scheduleReadback(u)}_scheduleReadback(e){this.readbackInFlight[e]=!0;const t=this.readbackBuffers[e];this.device.queue.onSubmittedWorkDone().then(async()=>{await t.mapAsync(GPUMapMode.READ);const i=t.getMappedRange(),r=new Uint8Array(i),s=this.atlasPixelCount*4,a=this.weatherCellCount*4;this.volumeTextureData.set(r.subarray(0,s)),this.weatherTextureData.set(r.subarray(s,s+a)),this.auxTextureData.set(r.subarray(s+a,s+a*2));let o=0,l=0;for(let c=0;c<s;c+=4)this.volumeTextureData[c]>o&&(o=this.volumeTextureData[c]),this.volumeTextureData[c+1]>l&&(l=this.volumeTextureData[c+1]);this.lastDiag.maxCloud=o/255,this.lastDiag.maxRain=l/255,t.unmap(),this.volumeAtlasTexture.needsUpdate=!0,this.weatherTexture.needsUpdate=!0,this.weatherAuxTexture.needsUpdate=!0,this.readbackVersion++}).catch(i=>{console.warn("[WaterCycleVolumeSystem] Readback failed",i)}).finally(()=>{this.readbackInFlight[e]=!1})}_writeUniforms(e,t,i){const r=this.uniformData,s=this.planetRadiusM+this.atmoThicknessM+this.mountainHeightM,a=this.volumeN/Math.max(2*s,1e-6),o=Math.max(1,this.volumeN/32);r[0]=this.volumeN,r[1]=this.volumeN,r[2]=this.volumeN,r[3]=e,r[4]=t,r[5]=s,r[6]=a,r[7]=this.planetRadiusM,r[8]=this.atmoThicknessM,r[9]=288,r[10]=.0065,r[11]=8e3,r[12]=(i==null?void 0:i.x)??0,r[13]=(i==null?void 0:i.y)??1,r[14]=(i==null?void 0:i.z)??0,r[15]=2*Math.PI/86400,r[16]=18,r[17]=1/21600;const l=Math.pow(o,3);r[18]=45e-5*this.evapStrength*l,r[19]=16e-5*this.evapStrength*l,r[20]=1/200*l;const c=1/24e4,d=Math.pow(o,3);r[21]=c*this.precipStrength/d,r[22]=1/259200,r[23]=1/259200,r[24]=1/2400*this.windStrength,r[25]=1/7200,r[26]=2e-5,r[27]=60*this.windStrength,r[28]=120,r[29]=45e3,r[30]=1/1800,r[31]=.05/l,r[32]=this.surfaceW,r[33]=this.surfaceH,r[34]=this.weatherW,r[35]=this.weatherH,r[36]=this.atlasW,r[37]=this.atlasH,r[38]=this.tilesX,r[39]=this.tilesY,r[40]=this.weatherOffset,r[41]=this.auxOffset,r[42]=this.oceanInertia,r[43]=0,r[44]=this.mountainHeightM,r[45]=(this.seaLevel-.5)*this.mountainHeightM,r[46]=this.windShear,r[47]=this.surfaceDrag,this.device.queue.writeBuffer(this.uniformBuffer,0,r)}_wgslSim(){return`
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
        `}}const Qf=(()=>{const n=new Uint8Array([0,0,0,0]),e=new ti(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=Tn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Bt,e})();class NT{constructor(e,{maxDrops:t=12e3}={}){this.scene=e,this.maxDrops=Math.max(0,Math.floor(t)),this.enabled=!0,this.uniforms={time:{value:0},color:{value:new Se("#bfe8ff")},opacity:{value:.55},strength:{value:1},density:{value:.65},rainThreshold:{value:.03},volumeRadius:{value:.012},volumeHeight:{value:.012},fallDistance:{value:.016},fallSpeed:{value:.35},dropLength:{value:25e-5},dropWidth:{value:5e-5},planetNearRadius:{value:12},nearMargin:{value:.35},weatherMap:{value:Qf},planetInvRot:{value:new Ue},planetInvScale:{value:1},windWorld:{value:new D(0,0,0)},windTilt:{value:.65}},this.mesh=this._buildMesh(),this.mesh.visible=this.enabled,this.mesh.frustumCulled=!1,this.mesh.renderOrder=1.2,e.add(this.mesh)}dispose(){var e,t;this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(t=(e=this.mesh.material).dispose)==null||t.call(e),this.mesh=null)}setEnabled(e){this.enabled=!!e,this.mesh&&(this.mesh.visible=this.enabled)}setWeatherMap(e){this.uniforms.weatherMap.value=e??Qf}setWeatherFrame({planetInvRot:e,planetInvScale:t}){e&&this.uniforms.planetInvRot.value.copy(e),Number.isFinite(t)&&(this.uniforms.planetInvScale.value=t)}setWindWorld(e){e&&this.uniforms.windWorld.value.copy(e)}setPlanetNearRadius(e){Number.isFinite(e)&&(this.uniforms.planetNearRadius.value=Math.max(.1,e))}setStrength(e){Number.isFinite(e)&&(this.uniforms.strength.value=Math.max(0,e))}setDensity(e){Number.isFinite(e)&&(this.uniforms.density.value=Math.min(Math.max(e,0),1))}setSizes({volumeRadius:e,volumeHeight:t,fallDistance:i,dropLength:r,dropWidth:s}={}){Number.isFinite(e)&&(this.uniforms.volumeRadius.value=Math.max(0,e)),Number.isFinite(t)&&(this.uniforms.volumeHeight.value=Math.max(0,t)),Number.isFinite(i)&&(this.uniforms.fallDistance.value=Math.max(0,i)),Number.isFinite(r)&&(this.uniforms.dropLength.value=Math.max(0,r)),Number.isFinite(s)&&(this.uniforms.dropWidth.value=Math.max(0,s))}update(e){if(!this.enabled||!this.mesh)return;const t=Math.min(Math.max(e??0,0),.25);this.uniforms.time.value+=t}_buildMesh(){const e=new Ss(1,1,1,1),t=new Em;t.index=e.index,t.attributes.position=e.attributes.position,t.attributes.uv=e.attributes.uv;const i=new Float32Array(this.maxDrops*3),r=new Float32Array(this.maxDrops);for(let a=0;a<this.maxDrops;a++){const o=a*3;i[o+0]=Math.random()*2-1,i[o+1]=Math.random(),i[o+2]=Math.random()*2-1,r[a]=Math.random()}t.setAttribute("aOffset",new Wo(i,3)),t.setAttribute("aSeed",new Wo(r,1)),t.instanceCount=this.maxDrops;const s=new Vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,depthTest:!0,side:Ln,blending:Zn,vertexShader:`
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
            `});return e.dispose(),new Gt(t,s)}}class FT{constructor(e){this.planetGroup=e,this.mesh=null,this.enabled=!0,this.visible=!0,this.gridLat=32,this.gridLon=64,this.totalVectors=this.gridLat*this.gridLon,this.tailLength=.08,this.tailWidth=2,this.heightOffset=.02,this.maxWind=60,this.weatherTexture=null,this.weatherAuxTexture=null,this.planetRadius=1,this._initGeometry()}_initGeometry(){const e=new Float32Array(this.totalVectors*2*3),t=new Float32Array(this.totalVectors*2*3);let i=0;for(let a=0;a<this.gridLat;a++){const o=((a+.5)/this.gridLat-.5)*Math.PI,l=Math.cos(o),c=Math.sin(o);for(let d=0;d<this.gridLon;d++){const h=((d+.5)/this.gridLon-.5)*Math.PI*2,f=Math.cos(h),p=Math.sin(h),g=l*f,x=c,m=l*p,u=i*6;e[u+0]=g,e[u+1]=x,e[u+2]=m,e[u+3]=g,e[u+4]=x,e[u+5]=m,t[u+0]=.5,t[u+1]=.5,t[u+2]=.5,t[u+3]=.5,t[u+4]=.5,t[u+5]=.5,i++}}const r=new Jt;r.setAttribute("position",new It(e,3)),r.setAttribute("color",new It(t,3));const s=new od({vertexColors:!0,linewidth:this.tailWidth,transparent:!0,opacity:.9,depthTest:!0,depthWrite:!1});this.mesh=new bm(r,s),this.mesh.renderOrder=100,this.mesh.frustumCulled=!1,this.planetGroup.add(this.mesh)}setWeatherTextures(e,t){this.weatherTexture=e,this.weatherAuxTexture=t}setPlanetRadius(e){this.planetRadius=e}setConfig({tailLength:e,gridLat:t,gridLon:i,heightOffset:r,enabled:s,visible:a}={}){typeof e=="number"&&(this.tailLength=e),typeof r=="number"&&(this.heightOffset=r),typeof s=="boolean"&&(this.enabled=s),typeof a=="boolean"&&(this.visible=a,this.mesh&&(this.mesh.visible=a)),(t&&t!==this.gridLat||i&&i!==this.gridLon)&&(this.gridLat=t||this.gridLat,this.gridLon=i||this.gridLon,this.totalVectors=this.gridLat*this.gridLon,this._rebuildGeometry())}_rebuildGeometry(){this.mesh&&(this.planetGroup.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose()),this._initGeometry()}_sampleTexture(e,t,i){var f;if(!((f=e==null?void 0:e.image)!=null&&f.data))return{r:128,g:128,b:128,a:128};const r=e.image.data,s=e.image.width,a=e.image.height,o=Math.max(0,Math.min(1,t)),l=Math.max(0,Math.min(1,i)),c=Math.floor(o*(s-1)),h=(Math.floor(l*(a-1))*s+c)*4;return{r:r[h]||0,g:r[h+1]||0,b:r[h+2]||0,a:r[h+3]||0}}update(){var a,o,l,c;if(!this.enabled||!this.mesh||!this.visible||!((o=(a=this.weatherTexture)==null?void 0:a.image)!=null&&o.data)||!((c=(l=this.weatherAuxTexture)==null?void 0:l.image)!=null&&c.data))return;const e=this.mesh.geometry.attributes.position.array,t=this.mesh.geometry.attributes.color.array,i=this.planetRadius*(1+this.heightOffset),r=this.planetRadius*this.tailLength;let s=0;for(let d=0;d<this.gridLat;d++){const h=((d+.5)/this.gridLat-.5)*Math.PI,f=Math.cos(h),p=Math.sin(h),g=(d+.5)/this.gridLat;for(let x=0;x<this.gridLon;x++){const m=((x+.5)/this.gridLon-.5)*Math.PI*2,u=Math.cos(m),y=Math.sin(m),b=(x+.5)/this.gridLon,v=f*u,M=p,S=f*y,A=this._sampleTexture(this.weatherTexture,b,g).b/255,w=this._sampleTexture(this.weatherAuxTexture,b,g),_=(w.b/255-.5)*2,R=(w.a/255-.5)*2,U=-y,L=0,O=u,V=-p*u,k=f,H=-p*y,z=Math.sqrt(_*_+R*R);let Y=U*_+V*R,ne=L*_+k*R,le=O*_+H*R;const oe=Math.sqrt(Y*Y+ne*ne+le*le);oe>.001&&(Y/=oe,ne/=oe,le/=oe);const ge=s*6;e[ge+0]=v*i,e[ge+1]=M*i,e[ge+2]=S*i;const X=r*Math.max(.3,z);e[ge+3]=v*i+Y*X,e[ge+4]=M*i+ne*X,e[ge+5]=S*i+le*X;let K,ie,ee;if(A<.5){const fe=A*2;K=1,ie=fe,ee=fe}else{const fe=(A-.5)*2;K=1-fe,ie=1-fe,ee=1}const ve=.4+z*.6;K*=ve,ie*=ve,ee*=ve,t[ge+0]=K,t[ge+1]=ie,t[ge+2]=ee,t[ge+3]=K,t[ge+4]=ie,t[ge+5]=ee,s++}}this.mesh.geometry.attributes.position.needsUpdate=!0,this.mesh.geometry.attributes.color.needsUpdate=!0}setVisible(e){this.visible=e,this.mesh&&(this.mesh.visible=e)}dispose(){this.mesh&&(this.planetGroup.remove(this.mesh),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.mesh=null)}}class BT{constructor(e,t={}){this.planetGroup=e,this.currentMesh=null,this.waveMesh=null,this.enabled=!0,this.visible=!0,this.gridLat=t.gridLat??24,this.gridLon=t.gridLon??48,this.totalVectors=this.gridLat*this.gridLon,this.currentTailLength=.06,this.waveTailLength=.045,this.heightOffset=.015,this.maxCurrent=60,this.maxWave=1,this.showCurrents=!0,this.showWaves=!0,this.oceanTexture=null,this.weatherTexture=null,this.windField=null,this.windFieldW=0,this.windFieldH=0,this.planetRadius=1,this._initGeometry()}_initGeometry(){this._disposeGeometry(),this.currentMesh=this._createLineMesh(.85),this.waveMesh=this._createLineMesh(.9),this.currentMesh.visible=!1,this.waveMesh.visible=!1,this.planetGroup.add(this.currentMesh),this.planetGroup.add(this.waveMesh)}_disposeGeometry(){this.currentMesh&&(this.planetGroup.remove(this.currentMesh),this.currentMesh.geometry.dispose(),this.currentMesh.material.dispose()),this.waveMesh&&(this.planetGroup.remove(this.waveMesh),this.waveMesh.geometry.dispose(),this.waveMesh.material.dispose()),this.currentMesh=null,this.waveMesh=null}_createLineMesh(e){const t=new Float32Array(this.totalVectors*2*3),i=new Float32Array(this.totalVectors*2*3),r=new Jt;r.setAttribute("position",new It(t,3)),r.setAttribute("color",new It(i,3));const s=new od({vertexColors:!0,transparent:!0,opacity:e,depthTest:!0,depthWrite:!1}),a=new bm(r,s);return a.frustumCulled=!1,a.renderOrder=100,a}setOceanTexture(e){this.oceanTexture=e}setWeatherTexture(e){this.weatherTexture=e}setWindField(e,t,i){this.windField=e,this.windFieldW=t||0,this.windFieldH=i||0}setPlanetRadius(e){Number.isFinite(e)&&e>0&&(this.planetRadius=e)}setConfig({showCurrents:e,showWaves:t,currentTailLength:i,waveTailLength:r,heightOffset:s,maxCurrent:a,maxWave:o,gridLat:l,gridLon:c,visible:d}={}){typeof e=="boolean"&&(this.showCurrents=e),typeof t=="boolean"&&(this.showWaves=t),Number.isFinite(i)&&(this.currentTailLength=Math.max(.01,i)),Number.isFinite(r)&&(this.waveTailLength=Math.max(.01,r)),Number.isFinite(s)&&(this.heightOffset=Math.max(0,s)),Number.isFinite(a)&&(this.maxCurrent=Math.max(.1,a)),Number.isFinite(o)&&(this.maxWave=Math.max(.1,o)),typeof d=="boolean"&&(this.visible=d);const h=Number.isFinite(l)?Math.max(4,Math.floor(l)):this.gridLat,f=Number.isFinite(c)?Math.max(4,Math.floor(c)):this.gridLon;(h!==this.gridLat||f!==this.gridLon)&&(this.gridLat=h,this.gridLon=f,this.totalVectors=this.gridLat*this.gridLon,this._initGeometry()),this.currentMesh&&(this.currentMesh.visible=this.visible&&this.showCurrents),this.waveMesh&&(this.waveMesh.visible=this.visible&&this.showWaves)}_sampleWindField(e,t){if(!this.windField||!this.windFieldW||!this.windFieldH)return[0,0];const i=Math.min(this.windFieldW-1,Math.max(0,Math.floor(e*this.windFieldW))),s=(Math.min(this.windFieldH-1,Math.max(0,Math.floor(t*this.windFieldH)))*this.windFieldW+i)*2;return[this.windField[s]||0,this.windField[s+1]||0]}_sampleOceanNormal(e,t){var h,f,p,g,x,m;const i=(f=(h=this.oceanTexture)==null?void 0:h.image)==null?void 0:f.data,r=((g=(p=this.oceanTexture)==null?void 0:p.image)==null?void 0:g.width)??0,s=((m=(x=this.oceanTexture)==null?void 0:x.image)==null?void 0:m.height)??0;if(!i||!r||!s)return[0,0];const a=Math.min(r-1,Math.max(0,Math.floor(e*r))),l=(Math.min(s-1,Math.max(0,Math.floor(t*s)))*r+a)*4,c=((i[l+1]??128)/255-.5)*2,d=((i[l+2]??128)/255-.5)*2;return[c,d]}_samplePressure(e,t){var c,d,h,f,p,g;const i=(d=(c=this.weatherTexture)==null?void 0:c.image)==null?void 0:d.data,r=((f=(h=this.weatherTexture)==null?void 0:h.image)==null?void 0:f.width)??0,s=((g=(p=this.weatherTexture)==null?void 0:p.image)==null?void 0:g.height)??0;if(!i||!r||!s)return .5;const a=Math.min(r-1,Math.max(0,Math.floor(e*r))),l=(Math.min(s-1,Math.max(0,Math.floor(t*s)))*r+a)*4;return(i[l+2]??128)/255}update(){if(!this.enabled||!this.visible)return;const e=this.showCurrents&&this.currentMesh,t=this.showWaves&&this.waveMesh;if(!e&&!t)return;const i=e?this.currentMesh.geometry.attributes.position.array:null,r=e?this.currentMesh.geometry.attributes.color.array:null,s=t?this.waveMesh.geometry.attributes.position.array:null,a=t?this.waveMesh.geometry.attributes.color.array:null,o=this.planetRadius*(1+this.heightOffset),l=this.planetRadius*this.currentTailLength,c=this.planetRadius*this.waveTailLength;let d=0;for(let h=0;h<this.gridLat;h++){const f=((h+.5)/this.gridLat-.5)*Math.PI,p=Math.cos(f),g=Math.sin(f),x=(h+.5)/this.gridLat;for(let m=0;m<this.gridLon;m++){const u=((m+.5)/this.gridLon-.5)*Math.PI*2,y=Math.cos(u),b=Math.sin(u),v=(m+.5)/this.gridLon,M=p*y,S=g,E=p*b,A=-b,w=0,_=y,R=-g*y,U=p,L=-g*b,O=d*6,V=this._samplePressure(v,x);if(e&&i&&r){const[k,H]=this._sampleWindField(v,x),z=Math.hypot(k,H);let Y=A*k+R*H,ne=w*k+U*H,le=_*k+L*H;const oe=Math.hypot(Y,ne,le);oe>1e-6?(Y/=oe,ne/=oe,le/=oe):(Y=0,ne=0,le=0);const ge=Math.min(z/this.maxCurrent,1),X=l*Math.max(.15,ge);i[O+0]=M*o,i[O+1]=S*o,i[O+2]=E*o,i[O+3]=M*o+Y*X,i[O+4]=S*o+ne*X,i[O+5]=E*o+le*X;let K,ie,ee;if(V<.5){const fe=V*2;K=1,ie=fe,ee=fe}else{const fe=(V-.5)*2;K=1-fe,ie=1-fe,ee=1}const ve=.35+ge*.65;K*=ve,ie*=ve,ee*=ve,r[O+0]=K,r[O+1]=ie,r[O+2]=ee,r[O+3]=K,r[O+4]=ie,r[O+5]=ee}if(t&&s&&a){const[k,H]=this._sampleOceanNormal(v,x),z=Math.hypot(k,H);let Y=A*k+R*H,ne=w*k+U*H,le=_*k+L*H;const oe=Math.hypot(Y,ne,le);oe>1e-6?(Y/=oe,ne/=oe,le/=oe):(Y=0,ne=0,le=0);const ge=Math.min(z/this.maxWave,1),X=c*Math.max(.1,ge);s[O+0]=M*o,s[O+1]=S*o,s[O+2]=E*o,s[O+3]=M*o+Y*X,s[O+4]=S*o+ne*X,s[O+5]=E*o+le*X;let K,ie,ee;if(V<.5){const fe=V*2;K=1,ie=fe,ee=fe}else{const fe=(V-.5)*2;K=1-fe,ie=1-fe,ee=1}const ve=.25+ge*.75;K*=ve,ie*=ve,ee*=ve,a[O+0]=K,a[O+1]=ie,a[O+2]=ee,a[O+3]=K,a[O+4]=ie,a[O+5]=ee}d++}}e&&(this.currentMesh.geometry.attributes.position.needsUpdate=!0,this.currentMesh.geometry.attributes.color.needsUpdate=!0),t&&(this.waveMesh.geometry.attributes.position.needsUpdate=!0,this.waveMesh.geometry.attributes.color.needsUpdate=!0)}setVisible(e){this.visible=e,this.currentMesh&&(this.currentMesh.visible=e&&this.showCurrents),this.waveMesh&&(this.waveMesh.visible=e&&this.showWaves)}dispose(){this._disposeGeometry()}}const OT=60;function fo(n,e){return(n/255-.5)*2*e}function zT(n,e,t,i={}){const r=n==null?void 0:n.image,s=r==null?void 0:r.data,a=(r==null?void 0:r.width)??0,o=(r==null?void 0:r.height)??0,l=Number.isFinite(i.maxWind)?i.maxWind:OT,c=Number.isFinite(i.scale)?i.scale:1;if(!s||!a||!o||!e||!t)return null;const d=e*t,h=i.out&&i.out.length>=d*2?i.out:new Float32Array(d*2);if(a===e&&o===t){for(let f=0;f<d;f++){const p=f*4;h[f*2]=fo(s[p+2]??0,l)*c,h[f*2+1]=fo(s[p+3]??0,l)*c}return h}for(let f=0;f<t;f++){const p=(f+.5)/t;for(let g=0;g<e;g++){const x=(g+.5)/e,m=S0(n,x,p),u=(f*e+g)*2;h[u]=fo(m.b??0,l)*c,h[u+1]=fo(m.a??0,l)*c}}return h}const kT=["px","nx","py","ny","pz","nz"],E0=6,GT=E0;function VT(n,e={}){const t=Math.max(2,Math.floor(Number(n)||2)),i=Math.max(1,Math.floor(Number(e.channels)||1)),r=Array.from({length:E0},(s,a)=>({index:a,name:kT[a],resolution:t,channels:i,data:new Float32Array(t*t*i)}));return{resolution:t,channels:i,faces:r}}function HT(n){const e=Math.floor(Number(n)||0);return Math.min(Math.max(e,4),256)}function Hs(n,e){const t=n*n;return Array.from({length:GT},()=>new Float32Array(t*e))}function WT(n={}){const e=HT(n.resolution??32),t=VT(e,{channels:1});return{resolution:e,cellCount:e*e,grid:t,velocity:Hs(e,2),temperature:Hs(e,1),salinity:Hs(e,1),pressure:Hs(e,1),surfaceFlux:Hs(e,2)}}class qT{constructor(e){this.callbacks=e||{},this.els={hud:document.getElementById("hud"),hudToggle:document.getElementById("hudToggle"),hudContent:document.getElementById("hudContent"),status:document.getElementById("status"),preset:document.getElementById("preset"),regenBtn:document.getElementById("regen"),resolution:document.getElementById("resolution"),plates:document.getElementById("plates"),plateSizeVariance:document.getElementById("plateSizeVariance"),jitter:document.getElementById("jitter"),heightScale:document.getElementById("heightScale"),iterations:document.getElementById("iterations"),erosionRate:document.getElementById("erosionRate"),evaporation:document.getElementById("evaporation"),seaLevel:document.getElementById("seaLevel"),smoothPasses:document.getElementById("smoothPasses"),subdivisions:document.getElementById("subdivisions"),iceCap:document.getElementById("iceCap"),plateDelta:document.getElementById("plateDelta"),faultType:document.getElementById("faultType"),desymmetrizeTiling:document.getElementById("desymmetrizeTiling"),atmosphere:document.getElementById("atmosphere"),waterShader:document.getElementById("waterShader"),waterShader:document.getElementById("waterShader"),jitterValue:document.getElementById("jitterValue"),heightScaleValue:document.getElementById("heightScaleValue"),erosionRateValue:document.getElementById("erosionRateValue"),evaporationValue:document.getElementById("evaporationValue"),seaLevelValue:document.getElementById("seaLevelValue"),smoothPassesValue:document.getElementById("smoothPassesValue"),subdivisionsValue:document.getElementById("subdivisionsValue"),iceCapValue:document.getElementById("iceCapValue"),plateDeltaValue:document.getElementById("plateDeltaValue"),plateSizeVarianceValue:document.getElementById("plateSizeVarianceValue"),atmosphereValue:document.getElementById("atmosphereValue"),atmosphereHeight:document.getElementById("atmosphereHeight"),atmosphereHeightValue:document.getElementById("atmosphereHeightValue"),atmosphereToggle:document.getElementById("atmosphereToggle"),atmosphereAlpha:document.getElementById("atmosphereAlpha"),atmosphereAlphaValue:document.getElementById("atmosphereAlphaValue"),atmosphereColor:document.getElementById("atmosphereColor"),cloudToggle:document.getElementById("cloudToggle"),cloudAlpha:document.getElementById("cloudAlpha"),cloudAlphaValue:document.getElementById("cloudAlphaValue"),cloudSpeed:document.getElementById("cloudSpeed"),cloudSpeedValue:document.getElementById("cloudSpeedValue"),cloudQuantity:document.getElementById("cloudQuantity"),cloudQuantityValue:document.getElementById("cloudQuantityValue"),cloudHeight:document.getElementById("cloudHeight"),cloudHeightValue:document.getElementById("cloudHeightValue"),cloudColor:document.getElementById("cloudColor"),cloudResolution:document.getElementById("cloudResolution"),cloudResolutionValue:document.getElementById("cloudResolutionValue"),cloudShader:document.getElementById("cloudShader"),cloudLayers:document.getElementById("cloudLayers"),addCloudLayerBtn:document.getElementById("addCloudLayer"),movePad:document.getElementById("movePad"),lookPad:document.getElementById("lookPad"),mobileControls:document.getElementById("mobileControls"),surfaceOnlyBtn:document.getElementById("surfaceOnly"),configToggle:document.getElementById("configToggle"),configPanel:document.getElementById("configPanel"),vrToggle:document.getElementById("vrToggle"),reticle:document.getElementById("reticle"),leftStickSensitivity:document.getElementById("leftStickSensitivity"),leftStickSensitivityValue:document.getElementById("leftStickSensitivityValue"),lookSensitivityX:document.getElementById("lookSensitivityX"),lookSensitivityXValue:document.getElementById("lookSensitivityXValue"),lookSensitivityY:document.getElementById("lookSensitivityY"),lookSensitivityYValue:document.getElementById("lookSensitivityYValue"),invertLook:document.getElementById("invertLook"),planetDiameter:document.getElementById("planetDiameter"),planetDiameterValue:document.getElementById("planetDiameterValue")},this.cloudLayerSettings=[],this.setStatus=this.setStatus.bind(this),this.bindEvents(),this.updateRangeLabels(),this.renderCloudLayerControls()}getPlanetDiameterKm(){var t;const e=parseFloat((t=this.els.planetDiameter)==null?void 0:t.value);return ae(Number.isFinite(e)?e:Gi,1,1e3)}applyPreset(e){const t=$o[e]||$o.balanced;if(this.els.preset&&(this.els.preset.value=e),this.els.atmosphereToggle&&t.atmosphereEnabled!==void 0&&(this.els.atmosphereToggle.checked=!!t.atmosphereEnabled),this.els.cloudToggle){const i=t.cloudEnabled!==void 0?!!t.cloudEnabled:!1;this.els.cloudToggle.checked=i}this.els.resolution&&(this.els.resolution.value=t.resolution),this.els.plates&&(this.els.plates.value=t.numPlates),this.els.plateSizeVariance&&(this.els.plateSizeVariance.value=t.plateSizeVariance??.35),this.els.desymmetrizeTiling&&(this.els.desymmetrizeTiling.checked=t.desymmetrizeTiling??!0),this.els.jitter&&(this.els.jitter.value=t.jitter),this.els.heightScale&&(this.els.heightScale.value=t.heightScale),this.els.iterations&&(this.els.iterations.value=t.iterations),this.els.erosionRate&&(this.els.erosionRate.value=t.erosionRate),this.els.evaporation&&(this.els.evaporation.value=t.evaporation),this.els.seaLevel&&(this.els.seaLevel.value=t.seaLevel??.53),this.els.atmosphere&&(this.els.atmosphere.value=t.atmosphere??.35),this.els.atmosphereHeight&&(this.els.atmosphereHeight.value=t.atmosphereHeight??.5),this.els.atmosphereAlpha&&(this.els.atmosphereAlpha.value=t.atmosphereAlpha??1),this.els.atmosphereColor&&(this.els.atmosphereColor.value=t.atmosphereColor||"#4da8ff"),this.els.smoothPasses&&(this.els.smoothPasses.value=t.smoothPasses??20),this.els.subdivisions&&(this.els.subdivisions.value=t.subdivisions??60),this.els.iceCap&&(this.els.iceCap.value=t.iceCap??.15),this.els.plateDelta&&(this.els.plateDelta.value=t.plateDelta??1.25),this.els.faultType&&(this.els.faultType.value=t.faultType||"ridge"),this.els.cloudAlpha&&t.cloudAlpha!==void 0&&(this.els.cloudAlpha.value=t.cloudAlpha),this.els.cloudSpeed&&t.cloudSpeed!==void 0&&(this.els.cloudSpeed.value=t.cloudSpeed),this.els.cloudQuantity&&t.cloudQuantity!==void 0&&(this.els.cloudQuantity.value=t.cloudQuantity),this.els.cloudHeight&&t.cloudHeight!==void 0&&(this.els.cloudHeight.value=t.cloudHeight),this.els.cloudColor&&t.cloudColor!==void 0&&(this.els.cloudColor.value=t.cloudColor),this.els.cloudResolution&&t.cloudResolution!==void 0&&(this.els.cloudResolution.value=t.cloudResolution),this.els.cloudShader&&t.cloudShader!==void 0&&(this.els.cloudShader.value=t.cloudShader),this.els.waterShader&&(this.els.waterShader.value=t.waterShader||(e==="fast"?"fast":"balanced")),this.updateRangeLabels()}readSettings(){var e,t,i,r,s,a,o,l,c,d,h,f,p,g,x,m,u,y,b,v;return{resolution:ae(parseInt((e=this.els.resolution)==null?void 0:e.value,10)||256,64,4096),numPlates:ae(parseInt((t=this.els.plates)==null?void 0:t.value,10)||7,1,30),plateSizeVariance:ae(parseFloat((i=this.els.plateSizeVariance)==null?void 0:i.value)||0,0,2),desymmetrizeTiling:!!((r=this.els.desymmetrizeTiling)!=null&&r.checked),jitter:ae(parseFloat((s=this.els.jitter)==null?void 0:s.value)||.5,0,1),iterations:ae(parseInt((a=this.els.iterations)==null?void 0:a.value,10)||5e4,1e3,2e6),erosionRate:ae(parseFloat((o=this.els.erosionRate)==null?void 0:o.value)||.1,.001,2),evaporation:ae(parseFloat((l=this.els.evaporation)==null?void 0:l.value)||.02,0,2),heightScale:ae(parseFloat((c=this.els.heightScale)==null?void 0:c.value)||2,0,80),seaLevel:ae(parseFloat((d=this.els.seaLevel)==null?void 0:d.value)||.5,0,1),atmosphere:ae(parseFloat((h=this.els.atmosphere)==null?void 0:h.value)||.35,.05,1.5),atmosphereHeight:ae(parseFloat((f=this.els.atmosphereHeight)==null?void 0:f.value)||.5,0,5),atmosphereAlpha:ae(parseFloat((p=this.els.atmosphereAlpha)==null?void 0:p.value)||1,0,1),atmosphereColor:((g=this.els.atmosphereColor)==null?void 0:g.value)||"#4da8ff",smoothPasses:Math.round(ae(parseFloat((x=this.els.smoothPasses)==null?void 0:x.value)||0,0,40)),subdivisions:Math.round(ae(parseFloat((m=this.els.subdivisions)==null?void 0:m.value)||128,0,512)),iceCap:ae(parseFloat((u=this.els.iceCap)==null?void 0:u.value)||.1,0,1),plateDelta:ae(parseFloat((y=this.els.plateDelta)==null?void 0:y.value)||1.25,0,2),faultType:((b=this.els.faultType)==null?void 0:b.value)||"ridge",radius:un,waterShader:((v=this.els.waterShader)==null?void 0:v.value)||"balanced"}}writeSettings(e){e&&(this.els.resolution&&(this.els.resolution.value=e.resolution),this.els.plates&&(this.els.plates.value=e.numPlates),this.els.plateSizeVariance&&(this.els.plateSizeVariance.value=e.plateSizeVariance),this.els.desymmetrizeTiling&&(this.els.desymmetrizeTiling.checked=!!e.desymmetrizeTiling),this.els.jitter&&(this.els.jitter.value=e.jitter),this.els.iterations&&(this.els.iterations.value=e.iterations),this.els.erosionRate&&(this.els.erosionRate.value=e.erosionRate),this.els.evaporation&&(this.els.evaporation.value=e.evaporation),this.els.heightScale&&(this.els.heightScale.value=e.heightScale),this.els.seaLevel&&(this.els.seaLevel.value=e.seaLevel),this.els.atmosphere&&(this.els.atmosphere.value=e.atmosphere),this.els.atmosphereHeight&&(this.els.atmosphereHeight.value=e.atmosphereHeight),this.els.atmosphereAlpha&&(this.els.atmosphereAlpha.value=e.atmosphereAlpha),this.els.atmosphereColor&&(this.els.atmosphereColor.value=e.atmosphereColor),this.els.smoothPasses&&(this.els.smoothPasses.value=e.smoothPasses),this.els.subdivisions&&(this.els.subdivisions.value=e.subdivisions),this.els.iceCap&&(this.els.iceCap.value=e.iceCap),this.els.plateDelta&&(this.els.plateDelta.value=e.plateDelta),this.els.faultType&&(this.els.faultType.value=e.faultType),this.els.waterShader&&(this.els.waterShader.value=e.waterShader||"balanced"),this.updateRangeLabels())}bindEvents(){if([this.els.resolution,this.els.plates,this.els.plateSizeVariance,this.els.desymmetrizeTiling,this.els.jitter,this.els.heightScale,this.els.iterations,this.els.erosionRate,this.els.evaporation,this.els.seaLevel,this.els.atmosphere,this.els.smoothPasses,this.els.subdivisions,this.els.iceCap,this.els.plateDelta,this.els.faultType,this.els.waterShader].forEach(r=>{if(!r)return;const s=()=>{this.updateRangeLabels(),this.callbacks.onRegen&&this.callbacks.onRegen()};r.addEventListener("input",s),r.addEventListener("change",s)}),this.els.regenBtn&&this.els.regenBtn.addEventListener("click",()=>{this.callbacks.onRegen&&this.callbacks.onRegen()}),this.els.preset&&this.els.preset.addEventListener("change",()=>{this.callbacks.onPreset&&this.callbacks.onPreset(this.els.preset.value)}),this.els.planetDiameter){const r=()=>{this.updateRangeLabels(),this.callbacks.onDiameterChange&&this.callbacks.onDiameterChange(this.getPlanetDiameterKm())};this.els.planetDiameter.addEventListener("input",r),this.els.planetDiameter.addEventListener("change",r)}[this.els.atmosphere,this.els.atmosphereAlpha,this.els.atmosphereColor,this.els.atmosphereToggle].forEach(r=>{r&&(r.addEventListener(r.type==="color"?"input":"change",()=>{this.updateRangeLabels(),this.callbacks.onAtmosphereUpdate&&this.callbacks.onAtmosphereUpdate()}),r.type==="range"&&r.addEventListener("input",()=>{this.updateRangeLabels(),this.callbacks.onAtmosphereUpdate&&this.callbacks.onAtmosphereUpdate()}))}),[this.els.cloudToggle,this.els.cloudAlpha,this.els.cloudSpeed,this.els.cloudQuantity,this.els.cloudHeight,this.els.cloudColor,this.els.cloudResolution,this.els.cloudShader].forEach(r=>{r&&(r.addEventListener(r.type==="color"?"input":"change",()=>{this.updateRangeLabels(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),r.type==="range"&&r.addEventListener("input",()=>{this.updateRangeLabels(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}))}),this.els.addCloudLayerBtn&&this.els.addCloudLayerBtn.addEventListener("click",()=>{const r=this.getBaseCloudSettings(),s=this.cloudLayerSettings.length?this.cloudLayerSettings[this.cloudLayerSettings.length-1].height:r.height,a={...r,id:`extra-${Date.now()}`,height:s+.3};this.cloudLayerSettings.push(a),this.renderCloudLayerControls(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),this.els.hudToggle&&this.els.hudToggle.addEventListener("click",()=>{this.setHudCollapsed(!this.els.hud.classList.contains("collapsed"))}),this.els.configToggle&&this.els.configToggle.addEventListener("click",()=>this.toggleConfigPanel()),this.els.vrToggle&&this.els.vrToggle.addEventListener("click",()=>{this.callbacks.onVRToggle&&this.callbacks.onVRToggle()}),[this.els.leftStickSensitivity,this.els.lookSensitivityX,this.els.lookSensitivityY].forEach(r=>{r&&r.addEventListener("input",()=>this.updateRangeLabels())}),this.els.invertLook&&this.els.invertLook.addEventListener("change",()=>this.updateRangeLabels())}setStatus(e){var t;(t=this.els)!=null&&t.status&&(this.els.status.textContent=e)}setHudCollapsed(e){!this.els.hud||!this.els.hudToggle||!this.els.hudContent||(this.els.hud.classList.toggle("collapsed",e),this.els.hudToggle.setAttribute("aria-expanded",(!e).toString()),this.els.hudContent.setAttribute("aria-hidden",e.toString()),this.els.hudToggle.textContent=e?"Show controls":"Hide controls")}toggleConfigPanel(e){if(!this.els.configPanel||!this.els.configToggle)return;const t=e??this.els.configPanel.style.display!=="block";this.els.configPanel.style.display=t?"block":"none",this.els.configToggle.setAttribute("aria-expanded",t.toString()),this.els.reticle&&t&&(this.els.reticle.style.display="none")}syncMobileVisibility(e,t){if(!this.els.mobileControls)return;if(!e){this.els.mobileControls.style.display="none",this.els.reticle&&(this.els.reticle.style.display="none");return}this.els.mobileControls.style.display="block",this.els.movePad&&(this.els.movePad.style.display=t?"grid":"none"),this.els.lookPad&&(this.els.lookPad.style.display=t?"grid":"none");const i=this.els.mobileControls.querySelector(".action-column");i&&(i.style.display=t?"grid":"none"),this.els.surfaceOnlyBtn&&(this.els.surfaceOnlyBtn.style.display=t?"none":"inline-flex"),this.els.reticle&&(this.els.reticle.style.display="block")}updateRangeLabels(){const e=this.els;e.jitterValue&&(e.jitterValue.textContent=Number(e.jitter.value).toFixed(2)),e.heightScaleValue&&(e.heightScaleValue.textContent=Number(e.heightScale.value).toFixed(2)),e.erosionRateValue&&(e.erosionRateValue.textContent=Number(e.erosionRate.value).toFixed(2)),e.evaporationValue&&(e.evaporationValue.textContent=Number(e.evaporation.value).toFixed(3)),e.seaLevelValue&&(e.seaLevelValue.textContent=Number(e.seaLevel.value).toFixed(2)),e.atmosphereValue&&(e.atmosphereValue.textContent=Number(e.atmosphere.value).toFixed(2)),e.atmosphereHeightValue&&(e.atmosphereHeightValue.textContent=Number(e.atmosphereHeight.value).toFixed(2)),e.smoothPassesValue&&(e.smoothPassesValue.textContent=Number(e.smoothPasses.value).toFixed(0)),e.subdivisionsValue&&(e.subdivisionsValue.textContent=Number(e.subdivisions.value).toFixed(0)),e.iceCapValue&&(e.iceCapValue.textContent=Number(e.iceCap.value).toFixed(2)),e.plateDeltaValue&&(e.plateDeltaValue.textContent=Number(e.plateDelta.value).toFixed(2)),e.plateSizeVarianceValue&&(e.plateSizeVarianceValue.textContent=Number(e.plateSizeVariance.value).toFixed(2)),e.atmosphereAlphaValue&&(e.atmosphereAlphaValue.textContent=Number(e.atmosphereAlpha.value).toFixed(2)),e.cloudAlphaValue&&(e.cloudAlphaValue.textContent=Number(e.cloudAlpha.value).toFixed(2)),e.cloudSpeedValue&&(e.cloudSpeedValue.textContent=Number(e.cloudSpeed.value).toFixed(2)),e.cloudQuantityValue&&(e.cloudQuantityValue.textContent=Number(e.cloudQuantity.value).toFixed(2)),e.cloudHeightValue&&(e.cloudHeightValue.textContent=Number(e.cloudHeight.value).toFixed(2)),e.cloudResolutionValue&&(e.cloudResolutionValue.textContent=Number(e.cloudResolution.value).toFixed(0)),e.planetDiameter&&e.planetDiameterValue&&(e.planetDiameterValue.textContent=Number(e.planetDiameter.value).toFixed(0)),e.leftStickSensitivity&&e.leftStickSensitivityValue&&(e.leftStickSensitivityValue.textContent=Number(e.leftStickSensitivity.value).toFixed(1)),e.lookSensitivityX&&e.lookSensitivityXValue&&(e.lookSensitivityXValue.textContent=Number(e.lookSensitivityX.value).toFixed(1)),e.lookSensitivityY&&e.lookSensitivityYValue&&(e.lookSensitivityYValue.textContent=Number(e.lookSensitivityY.value).toFixed(1))}readSettings(){var t;const e=this.els;return{resolution:ae(parseInt(e.resolution.value,10)||256,64,4096),numPlates:ae(parseInt(e.plates.value,10)||9,4,400),plateSizeVariance:ae(parseFloat(e.plateSizeVariance.value)||0,0,2),desymmetrizeTiling:!!((t=e.desymmetrizeTiling)!=null&&t.checked),jitter:ae(parseFloat(e.jitter.value)||.5,0,1),iterations:ae(parseInt(e.iterations.value,10)||5e4,1e3,2e6),erosionRate:ae(parseFloat(e.erosionRate.value)||.1,.001,2),evaporation:ae(parseFloat(e.evaporation.value)||.02,0,2),heightScale:ae(parseFloat(e.heightScale.value)||2,0,80),seaLevel:ae(parseFloat(e.seaLevel.value)||.5,0,1),atmosphere:ae(parseFloat(e.atmosphere.value)||.35,.05,1.5),atmosphereHeight:ae(parseFloat(e.atmosphereHeight.value)||.5,0,5),atmosphereAlpha:ae(parseFloat(e.atmosphereAlpha.value)||1,0,1),atmosphereColor:e.atmosphereColor.value||"#4da8ff",atmosphereEnabled:e.atmosphereToggle.checked,smoothPasses:Math.round(ae(parseFloat(e.smoothPasses.value)||0,0,40)),subdivisions:Math.round(ae(parseFloat(e.subdivisions.value)||128,0,512)),iceCap:ae(parseFloat(e.iceCap.value)||.1,0,1),plateDelta:ae(parseFloat(e.plateDelta.value)||1.25,0,2),faultType:e.faultType.value||"ridge",radius:un,planetDiameterKm:this.getPlanetDiameterKm()}}writeSettings(e){const t=this.els;t.resolution.value=e.resolution,t.plates.value=e.numPlates,t.plateSizeVariance.value=e.plateSizeVariance,t.desymmetrizeTiling&&(t.desymmetrizeTiling.checked=!!e.desymmetrizeTiling),t.jitter.value=e.jitter,t.iterations.value=e.iterations,t.erosionRate.value=e.erosionRate,t.evaporation.value=e.evaporation,t.heightScale.value=e.heightScale,t.seaLevel.value=e.seaLevel,t.atmosphere.value=e.atmosphere,t.atmosphereHeight.value=e.atmosphereHeight,t.atmosphereAlpha.value=e.atmosphereAlpha,t.atmosphereColor.value=e.atmosphereColor,t.smoothPasses.value=e.smoothPasses,t.subdivisions.value=e.subdivisions,t.iceCap.value=e.iceCap,t.plateDelta.value=e.plateDelta,t.faultType.value=e.faultType,this.updateRangeLabels()}getPlanetDiameterKm(){if(!this.els.planetDiameter)return Gi;const e=parseFloat(this.els.planetDiameter.value);return ae(Number.isFinite(e)?e:Gi,1,1e3)}getBaseCloudSettings(){return{id:"base",enabled:this.els.cloudToggle.checked,alpha:ae(parseFloat(this.els.cloudAlpha.value)||.74,0,1),speed:ae(parseFloat(this.els.cloudSpeed.value)||.9,0,2),quantity:ae(parseFloat(this.els.cloudQuantity.value)||.76,0,1),height:ae(parseFloat(this.els.cloudHeight.value)||-2.4,-5,5),color:this.els.cloudColor.value||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(this.els.cloudResolution.value)||256)),mode:this.els.cloudShader.value||"billow"}}createCloudLayerControls(e){const t=document.createElement("div");t.className="layer",t.style.border="1px solid var(--border)",t.style.padding="8px",t.style.marginBottom="8px";const i={alpha:"Opacity of this cloud layer.",speed:"Animation speed for this cloud layer.",quantity:"Coverage and density for this cloud layer.",height:"Altitude offset for this cloud layer.",resolution:"Texture resolution for this cloud layer."},r=document.createElement("div");r.textContent=`Layer ${e.label||this.cloudLayerSettings.length+1}`,r.style.fontSize="12px",r.style.color="var(--muted)",t.appendChild(r);const s=(x,m,u,y,b)=>{const v=document.createElement("div");v.className="field";const M=document.createElement("label");M.textContent=x,i[m]&&(M.title=i[m]);const S=document.createElement("div");S.className="range-row";const E=document.createElement("input");E.type="range",E.min=u,E.max=y,E.step=b,E.value=e[m],i[m]&&(E.title=i[m]);const A=document.createElement("span");return A.className="value",A.textContent=Number(e[m]).toFixed(b<1?2:0),S.appendChild(E),S.appendChild(A),v.appendChild(M),v.appendChild(S),E.addEventListener("input",()=>{e[m]=parseFloat(E.value),A.textContent=Number(e[m]).toFixed(b<1?2:0),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),v},a=document.createElement("label"),o=document.createElement("input");o.type="checkbox",o.checked=e.enabled,o.title="Enable this cloud layer.",o.addEventListener("change",()=>{e.enabled=o.checked,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),a.appendChild(o),a.append(" Layer enabled"),t.appendChild(a),t.appendChild(s("Alpha","alpha",0,1,.01)),t.appendChild(s("Speed","speed",0,2,.05)),t.appendChild(s("Quantity","quantity",0,1,.01)),t.appendChild(s("Height","height",-5,5,.05)),t.appendChild(s("Resolution","resolution",1,256,1));const l=document.createElement("div");l.className="field";const c=document.createElement("label");c.textContent="Shader";const d=document.createElement("select");d.title="Noise type used to generate this layer.",["fbm","billow","cellular"].forEach(x=>{const m=document.createElement("option");m.value=x,m.textContent=x.charAt(0).toUpperCase()+x.slice(1),e.mode===x&&(m.selected=!0),d.appendChild(m)}),d.addEventListener("change",()=>{e.mode=d.value,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),l.appendChild(c),l.appendChild(d),t.appendChild(l);const h=document.createElement("div");h.className="field";const f=document.createElement("label");f.textContent="Color";const p=document.createElement("input");p.type="color",p.value=e.color,p.title="Tint for this cloud layer.",p.addEventListener("input",()=>{e.color=p.value,this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),h.appendChild(f),h.appendChild(p),t.appendChild(h);const g=document.createElement("button");return g.type="button",g.textContent="Remove layer",g.addEventListener("click",()=>{this.cloudLayerSettings=this.cloudLayerSettings.filter(x=>x!==e),this.renderCloudLayerControls(),this.callbacks.onCloudUpdate&&this.callbacks.onCloudUpdate()}),t.appendChild(g),t}renderCloudLayerControls(){if(this.els.cloudLayers){this.els.cloudLayers.innerHTML="";for(const e of this.cloudLayerSettings)this.els.cloudLayers.appendChild(this.createCloudLayerControls(e))}}getLeftStickSensitivity(){var t;const e=parseFloat((t=this.els.leftStickSensitivity)==null?void 0:t.value);return Number.isFinite(e)?e:1}getLookSensitivityX(){var t;const e=parseFloat((t=this.els.lookSensitivityX)==null?void 0:t.value);return Number.isFinite(e)?e:.4}getLookSensitivityY(){var t;const e=parseFloat((t=this.els.lookSensitivityY)==null?void 0:t.value);return Number.isFinite(e)?e:.4}isInvertLook(){var e;return!!((e=this.els.invertLook)!=null&&e.checked)}bindMobileControls(e,t){if(!this.els.mobileControls||!this.els.movePad||!this.els.lookPad)return;const i=(a,o)=>e==null?void 0:e.setAction(a,o),r=a=>e==null?void 0:e.trigger(a),s=(a,o,l)=>{let c=!1,d=null;const h=()=>{d=a.getBoundingClientRect()},f=g=>{d||h();const x=g.touches?g.touches[0]:g,m=x.clientX-d.left-d.width/2,u=x.clientY-d.top-d.height/2,y=Math.min(d.width,d.height)/2,b=Math.max(-y,Math.min(y,m)),v=Math.max(-y,Math.min(y,u)),M=b/y,S=v/y;o(M,S)},p=()=>{c=!1,l()};a.addEventListener("pointerdown",g=>{g.preventDefault(),c=!0,h(),f(g)}),window.addEventListener("pointermove",g=>{c&&(g.preventDefault(),f(g))}),window.addEventListener("pointerup",g=>{c&&(g.preventDefault(),p())}),a.addEventListener("touchstart",g=>{c=!0,h(),f(g)},{passive:!1}),a.addEventListener("touchmove",g=>{c&&f(g)},{passive:!1}),a.addEventListener("touchend",g=>{c&&p()},{passive:!1}),a.addEventListener("touchcancel",g=>{c&&p()},{passive:!1})};s(this.els.movePad,(a,o)=>{const l=Math.max(.1,this.getLeftStickSensitivity()),c=Math.max(.1,.25/l);i("forward",o<-c),i("backward",o>c),i("left",a<-c),i("right",a>c)},()=>{i("forward",!1),i("backward",!1),i("left",!1),i("right",!1)}),s(this.els.lookPad,(a,o)=>{const l=Math.max(.1,this.getLookSensitivityX()),c=Math.max(.1,this.getLookSensitivityY()),d=this.isInvertLook()?-1:1;e==null||e.addLookDelta(a*6*l,o*6*c*d)},()=>{}),this.els.mobileControls.querySelectorAll("[data-trigger]").forEach(a=>{const o=a.getAttribute("data-trigger"),l=()=>{r(o),o==="surface"&&t&&t()};a.addEventListener("pointerdown",c=>{c.preventDefault(),l()}),a.addEventListener("touchstart",c=>{c.preventDefault(),l()},{passive:!1})}),this.els.mobileControls.querySelectorAll(".action-btn[data-action]").forEach(a=>{const o=a.getAttribute("data-action"),l=()=>i(o,!0),c=()=>i(o,!1);a.addEventListener("pointerdown",d=>{d.preventDefault(),l()}),a.addEventListener("pointerup",d=>{d.preventDefault(),c()}),a.addEventListener("pointerleave",c),a.addEventListener("pointercancel",c),a.addEventListener("touchstart",d=>{d.preventDefault(),l()},{passive:!1}),a.addEventListener("touchend",d=>{d.preventDefault(),c()},{passive:!1}),a.addEventListener("touchcancel",d=>{d.preventDefault(),c()},{passive:!1})}),this.els.surfaceOnlyBtn&&(this.els.surfaceOnlyBtn.addEventListener("pointerdown",a=>{a.preventDefault(),r("surface"),t&&t()}),this.els.surfaceOnlyBtn.addEventListener("touchstart",a=>{a.preventDefault(),r("surface"),t&&t()},{passive:!1}))}}class XT{constructor(e,{maxSprites:t=1200}={}){this.scene=e,this.maxSprites=Math.max(16,Math.floor(t)),this.enabled=!0,this.center=new D,this.uniforms={time:{value:0},windWorld:{value:new D(0,0,0)},color:{value:new Se("#d3ecff")},opacity:{value:.85},radius:{value:12},height:{value:6},speed:{value:1.4}},this.mesh=this._buildMesh(),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}dispose(){var e,t;this.mesh&&(this.scene.remove(this.mesh),this.mesh.geometry.dispose(),(t=(e=this.mesh.material).dispose)==null||t.call(e),this.mesh=null)}setEnabled(e){this.enabled=!!e,this.mesh&&(this.mesh.visible=this.enabled)}setWind(e){e&&this.uniforms.windWorld.value.copy(e)}setCenter(e){!e||!this.mesh||(this.center.copy(e),this.mesh.position.copy(e))}update(e){if(!this.enabled||!this.mesh)return;const t=Math.min(Math.max(e??0,0),.25);this.uniforms.time.value+=t}_buildMesh(){const e=new Ss(.35,.08),t=new Em;t.index=e.index,t.attributes.position=e.attributes.position,t.attributes.uv=e.attributes.uv;const i=new Float32Array(this.maxSprites*3),r=new Float32Array(this.maxSprites);for(let o=0;o<this.maxSprites;o++){const l=o*3;i[l+0]=Math.random()*2-1,i[l+1]=Math.random(),i[l+2]=Math.random()*2-1,r[o]=Math.random()}t.setAttribute("aOffset",new Wo(i,3)),t.setAttribute("aSeed",new Wo(r,1)),t.instanceCount=this.maxSprites;const s=new Vt({uniforms:this.uniforms,transparent:!0,depthWrite:!1,depthTest:!1,blending:Oo,side:Ln,vertexShader:`
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
            `}),a=new Gt(t,s);return a.renderOrder=1.25,a}}const $T=document.getElementById("viewport"),Zf=document.getElementById("hud");document.getElementById("hudToggle");document.getElementById("hudContent");document.getElementById("status");const er=document.getElementById("preset"),ku=document.getElementById("regen"),sl=document.getElementById("helpToggle"),Tc=document.getElementById("helpPanel"),Jf=document.getElementById("helpContent"),ep=document.getElementById("resolution"),tp=document.getElementById("plates"),np=document.getElementById("plateSizeVariance"),ip=document.getElementById("jitter"),rp=document.getElementById("heightScale"),sp=document.getElementById("iterations"),ap=document.getElementById("erosionRate"),op=document.getElementById("evaporation"),lp=document.getElementById("seaLevel"),cp=document.getElementById("smoothPasses"),up=document.getElementById("subdivisions"),dp=document.getElementById("iceCap");document.getElementById("plateDelta");document.getElementById("faultType");const hp=document.getElementById("desymmetrizeTiling"),al=document.getElementById("atmosphere");document.getElementById("jitterValue");document.getElementById("heightScaleValue");document.getElementById("erosionRateValue");document.getElementById("evaporationValue");document.getElementById("seaLevelValue");document.getElementById("smoothPassesValue");document.getElementById("subdivisionsValue");document.getElementById("iceCapValue");document.getElementById("plateDeltaValue");document.getElementById("plateSizeVarianceValue");document.getElementById("atmosphereValue");const Do=document.getElementById("atmosphereHeight");document.getElementById("atmosphereHeightValue");const gr=document.getElementById("atmosphereToggle"),T0=document.getElementById("atmosphereAlpha");document.getElementById("atmosphereAlphaValue");const A0=document.getElementById("atmosphereColor"),ol=document.getElementById("cloudToggle"),Js=document.getElementById("cloudAlpha");document.getElementById("cloudAlphaValue");const ea=document.getElementById("cloudSpeed");document.getElementById("cloudSpeedValue");const ta=document.getElementById("cloudQuantity");document.getElementById("cloudQuantityValue");const na=document.getElementById("cloudHeight");document.getElementById("cloudHeightValue");const ia=document.getElementById("cloudColor"),ra=document.getElementById("cloudResolution");document.getElementById("cloudResolutionValue");const sa=document.getElementById("cloudShader"),fp=document.getElementById("cloudLayers");ol&&(ol.checked=!1);const YT=document.getElementById("addCloudLayer"),qe=document.getElementById("waterCycleToggle"),Nn=document.getElementById("waterCycleCloudToggle"),xi=document.getElementById("waterCycleRun"),ma=document.getElementById("waterCycleStep"),dn=document.getElementById("weatherAutoScale"),ls=document.getElementById("weatherSimMode"),Et=document.getElementById("weatherVolumeRes"),pp=document.getElementById("weatherVolumeResValue"),bt=document.getElementById("weatherRayStepsMin"),mp=document.getElementById("weatherRayStepsMinValue"),_t=document.getElementById("weatherRayStepsMax"),gp=document.getElementById("weatherRayStepsMaxValue"),vt=document.getElementById("weatherRayBundle"),vp=document.getElementById("weatherRayBundleValue"),vr=document.getElementById("weatherAtmoThickness"),yp=document.getElementById("weatherAtmoThicknessValue"),bi=document.getElementById("axialTilt"),xp=document.getElementById("axialTiltValue"),_i=document.getElementById("seasonProgress"),bp=document.getElementById("seasonProgressValue"),cs=document.getElementById("weatherDebug"),Kn=document.getElementById("volumeSlice"),ws=document.getElementById("volumeSliceValue");let Xn=null;const Hi=document.getElementById("weatherSpeed"),_p=document.getElementById("weatherSpeedValue"),ht=document.getElementById("weatherUpdateHz"),wp=document.getElementById("weatherUpdateHzValue"),Tt=document.getElementById("weatherMoistureLayers"),Sp=document.getElementById("weatherMoistureLayersValue"),Wi=document.getElementById("weatherEvap"),Mp=document.getElementById("weatherEvapValue"),qi=document.getElementById("weatherPrecip"),Ep=document.getElementById("weatherPrecipValue"),Xi=document.getElementById("weatherWind"),Tp=document.getElementById("weatherWindValue"),$i=document.getElementById("weatherWetness"),Ap=document.getElementById("weatherWetnessValue"),Yi=document.getElementById("weatherOceanInertia"),Cp=document.getElementById("weatherOceanInertiaValue"),Jn=document.getElementById("weatherOceanWindCoupling"),Rp=document.getElementById("weatherOceanWindCouplingValue"),ei=document.getElementById("weatherOceanWindUpdateHz"),Pp=document.getElementById("weatherOceanWindUpdateHzValue"),ji=document.getElementById("oceanCurrentVizToggle"),Ki=document.getElementById("oceanWaveVizToggle"),us=document.getElementById("weatherRainFxToggle"),Qi=document.getElementById("weatherRainFx"),Dp=document.getElementById("weatherRainFxValue"),gn=document.getElementById("weatherRainHaze"),Ip=document.getElementById("weatherRainHazeValue"),yr=document.getElementById("waterShader"),ll=document.getElementById("movePad"),cl=document.getElementById("lookPad"),ds=document.getElementById("mobileControls"),aa=document.getElementById("surfaceOnly");document.getElementById("configToggle");document.getElementById("configPanel");const Oi=document.getElementById("vrToggle"),Lp=document.getElementById("reticle"),Io=document.getElementById("leftStickSensitivity");document.getElementById("leftStickSensitivityValue");const Lo=document.getElementById("lookSensitivityX");document.getElementById("lookSensitivityXValue");const Uo=document.getElementById("lookSensitivityY");document.getElementById("lookSensitivityYValue");const oa=document.getElementById("invertLook");document.getElementById("planetDiameter");document.getElementById("planetDiameterValue");const C0=(()=>{const n=new Uint8Array([110,0,128,0]),e=new ti(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=Tn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Bt,e})(),jT=(()=>{const n=new Uint8Array([160,0,128,128]),e=new ti(n,1,1,St,Lt);return e.needsUpdate=!0,e.wrapS=Tn,e.wrapT=pt,e.minFilter=it,e.magFilter=it,e.generateMipmaps=!1,e.colorSpace=Bt,e})();function KT(){if(Xn)return Xn;const n=new ym({map:C0,transparent:!0,opacity:1,depthTest:!1,depthWrite:!1,toneMapped:!1}),e=new Iv(n);return e.renderOrder=999,e.scale.set(5,5,1),e.position.set(7.2,7.5,-12),wt.add(e),Xn=e,e}function QT(n){Pd=n,!n&&Xn&&(Xn.visible=!1),n&&(KT(),Xn.visible=!0)}function ZT(n){const e=document.getElementById("volumeSliceField");e&&(e.style.display=n?"block":"none")}function Up(n){if(!Kn)return;const e=Math.max(0,Number(Kn.max)||0),t=Math.min(Math.max(Math.floor(n),0),e);fl=t,Kn.value!==String(t)&&(Kn.value=t),ws&&(ws.textContent=t),R0()}function Gu(){if(!Kn)return;const n=Ml(),e=(n==null?void 0:n.n)??0,t=Math.max(0,e-1);Kn.max=String(t),fl>t&&(fl=t,ws&&(ws.textContent=t))}function JT(){var f;const n=Nd(),e=Ml();if(!n||!e)return null;const t=e.n||0,i=ca?4:1,r=Math.max(1,t*i);if(!pn||pn.image.width!==r||pn.image.height!==r){const p=new Uint8Array(Math.max(1,r*r*4));pn=new ti(p,r,r,St,Lt),pn.needsUpdate=!0,pn.wrapS=pt,pn.wrapT=pt,pn.minFilter=Dt,pn.magFilter=Dt,pn.generateMipmaps=!1,pn.colorSpace=Bt}const s=Math.min(Math.max(fl|0,0),Math.max(0,t-1)),a=e.tilesX||1,o=s%a,l=Math.floor(s/a),c=(f=n.image)==null?void 0:f.data;if(!(c&&c.length>=e.atlasW*e.atlasH*4))return n;const d=pn.image.data,h=0;for(let p=0;p<t;p++){const g=((l*t+p)*e.atlasW+o*t)*4;for(let x=0;x<t;x++){const m=g+x*4,u=c[m]??0,y=c[m+1]??0,b=c[m+2]??128,v=c[m+3]??0,M=Math.min(255,u*2),S=M,E=Math.min(255,y+M*.3),A=Math.min(255,b),w=Math.max(160,v);if(!ca){const L=p*r*4+x*4;d[L+0]=S,d[L+1]=E,d[L+2]=A,d[L+3]=w;continue}const _=x*i,R=p*i;for(let U=0;U<i;U++){const L=(R+U)*r*4;for(let O=0;O<i;O++){const V=L+(_+O)*4,k=O===0||U===0;d[V+0]=k?h:S,d[V+1]=k?h:E,d[V+2]=k?h:A,d[V+3]=k?255:w}}}}if(ca&&r>1){const p=r-1;for(let x=0;x<r;x++){const m=(x*r+p)*4;d[m+0]=h,d[m+1]=h,d[m+2]=h,d[m+3]=255}const g=p*r*4;for(let x=0;x<r;x++){const m=g+x*4;d[m+0]=h,d[m+1]=h,d[m+2]=h,d[m+3]=255}}return pn.needsUpdate=!0,pn}function R0(){if(!Pd||!Xn)return;const n=JT();if(!n){Xn.visible=!1;return}Xn.visible=!0,Xn.material.map=n,Xn.material.needsUpdate=!0}const Pt=new qT({onRegen:()=>kp(),onPreset:n=>{V0(n),MA(n),Pt.setStatus("Preset applied. Regenerating…"),kp()},onDiameterChange:n=>UA(n),onAtmosphereUpdate:()=>Xu(),onCloudUpdate:()=>$u(),onVRToggle:()=>{wi?q0():W0()}});let ni;try{ni=new ET($T)}catch(n){throw console.error("WebGL init failed",n),Pt.setStatus("WebGL context could not be created. Enable WebGL/hardware acceleration or disable XR emulation."),n}const Zi=ni.renderer,ga=ni.scene,wr=ni.planetGroup,Ws=ni.userGroup,wt=ni.camera,He=ni.controls,an=ni.dirLight,Ae=new lT(ni);let mn=null,Ac=0;const eA={sunDir:{value:new D(0,1,0)}};function tA(){var o,l;mn&&(ga.remove(mn),mn.geometry.dispose(),(l=(o=mn.material).dispose)==null||l.call(o));const n=Math.max(.05,((Le==null?void 0:Le.radius)??un)*.2),e=new cd(n,96,48),t=42,i=[];for(let c=0;c<t;c++){const d=Math.random()*Math.PI*2,h=Math.acos(2*Math.random()-1),f=Math.sin(h);i.push(new D(Math.cos(d)*f,Math.cos(h),Math.sin(d)*f))}const r=e.attributes.position,s=new D;for(let c=0;c<r.count;c++){s.fromBufferAttribute(r,c).normalize();let d=0;for(const h of i){const f=s.angleTo(h);if(f<.25){const p=1-f/.25;d-=p*p*.08}}s.multiplyScalar(1+d),r.setXYZ(c,s.x*n,s.y*n,s.z*n)}r.needsUpdate=!0,e.computeVertexNormals();const a=new Bv({color:14739181,roughness:.7,metalness:0,emissive:new Se(16777215),emissiveIntensity:.15});mn=new Gt(e,a),mn.castShadow=!0,mn.receiveShadow=!0,ga.add(mn)}const lt=new TT;lt.setMode(Es()?"mobile":"desktop");lt.setLookMode("orbit");function nA(){const n=t=>{if(!t)return!1;const i=t.tagName;return i?i==="INPUT"||i==="TEXTAREA"||t.isContentEditable:!1},e=t=>{if(n(t.target))return;const i=t.type==="keydown";switch(t.code){case"ControlLeft":case"ControlRight":case"KeyC":lt.setAction("down",i);break;case"Space":case"Numpad0":i&&lt.trigger("jump");break;default:return}};window.addEventListener("keydown",e,{passive:!1}),window.addEventListener("keyup",e,{passive:!1})}nA();const Zt=new Y1(wt,Zi.domElement,ga,()=>{He.enabled=!0,Pt.setStatus(""),es&&(He.target.copy(es.target),wt.position.copy(es.position),es=null),O0(),xA(),lt.setLookMode("orbit")},lt),iA=new Xv;let Ot=null,hs=!1,Vu=null,P0=null,rA=null,D0=null,I0=[],Mn=null,Qn=Ae.cloudLayerSettings,Le=null,Me=null,No=null,dr=null,Hu=null,es=null,wi=null,Wu=new Map;const ul=new yu,Cc=new Ee;let Rc=!1;const po=new $n,Np=new ot,ts=new Ue,fs=new D,dl=new D,Fp=new Ue,mo=new D,$r=new D,Bp=new D,Op=new D,Kr=new D,sA=60;let qu=null,hl=-1,ns=!1,L0=dd,Rd=1/hd,la=0,is=null,Pc=null,Pd=!1,ca=!1,fl=0,pn=null,U0=28,N0=48,Fo=1,hn=null,Dc=60;const Dd=[{n:16,updateHz:4,rayMin:10,rayMax:20,bundle:4},{n:24,updateHz:5,rayMin:14,rayMax:26,bundle:3},{n:32,updateHz:6,rayMin:18,rayMax:32,bundle:2},{n:48,updateHz:7,rayMin:22,rayMax:38,bundle:2},{n:64,updateHz:8,rayMin:28,rayMax:48,bundle:1}],Id=[{updateHz:4,moistureLayers:1},{updateHz:6,moistureLayers:2},{updateHz:8,moistureLayers:3},{updateHz:10,moistureLayers:4}],Yr={lowMs:20,highMs:33,downDelayS:1.5,upDelayS:6,cooldownDownS:2,cooldownUpS:4},Ve={manual:null,tier3d:0,tier2d:0,emaMs:16.7,overBudgetS:0,underBudgetS:0,cooldownS:0},Sn=new NT(ga,{maxDrops:12e3}),go=new XT(ga,{maxSprites:950}),qs=new FT(wr),di=new BT(wr);hn=document.createElement("div");hn.style.position="fixed";hn.style.top="8px";hn.style.right="60px";hn.style.padding="4px 8px";hn.style.background="rgba(0,0,0,0.35)";hn.style.color="#fff";hn.style.fontSize="12px";hn.style.fontFamily="monospace";hn.style.borderRadius="6px";hn.style.pointerEvents="none";hn.textContent="fps: --";document.body.appendChild(hn);window.addEventListener("mousedown",n=>{if(n.button===1){if(n.preventDefault(),Zt.enabled){Zt.exit(),He.enabled=!0;return}if(Cc.x=n.clientX/window.innerWidth*2-1,Cc.y=-(n.clientY/window.innerHeight)*2+1,ul.setFromCamera(Cc,wt),Ot){es={position:wt.position.clone(),target:He.target.clone()};const e=ul.intersectObject(Ot,!1);if(e.length>0){const t=e[0].point;Zt.enter(t,Ot,wt),He.enabled=!1,Pt.setStatus("Mode: Tiny Planet Explorer (ESC to exit)")}}}});Zi.domElement.addEventListener("mousedown",n=>{var e,t;n.button===0&&Zt.enabled&&(Es()||Zf&&Zf.contains(n.target)||document.pointerLockElement!==Zi.domElement&&((t=(e=Zi.domElement).requestPointerLock)==null||t.call(e)))});function Ld(){if(Zt.enabled){Zt.snapToSurface();return}if(!Ot)return;lt.setLookMode("surface"),ul.setFromCamera(new Ee(0,0),wt);const n=ul.intersectObject(Ot,!1);n.length&&(es={position:wt.position.clone(),target:He.target.clone()},Zt.enter(n[0].point,Ot,wt),He.enabled=!1,Pt.setStatus("Mode: Tiny Planet Explorer (ESC to exit)"))}Pt.setHudCollapsed(Es());function aA(){if(!ds||!ll||!cl)return;const n=(i,r)=>lt==null?void 0:lt.setAction(i,r),e=i=>lt==null?void 0:lt.trigger(i),t=(i,r,s)=>{let a=!1,o=null;const l=()=>{o=i.getBoundingClientRect()},c=h=>{o||l();const f=h.touches?h.touches[0]:h,p=f.clientX-o.left-o.width/2,g=f.clientY-o.top-o.height/2,x=Math.min(o.width,o.height)/2,m=Math.max(-x,Math.min(x,p)),u=Math.max(-x,Math.min(x,g)),y=m/x,b=u/x;r(y,b)},d=()=>{a=!1,s()};i.addEventListener("pointerdown",h=>{h.preventDefault(),a=!0,l(),c(h)}),window.addEventListener("pointermove",h=>{a&&(h.preventDefault(),c(h))}),window.addEventListener("pointerup",h=>{a&&(h.preventDefault(),d())}),i.addEventListener("touchstart",h=>{a=!0,l(),c(h)},{passive:!1}),i.addEventListener("touchmove",h=>{a&&c(h)},{passive:!1}),i.addEventListener("touchend",h=>{a&&d()},{passive:!1}),i.addEventListener("touchcancel",h=>{a&&d()},{passive:!1})};t(ll,(i,r)=>{const s=Math.max(.1,mA()),a=Math.max(.1,.25/s);n("forward",r<-a),n("backward",r>a),n("left",i<-a),n("right",i>a)},()=>{n("forward",!1),n("backward",!1),n("left",!1),n("right",!1)}),t(cl,(i,r)=>{const s=Math.max(.1,gA()),a=Math.max(.1,vA()),o=yA()?-1:1;lt==null||lt.addLookDelta(i*6*s,r*6*a*o)},()=>{}),ds.querySelectorAll("[data-trigger]").forEach(i=>{const r=i.getAttribute("data-trigger"),s=()=>{e(r),r==="surface"&&Ld()};i.addEventListener("pointerdown",a=>{a.preventDefault(),s()}),i.addEventListener("touchstart",a=>{a.preventDefault(),s()},{passive:!1})}),ds.querySelectorAll(".action-btn[data-action]").forEach(i=>{const r=i.getAttribute("data-action"),s=()=>n(r,!0),a=()=>n(r,!1);i.addEventListener("pointerdown",o=>{o.preventDefault(),s()}),i.addEventListener("pointerup",o=>{o.preventDefault(),a()}),i.addEventListener("pointerleave",a),i.addEventListener("pointercancel",a),i.addEventListener("touchstart",o=>{o.preventDefault(),s()},{passive:!1}),i.addEventListener("touchend",o=>{o.preventDefault(),a()},{passive:!1}),i.addEventListener("touchcancel",o=>{o.preventDefault(),a()},{passive:!1})}),aa&&(aa.addEventListener("pointerdown",i=>{i.preventDefault(),e("surface")}),aa.addEventListener("touchstart",i=>{i.preventDefault(),e("surface")},{passive:!1}))}function Ea(){return Pt.getPlanetDiameterKm()}function Ud(){return Ea()/Gi}function Wn(){return qe!=null&&qe.checked&&(Me!=null&&Me.enabled)&&Me.ready&&Me.hasSurface?Me.getTexture():C0}function pi(){return qe!=null&&qe.checked&&(Me!=null&&Me.enabled)&&Me.ready&&Me.hasSurface?Me.getAuxTexture():jT}function Nd(){return!((qe==null?void 0:qe.checked)??!1)||!((Nn==null?void 0:Nn.checked)??!1)||!(Me!=null&&Me.enabled)||!Me.ready||!Me.hasSurface||typeof Me.getVolumeTexture!="function"?null:Me.getVolumeTexture()}function Ml(){return!(Me!=null&&Me.enabled)||!Me.ready||!Me.hasSurface||typeof Me.getVolumeMeta!="function"?null:Me.getVolumeMeta()}function oA(n,e,t,i){var g;if(!((g=n==null?void 0:n.image)!=null&&g.data)||!t||(mo.copy(wt.position).multiplyScalar(e).applyMatrix3(t),mo.lengthSq()<1e-12))return(i??Kr).set(0,0,0),i??Kr;const r=mo.normalize(),s=Math.atan2(r.z,r.x)/(2*Math.PI)+.5,a=Math.asin(ae(r.y,-1,1))/Math.PI+.5,o=S0(n,s,a),l=((o.b??128)/255-.5)*2,c=((o.a??128)/255-.5)*2,d=40;$r.set(-r.z,0,r.x),$r.lengthSq()<1e-8&&$r.set(1,0,0),$r.normalize(),Bp.crossVectors(r,$r).normalize(),Op.copy($r).multiplyScalar(l).addScaledVector(Bp,c).multiplyScalar(d),Fp.copy(t).transpose();const h=(i??Kr).copy(Op).applyMatrix3(Fp),f=mo.copy(wt.position).normalize();return h.addScaledVector(f,-h.dot(f)),h.length()>1e-6||h.set(0,0,0),h}function lA(){return Ta()==="holistic"}function cA(){return Pc||(Pc=WT({resolution:32})),Pc}function uA(){var e;const n=lA()&&((qe==null?void 0:qe.checked)??!1);if(!n&&ns){(e=Ae==null?void 0:Ae.setOceanWindField)==null||e.call(Ae,null),ns=!1,hl=-1,is=null,la=0;return}n&&!ns&&(ns=!0,hl=-1,is=null,la=Rd)}function F0(){if(!di)return;const n=(ji==null?void 0:ji.checked)??!1,e=(Ki==null?void 0:Ki.checked)??!1;di.setConfig({showCurrents:n,showWaves:e,visible:n||e})}function B0(){var r;if(!((r=Ae==null?void 0:Ae.oceanComputeSystem)!=null&&r.enabled))return;const n=pi(),e=Ae.oceanComputeSystem.gridW,t=Ae.oceanComputeSystem.gridH,i=zT(n,e,t,{maxWind:sA,scale:L0,out:qu});i&&(qu=i,Ae.setOceanWindField(i))}function El(n){var t,i;if(!Ot)return;const e=Ot.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.texture=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherMap&&(e.userData.shader.uniforms.uWeatherMap.value=n))}function Tl(n){var t,i;if(!Ot)return;const e=Ot.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.auxTexture=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherAuxMap&&(e.userData.shader.uniforms.uWeatherAuxMap.value=n))}function dA(n){var t,i;if(!Ot)return;const e=Ot.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.strength=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherStrength&&(e.userData.shader.uniforms.uWeatherStrength.value=n))}function hA(n){var t,i;if(!Ot)return;const e=Ot.material;e!=null&&e.userData&&(e.userData.weather&&(e.userData.weather.debug=n),(i=(t=e.userData.shader)==null?void 0:t.uniforms)!=null&&i.uWeatherDebug&&(e.userData.shader.uniforms.uWeatherDebug.value=n))}function fA(n,e){if(!n||!e)return;const t=(e.planetDiameterKm??Ea())*1e3*.5,i={heightmap:n.data,size:n.size,seaLevel:e.seaLevel,planetRadiusM:t};Hu=i;const r=[Me,No,dr].filter(Boolean);for(const s of r)s!=null&&s.enabled&&s.ready&&s.setPlanetSurface(i);El(Wn()),Tl(pi())}function pA(){const e=Gi*1e3*.5/un;return P1/e*Ud()}function mA(){const n=parseFloat(Io==null?void 0:Io.value);return Number.isFinite(n)?n:1}function gA(){const n=parseFloat(Lo==null?void 0:Lo.value);return Number.isFinite(n)?n:.4}function vA(){const n=parseFloat(Uo==null?void 0:Uo.value);return Number.isFinite(n)?n:.4}function yA(){return!!(oa!=null&&oa.checked)}function O0(){if(!Le)return;const n=(Le.radius??un)+(Le.heightScale??0),e=Ud(),t=Math.max(.5,n*e);He.minDistance=Math.max(.2,t*.1),He.maxDistance=Math.max(t*16,He.minDistance+1);const i=wt.position.clone().sub(He.target),r=i.length(),s=ae(r,He.minDistance,He.maxDistance);Math.abs(s-r)>1e-4&&(i.setLength(s),wt.position.copy(He.target).add(i)),wt.near=Math.max(.002,t*5e-4),wt.far=Math.max(150,t*14),wt.updateProjectionMatrix()}function xA(){He&&(He.state!==void 0&&(He.state=-1),He.keyState!==void 0&&(He.keyState=-1),He._movePrev&&He._moveCurr&&He._movePrev.copy(He._moveCurr),He._zoomStart&&He._zoomEnd&&He._zoomStart.copy(He._zoomEnd),He._panStart&&He._panEnd&&He._panStart.copy(He._panEnd))}function z0(){Ae.applyPlanetScale(Ea()),O0()}function k0(){if(!ds)return;const n=Es(),e=Zt.enabled;ds.style.display="block",ll&&(ll.style.display=n&&e?"grid":"none"),cl&&(cl.style.display=n&&e?"grid":"none");const t=ds.querySelector(".action-column");if(t&&(t.style.display=e?"grid":"none"),aa&&(aa.style.display=e?"none":"inline-flex"),Lp){const i=!n||e;Lp.style.display=i?"block":"none"}G0()}function G0(){if(!Jf)return;const n=Es(),e=Zt.enabled;let t="";e?(t+="<h4>First Person</h4><ul>",n||(t+="<li>Mouse move to look (click to capture)</li>"),t+="<li>WASD to move, Shift to run, Space to jump</li>",t+="<li>Arrow keys to look, Q/E to roll</li>",t+="<li>F to toggle fly, Ctrl to descend, Esc to exit</li>",t+="<li>On-screen buttons: Jump, Fly, Surface, Exit, Run</li>",t+="</ul>",n&&(t+="<h4>Touch</h4><ul>",t+="<li>Left stick moves, right stick looks</li>",t+="</ul>")):(t+="<h4>Orbit</h4><ul>",t+="<li>Drag to orbit, scroll to zoom</li>",t+="<li>Middle click or Surface button to enter first person</li>",t+="</ul>"),Jf.innerHTML=t}function bA(){if(!Tc||!sl)return;const n=Tc.style.display!=="block";Tc.style.display=n?"block":"none",sl.setAttribute("aria-expanded",n.toString()),n&&G0()}function Er(){Pt.updateRangeLabels(),Hi&&_p&&(_p.textContent=Number(Hi.value).toFixed(0)),ht&&wp&&(wp.textContent=Number(ht.value).toFixed(0)),Et&&pp&&(pp.textContent=Number(Et.value).toFixed(0)),bt&&mp&&(mp.textContent=Number(bt.value).toFixed(0)),_t&&gp&&(gp.textContent=Number(_t.value).toFixed(0)),vt&&vp&&(vp.textContent=Number(vt.value).toFixed(0)),vr&&yp&&(yp.textContent=Number(vr.value).toFixed(0)),bi&&xp&&(xp.textContent=Number(bi.value).toFixed(1)),_i&&bp&&(bp.textContent=Number(_i.value).toFixed(2)),Tt&&Sp&&(Sp.textContent=Number(Tt.value).toFixed(0)),Wi&&Mp&&(Mp.textContent=Number(Wi.value).toFixed(2)),qi&&Ep&&(Ep.textContent=Number(qi.value).toFixed(2)),Xi&&Tp&&(Tp.textContent=Number(Xi.value).toFixed(2)),$i&&Ap&&(Ap.textContent=Number($i.value).toFixed(2)),Yi&&Cp&&(Cp.textContent=Number(Yi.value).toFixed(2)),Jn&&Rp&&(Rp.textContent=Number(Jn.value).toFixed(2)),ei&&Pp&&(Pp.textContent=Number(ei.value).toFixed(0)),Qi&&Dp&&(Dp.textContent=Number(Qi.value).toFixed(2)),gn&&Ip&&(Ip.textContent=Number(gn.value).toFixed(2))}function V0(n){Pt.applyPreset(n);const e=$o[n]||$o.balanced;EA(e),yr&&(yr.value=n==="fast"?"fast":"balanced")}function _A(){const n=Pt.readSettings();return n.waterShader=Fd(),n}function wA(n){Pt.writeSettings(n)}function SA(){if(typeof window>"u")return null;const e=(new URLSearchParams(window.location.search||"").get("quality")||"").toLowerCase();return e==="fast"||e==="balanced"||e==="high"?e:null}function Fd(){return(yr==null?void 0:yr.value)||"balanced"}function MA(n){if(typeof window>"u")return;const e=(n||"").toLowerCase();if(e!=="fast"&&e!=="balanced"&&e!=="high")return;const t=new URL(window.location.href);t.searchParams.set("quality",e),window.history.replaceState({},"",t)}function EA(n){const e=(s,a)=>!s||a===void 0||a===null?!1:(s.value=String(a),!0),t=(s,a)=>!s||a===void 0||a===null?!1:(s.checked=!!a,!0);let i=!1;i=t(qe,n.waterCycleEnabled)||i,i=t(Nn,n.waterCycleCloudEnabled)||i,i=t(xi,n.waterCycleRun)||i,i=e(ls,n.weatherSimMode)||i,i=e(Et,n.weatherVolumeRes)||i,i=e(bt,n.weatherRayStepsMin)||i,i=e(_t,n.weatherRayStepsMax)||i,i=e(vt,n.weatherRayBundle)||i,i=e(vr,n.weatherAtmoThickness)||i,i=e(bi,n.axialTilt)||i,i=e(_i,n.seasonProgress)||i,i=e(cs,n.weatherDebug)||i,i=e(Hi,n.weatherSpeed)||i,i=e(ht,n.weatherUpdateHz)||i,i=e(Tt,n.weatherMoistureLayers)||i,i=e(Wi,n.weatherEvap)||i,i=e(qi,n.weatherPrecip)||i,i=e(Xi,n.weatherWind)||i,i=e($i,n.weatherWetness)||i,i=e(Yi,n.weatherOceanInertia)||i,i=e(Jn,n.weatherOceanWindCoupling)||i,i=e(ei,n.weatherOceanWindUpdateHz)||i,i=t(us,n.weatherRainFxEnabled)||i,i=e(Qi,n.weatherRainFx)||i,i=e(gn,n.weatherRainHaze)||i;let r=!1;dn&&n.weatherAutoScale!==void 0&&n.weatherAutoScale!==null&&(dn.checked=!!n.weatherAutoScale,dn.checked?(kd(),r=!0):$0({keepCurrent:!0})),i&&!r&&va()}async function Bd(n){var r,s;if(hs)return;Zt.enabled&&(Zt.exit(),He.enabled=!0),hs=!0,clearTimeout(Vu),ku.disabled=!0,er.disabled=!0,ep.disabled=!0,tp.disabled=!0,np.disabled=!0,hp.disabled=!0,ip.disabled=!0,rp.disabled=!0,sp.disabled=!0,ap.disabled=!0,op.disabled=!0,lp.disabled=!0,al.disabled=!0,Do.disabled=!0,cp.disabled=!0,up.disabled=!0,dp.disabled=!0,Do.disabled=!0;const e={..._A(),planetDiameterKm:Ea(),atmosphereEnabled:(gr==null?void 0:gr.checked)??!0,waterShader:Fd()};wA(e);const t=[],i=Od();i.enabled&&t.push(i);for(const a of Qn)a.enabled&&t.push(a);Ae.cloudLayerSettings=t;try{await Ae.generate(e,o=>Pt.setStatus(o)),Le={...Ae.lastSettings||e},Ot=Ae.planet,P0=Ae.water,rA=Ae.freshwater,D0=((r=Ae.atmosphereSystem)==null?void 0:r.mesh)||null,I0=((s=Ae.cloudSystem)==null?void 0:s.clouds)||[],Ae.forge&&fA(Ae.forge,e),El(Wn()),Tl(pi()),Gd();const a=new D().copy(an.position).normalize();Fi(a),Al(a,{force:!0}),tA(),z0(),Pt.setStatus(`${e.resolution}² map · ${e.iterations.toLocaleString()} steps`)}catch(a){console.error(a),Pt.setStatus("Generation failed – check console")}finally{hs=!1,ku.disabled=!1,er.disabled=!1,ep.disabled=!1,tp.disabled=!1,np.disabled=!1,hp.disabled=!1,ip.disabled=!1,rp.disabled=!1,sp.disabled=!1,ap.disabled=!1,op.disabled=!1,lp.disabled=!1,al.disabled=!1,Do.disabled=!1,cp.disabled=!1,up.disabled=!1,dp.disabled=!1}}function Al(n,e={}){var d,h,f;if(!Le)return;const t=e.force===!0;if(!(((qe==null?void 0:qe.checked)??!1)&&((Nn==null?void 0:Nn.checked)??!1))){zp();return}const r=TA(),s=Nd(),a=Ml();if(!s||!a)return;const o=[Le.radius,Le.seaLevel,Le.heightScale,Le.subdivisions,a.atmoThicknessM??0].join("|");if(!t&&Mn&&((d=Mn.userData)==null?void 0:d.signature)===o){const p=((h=Mn.userData)==null?void 0:h.uniforms)||{};(f=p.color)!=null&&f.value&&p.color.value.set(r.color),p.opacity&&(p.opacity.value=r.alpha),p.quantity&&(p.quantity.value=r.quantity),p.noiseScale&&(p.noiseScale.value=Math.max(1,r.resolution)),p.mode&&(p.mode.value=r.mode==="billow"?1:r.mode==="cellular"?2:0),Mn.userData.settings=r;return}zp();const l=Le.radius+Le.heightScale*.2,c=Ae.cloudSystem.buildVolumeCloudMesh(l,Le.subdivisions,n,Le.radius,Le.seaLevel,Le.heightScale,r,s,a);c.userData.signature=o,Mn=c,wr.add(c)}function zp(){var n,e;Mn&&(wr.remove(Mn),Mn.geometry.dispose(),(e=(n=Mn.material).dispose)==null||e.call(n),Mn=null)}function Od(){return{id:"base",enabled:ol.checked,alpha:ae(parseFloat(Js.value)||.74,0,1),speed:ae(parseFloat(ea.value)||.9,0,2),quantity:ae(parseFloat(ta.value)||.76,0,1),height:ae(parseFloat(na.value)||-2.4,-5,5),color:ia.value||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(ra.value)||256)),mode:sa.value||"billow"}}function TA(){return{id:"water-cycle",enabled:(Nn==null?void 0:Nn.checked)??!1,alpha:ae(parseFloat(Js==null?void 0:Js.value)||.74,0,1),speed:ae(parseFloat(ea==null?void 0:ea.value)||.9,0,2),quantity:ae(parseFloat(ta==null?void 0:ta.value)||.76,0,2),height:ae(parseFloat(na==null?void 0:na.value)||-2.4,-5,5),color:(ia==null?void 0:ia.value)||"#ffffff",resolution:Math.max(1,Math.floor(parseFloat(ra==null?void 0:ra.value)||256)),mode:(sa==null?void 0:sa.value)||"billow"}}function Fi(n){var i;if(!Le)return;const e=[],t=Od();t.enabled&&e.push(t);for(const r of Qn)r.enabled&&e.push(r);Ae.cloudLayerSettings=e,Ae.rebuildClouds(n),I0=((i=Ae.cloudSystem)==null?void 0:i.clouds)||[]}function AA(n){var o;if(!Le)return;const e=ae(parseFloat(al.value)||.35,.05,1.5),t=ae(parseFloat(Do.value)||.5,0,5),i=ae(parseFloat(T0.value)||1,0,1),r=A0.value||"#4da8ff",s=ae(parseFloat(gn==null?void 0:gn.value)||.9,0,2),a={...Le,atmosphereEnabled:(gr==null?void 0:gr.checked)??!0,atmosphere:e,atmosphereHeight:t,atmosphereAlpha:i,atmosphereColor:r};Ae.updateAtmosphere(a,{map:Wn(),rainHaze:s}),D0=((o=Ae.atmosphereSystem)==null?void 0:o.mesh)||null,Ae.lastSettings={...Ae.lastSettings||{},...a},Le={...Le,...a}}function CA(n){const e=document.createElement("div");e.className="layer",e.style.border="1px solid var(--border)",e.style.padding="8px",e.style.marginBottom="8px";const t=document.createElement("div");t.textContent=`Layer ${n.label||Qn.length+1}`,t.style.fontSize="12px",t.style.color="var(--muted)",e.appendChild(t);const i=(p,g,x,m,u)=>{const y=document.createElement("div");y.className="field";const b=document.createElement("label");b.textContent=p;const v=document.createElement("div");v.className="range-row";const M=document.createElement("input");M.type="range",M.min=x,M.max=m,M.step=u,M.value=n[g];const S=document.createElement("span");return S.className="value",S.textContent=Number(n[g]).toFixed(u<1?2:0),v.appendChild(M),v.appendChild(S),y.appendChild(b),y.appendChild(v),M.addEventListener("input",()=>{n[g]=parseFloat(M.value),S.textContent=Number(n[g]).toFixed(u<1?2:0),Fi(new D().copy(an.position).normalize())}),y},r=document.createElement("label"),s=document.createElement("input");s.type="checkbox",s.checked=n.enabled,s.addEventListener("change",()=>{n.enabled=s.checked,Fi(new D().copy(an.position).normalize())}),r.appendChild(s),r.append(" Layer enabled"),e.appendChild(r),e.appendChild(i("Alpha","alpha",0,1,.01)),e.appendChild(i("Speed","speed",0,2,.05)),e.appendChild(i("Quantity","quantity",0,1,.01)),e.appendChild(i("Height","height",-5,5,.05)),e.appendChild(i("Resolution","resolution",1,256,1));const a=document.createElement("div");a.className="field";const o=document.createElement("label");o.textContent="Shader";const l=document.createElement("select");["fbm","billow","cellular"].forEach(p=>{const g=document.createElement("option");g.value=p,g.textContent=p.charAt(0).toUpperCase()+p.slice(1),n.mode===p&&(g.selected=!0),l.appendChild(g)}),l.addEventListener("change",()=>{n.mode=l.value,Fi(new D().copy(an.position).normalize())}),a.appendChild(o),a.appendChild(l),e.appendChild(a);const c=document.createElement("div");c.className="field";const d=document.createElement("label");d.textContent="Color";const h=document.createElement("input");h.type="color",h.value=n.color,h.addEventListener("input",()=>{n.color=h.value,Fi(new D().copy(an.position).normalize())}),c.appendChild(d),c.appendChild(h),e.appendChild(c);const f=document.createElement("button");return f.type="button",f.textContent="Remove layer",f.addEventListener("click",()=>{Qn=Qn.filter(p=>p!==n),zd(),Fi(new D().copy(an.position).normalize())}),e.appendChild(f),e}function zd(){fp.innerHTML="";for(const n of Qn)fp.appendChild(CA(n))}function RA(){lt&&lt.setMode(Es()?"mobile":"desktop"),k0()}function H0(){const n=wr.scale.x?1/wr.scale.x:1,e=ae(parseFloat(bi==null?void 0:bi.value)||23.4,0,45),t=ae(parseFloat(_i==null?void 0:_i.value)||0,0,1),i=Go.degToRad(e),r=t*Math.PI*2,s=i*Math.sin(r),a=new D(Math.cos(s),Math.sin(s),.6).normalize().multiplyScalar(16);return an.position.copy(a),fs.copy(an.position).normalize(),ts.identity(),dl.copy(fs),Ot&&(Ot.getWorldQuaternion(po),po.invert(),Np.makeRotationFromQuaternion(po),ts.setFromMatrix4(Np),dl.copy(fs).applyQuaternion(po).normalize()),n}function PA(n){if(!mn)return;Math.max(.05,((Le==null?void 0:Le.radius)??un)*.2);const e=Math.max(3,((Le==null?void 0:Le.radius)??un)*4),t=Go.degToRad(8);Ac+=n*.02;const i=Math.cos(Ac),r=Math.sin(Ac),s=e*i,a=e*Math.sin(t)*r,o=e*Math.cos(t)*r;mn.position.set(s,a,o),mn.lookAt(wr.position),eA.sunDir.value.copy(fs),VA(),an.target.position.set(0,0,0),an.target.updateMatrixWorld()}function DA(){var a,o,l,c,d,h,f;const n=iA.getDelta(),e=n>1e-6?1/n:0;Dc=Dc*.9+e*.1,hn&&(hn.textContent=`fps: ${Dc.toFixed(1)}`),Er(),kA(n),wi&&LA(),Zt.enabled?Zt.update(n):lt.consume("surface")&&Ld(),Ae.update(n,!Zt.enabled&&!hs),k0();const t=H0();if(PA(n),((qe==null?void 0:qe.checked)??!1)&&((xi==null?void 0:xi.checked)??!0)&&(Me!=null&&Me.enabled)&&Me.update(n,dl),ns&&(Me==null?void 0:Me.readbackVersion)!=null){la+=Math.min(Math.max(n,0),$1);const p=Me.readbackVersion;Number.isFinite(p)&&p!==hl&&(is=p),is!==null&&la>=Rd&&(hl=is,is=null,la=0,B0())}if((a=Ae.atmosphereSystem)!=null&&a.uniforms){const p=Ae.atmosphereSystem.uniforms;(o=p.sunDir)!=null&&o.value&&p.sunDir.value.copy(fs),(l=p.planetInvRot)!=null&&l.value&&p.planetInvRot.value.copy(ts),"planetInvScale"in p&&(p.planetInvScale.value=t);const g=Wn()||Ae.atmosphereSystem.defaultWeatherTexture;p.weatherMap?p.weatherMap.value=g:p.weatherMap={value:g};const x=ae(parseFloat(gn==null?void 0:gn.value)||.9,0,2);p.rainHaze&&(p.rainHaze.value=x)}if(Mn){const p=Math.min(n,.25),g=((c=Mn.userData)==null?void 0:c.uniforms)||{},x=((d=Mn.userData)==null?void 0:d.settings)||{},m=(x==null?void 0:x.speed)||1;((h=g.windOffset)==null?void 0:h.value)!==void 0&&(g.windOffset.value+=p*m*.3),g.planetInvRot&&g.planetInvRot.value.copy(ts),g.planetInvScale&&(g.planetInvScale.value=t),g.weatherMap&&(g.weatherMap.value=Wn()),g.weatherAuxMap&&(g.weatherAuxMap.value=pi()),g.volumeAtlas&&(g.volumeAtlas.value=Nd()??g.volumeAtlas.value);const u=Ml();u&&(g.volumeN&&(g.volumeN.value=u.n),g.tilesX&&(g.tilesX.value=u.tilesX),g.atlasW&&(g.atlasW.value=u.atlasW),g.atlasH&&(g.atlasH.value=u.atlasH),g.volumeExtentM&&(g.volumeExtentM.value=u.extentM),g.metersPerUnit&&(g.metersPerUnit.value=(u.planetRadiusM??Dm)/un)),g.debugGrid&&(g.debugGrid.value=ca?1:0),g.rayStepsMin&&(g.rayStepsMin.value=U0),g.rayStepsMax&&(g.rayStepsMax.value=N0),g.bundleSize&&(g.bundleSize.value=Fo)}R0(),Sn&&(Sn.setWeatherFrame({planetInvRot:ts,planetInvScale:t}),Sn.setWeatherMap(Wn()));const r=oA(pi(),t,ts,Kr);if(Sn&&Sn.setWindWorld(r),go&&(go.setCenter(wt.position),go.setWind(r),go.update(n)),(f=Ae==null?void 0:Ae.waterUniforms)!=null&&f.windStrength&&(Ae.waterUniforms.windStrength.value=Math.min(Math.max(r.length()*1.5,.05),3)),Ae!=null&&Ae.setOceanWindVector&&Ae.setOceanWindVector(r),Sn&&Sn.update(n),qs&&Le){const p=Pd;qs.setVisible(p),p&&(qs.setWeatherTextures(Wn(),pi()),qs.setPlanetRadius(Le.radius+Le.heightScale*.1),qs.update())}const s=Ae==null?void 0:Ae.oceanComputeSystem;if(di&&(s!=null&&s.enabled)&&s.ready&&Le){const p=(ji==null?void 0:ji.checked)??!1,g=(Ki==null?void 0:Ki.checked)??!1,x=p||g;di.setVisible(x),x&&(di.setPlanetRadius(Le.radius+Le.heightScale*.12),di.setOceanTexture(s.getTexture()),di.setWeatherTexture(Wn()),di.setWindField(qu,s.gridW,s.gridH),di.update())}El(Wn()),Tl(pi()),Ae.setOceanWindTexture(pi()),ni.update(!Zt.enabled)}async function IA(){if(!(!navigator.xr||!Oi))try{Rc=await navigator.xr.isSessionSupported("immersive-vr"),Oi.style.display=Rc?"block":"none",Oi&&(Oi.disabled=!Rc)}catch(n){console.warn("XR support check failed",n)}}async function W0(){if(!navigator.xr){Pt.setStatus("WebXR not available");return}try{const n=await navigator.xr.requestSession("immersive-vr",{optionalFeatures:["local-floor","bounded-floor"]});if(wi=n,Zi.xr.enabled=!0,await Zi.xr.setSession(n),He&&(He.enabled=!1),Ot&&!Zt.enabled){const e=((Le==null?void 0:Le.radius)??un)*Ud()+((Le==null?void 0:Le.heightScale)??0),t=Math.max(e*2,30),i=wt.position.clone().sub(He.target);i.lengthSq()<1e-6&&i.set(0,0,1),i.normalize();const r=new D(0,0,0),s=r.clone().sub(i.multiplyScalar(t));Ws.position.copy(s),Ws.lookAt(r),wt.position.set(0,0,0),wt.rotation.set(0,0,0)}Oi.textContent="Exit VR",Pt.setStatus("VR session started"),n.addEventListener("end",()=>{wi=null,Wu.clear(),Zi.xr.enabled=!1,Ws.position.set(0,0,0),Ws.rotation.set(0,0,0),Ws.quaternion.identity(),He&&(He.enabled=!0),Oi.textContent="Enter VR",Pt.setStatus("")})}catch(n){console.error(n),Pt.setStatus("VR start failed")}}function q0(){wi&&wi.end()}function LA(){if(!wi||!lt)return;let n=0,e=0;const t=.15;for(const i of wi.inputSources){const r=i.gamepad;if(!r)continue;const s=Wu.get(i)||[],a=r.buttons||[],o=r.axes||[];o.length>=4&&(n=o[2],e=o[3]);const l=a.map(c=>!!c&&c.pressed);l[0]&&!s[0]&&lt.trigger("jump"),l[1]&&!s[1]&&lt.trigger("flyToggle"),l[3]&&!s[3]&&lt.trigger("exit"),Wu.set(i,l)}lt.setAction("forward",e>t),lt.setAction("backward",e<-t),lt.setAction("left",n>t),lt.setAction("right",n<-t)}Oi&&Oi.addEventListener("click",()=>{wi?q0():W0()});ku.addEventListener("click",()=>Bd(er.value));function UA(n){const e=Number.isFinite(n)?n:Ea();Er(),Le&&(Le.planetDiameterKm=e),z0(),hs||Pt.setStatus(`Planet diameter set to ${e.toLocaleString()} km`)}function kp(){hs||(clearTimeout(Vu),Vu=setTimeout(()=>Bd(er.value),400))}function Xu(){Er(),AA(new D().copy(an.position).normalize())}function $u(){Er();const n=new D().copy(an.position).normalize();Fi(n),Al(n)}const NA=[qe,Nn,xi,ma,dn,ls,Et,bt,_t,vt,cs,Hi,ht,Tt,Wi,qi,Xi,$i,Yi,Jn,ei,ji,Ki,us,Qi,gn].filter(Boolean);function Bo(n){for(const e of NA)e.disabled=n}const FA=[ht,Et,bt,_t,vt,Tt].filter(Boolean);function X0(n){for(const e of FA)e.disabled=n}function BA(){return{updateHz:ht==null?void 0:ht.value,volumeRes:Et==null?void 0:Et.value,rayMin:bt==null?void 0:bt.value,rayMax:_t==null?void 0:_t.value,rayBundle:vt==null?void 0:vt.value,moistureLayers:Tt==null?void 0:Tt.value}}function OA(n){n&&(ht&&n.updateHz!=null&&(ht.value=n.updateHz),Et&&n.volumeRes!=null&&(Et.value=n.volumeRes),bt&&n.rayMin!=null&&(bt.value=n.rayMin),_t&&n.rayMax!=null&&(_t.value=n.rayMax),vt&&n.rayBundle!=null&&(vt.value=n.rayBundle),Tt&&n.moistureLayers!=null&&(Tt.value=n.moistureLayers),va())}function Gp(n){if(Sr(n)){const s=ae(parseFloat(Et==null?void 0:Et.value)||8,1,128),a=ae(parseFloat(ht==null?void 0:ht.value)||1,1,20),o=ae(parseFloat(bt==null?void 0:bt.value)||28,1,128),l=ae(parseFloat(_t==null?void 0:_t.value)||48,1,128),c=ae(parseFloat(vt==null?void 0:vt.value)||1,1,100);let d=0,h=1/0;return Dd.forEach((f,p)=>{const g=Math.abs(f.n-s)+Math.abs(f.updateHz-a)*2+Math.abs(f.rayMin-o)*.5+Math.abs(f.rayMax-l)*.5+Math.abs(f.bundle-c)*2;g<h&&(h=g,d=p)}),d}const e=ae(parseFloat(ht==null?void 0:ht.value)||1,1,20),t=ae(parseFloat(Tt==null?void 0:Tt.value)||2,1,4);let i=0,r=1/0;return Id.forEach((s,a)=>{const o=Math.abs(s.updateHz-e)*2+Math.abs(s.moistureLayers-t);o<r&&(r=o,i=a)}),i}function Ks(n){if(Sr(n)){const e=Dd[Ve.tier3d];if(!e)return;Et&&(Et.value=String(e.n)),ht&&(ht.value=String(e.updateHz)),bt&&(bt.value=String(e.rayMin)),_t&&(_t.value=String(e.rayMax)),vt&&(vt.value=String(e.bundle))}else{const e=Id[Ve.tier2d];if(!e)return;ht&&(ht.value=String(e.updateHz)),Tt&&(Tt.value=String(e.moistureLayers))}va()}function kd(){Ve.manual=BA(),Ve.emaMs=16.7,Ve.overBudgetS=0,Ve.underBudgetS=0,Ve.cooldownS=0;const n=Ta();Sr(n)?Ve.tier3d=Gp(n):Ve.tier2d=Gp(n),X0(!0),Ks(n)}function $0(n={}){const e=!!n.keepCurrent;X0(!1),e||OA(Ve.manual),Ve.manual=null}function Ta(){const n=((ls==null?void 0:ls.value)||"3d").toLowerCase();return n==="2d"?"2d":n==="holistic"?"holistic":"3d"}function Sr(n){return n!=="2d"}function zA(){const n=parseFloat(Et==null?void 0:Et.value),e=Number.isFinite(n)?n:8;return ae(Math.round(e),1,128)}function Vp(n){const e=Sr(n),t=n==="holistic";Tt&&(Tt.disabled=e),Et&&(Et.disabled=!e),Jn&&(Jn.disabled=!t),ei&&(ei.disabled=!t)}let vo=0;async function Y0(){const n=Ta();Vp(n),n==="holistic"&&cA();const e=++vo;try{if(Sr(n)){const t=zA();if(dr&&dr.volumeN!==t&&(dr=null),!dr){const i=await zu();dr=await Cd.create({volumeN:t,surfaceW:256,surfaceH:128,device:i||void 0})}if(e!==vo)return;Me=dr}else{if(!No){const t=await zu();No=await Ad.create({gridWidth:256,gridHeight:128,device:t||void 0})}if(e!==vo)return;Me=No}}catch(t){if(console.warn("[WaterCycle] init failed",t),e!==vo)return;Bo(!0),qe&&(qe.checked=!1,qe.disabled=!0);return}if(!(Me!=null&&Me.enabled)){Bo(!0),qe&&(qe.checked=!1,qe.disabled=!0),xi&&(xi.checked=!1,xi.disabled=!0),ma&&(ma.disabled=!0);return}Bo(!1),Vp(n),Hu&&Me.enabled&&Me.ready&&Me.setPlanetSurface(Hu),Gd(),El(Wn()),Tl(pi()),Al(new D().copy(an.position).normalize())}function Gd(){const n=Ta(),e=ae(parseFloat(Hi==null?void 0:Hi.value)||1,0,60),t=ae(parseFloat(ht==null?void 0:ht.value)||1,1,20),i=ae(parseFloat(Tt==null?void 0:Tt.value)||2,1,4),r=ae(parseFloat(Wi==null?void 0:Wi.value)||1,0,3),s=ae(parseFloat(qi==null?void 0:qi.value)||1,0,3),a=ae(parseFloat(Xi==null?void 0:Xi.value)||1,0,3),o=ae(parseFloat($i==null?void 0:$i.value)||.75,0,2),l=ae(parseFloat(Yi==null?void 0:Yi.value)||.25,.05,1),c=ae(parseFloat(Jn==null?void 0:Jn.value)||dd,0,2),d=ae(parseFloat(ei==null?void 0:ei.value)||hd,1,20),h=(us==null?void 0:us.checked)??!0,f=ae(parseFloat(Qi==null?void 0:Qi.value)||1,0,2),p=ae(parseFloat(gn==null?void 0:gn.value)||.9,0,2),g=((cs==null?void 0:cs.value)||"off").toLowerCase(),x=g==="cloud"?1:g==="rain"?2:g==="pressure"?3:g==="soil"?4:g==="temp"?5:g==="snow"?6:g==="wind"?7:0,m=g==="volume"||g==="volume-grid";ca=g==="volume-grid";let u=ae(parseFloat(bt==null?void 0:bt.value)||28,1,128),y=ae(parseFloat(_t==null?void 0:_t.value)||48,1,128);if(u>y){const S=u;u=y,y=S,bt&&(bt.value=String(u)),_t&&(_t.value=String(y))}U0=u,N0=y,Fo=ae(parseFloat(vt==null?void 0:vt.value)||1,1,100),vt&&vt.value!==String(Fo)&&(vt.value=String(Fo));const b=ae(parseFloat(vr==null?void 0:vr.value)||20,5,60),v=ae(parseFloat(bi==null?void 0:bi.value)||23.4,0,45),M=ae(parseFloat(_i==null?void 0:_i.value)||0,0,1);if(Me!=null&&Me.enabled&&Me.ready){const S={timeScale:e*60,readbackIntervalS:1/t,evapStrength:r,precipStrength:s,windStrength:a,oceanInertia:l,atmoThicknessM:b*1e3,axialTiltDeg:v,seasonPhase:M};n==="2d"&&(S.moistureLayers=i),Me.setConfig(S)}if(L0=c,Rd=1/d,ns&&(Me!=null&&Me.enabled)&&B0(),dA(o),hA(x),QT(m),ZT(m),Ae.setAtmosphereWeather(Wn(),p),Gu(),Gu(),F0(),Sn){const S=((qe==null?void 0:qe.checked)??!1)&&h;if(Sn.setEnabled(S),Sn.setStrength(f),Sn.setDensity(ae(.15+f*.35,0,1)),Le){const w=(Le.radius??un)+(Le.heightScale??0);Sn.setPlanetNearRadius(w)}const E=pA(),A=.7+f*.65;Sn.setSizes({dropLength:E*(6*A),dropWidth:E*(.08*A),volumeRadius:E*(340*A),volumeHeight:E*(260*A),fallDistance:E*(420*A)})}}function kA(n){if(!(dn!=null&&dn.checked)||!((qe==null?void 0:qe.checked)??!1))return;const e=Math.min(Math.max(n??0,0),.25);if(e<=0)return;const t=e*1e3;Ve.emaMs=Ve.emaMs*.9+t*.1;const i=Ve.emaMs>Yr.highMs,r=Ve.emaMs<Yr.lowMs;if(i?(Ve.overBudgetS+=e,Ve.underBudgetS=0):r?(Ve.underBudgetS+=e,Ve.overBudgetS=0):(Ve.overBudgetS=0,Ve.underBudgetS=0),Ve.cooldownS>0){Ve.cooldownS=Math.max(0,Ve.cooldownS-e);return}const s=Ta();Ve.overBudgetS>=Yr.downDelayS?(Sr(s)&&Ve.tier3d>0?(Ve.tier3d-=1,Ks(s)):s==="2d"&&Ve.tier2d>0&&(Ve.tier2d-=1,Ks(s)),Ve.cooldownS=Yr.cooldownDownS,Ve.overBudgetS=0):Ve.underBudgetS>=Yr.upDelayS&&(Sr(s)&&Ve.tier3d<Dd.length-1?(Ve.tier3d+=1,Ks(s)):s==="2d"&&Ve.tier2d<Id.length-1&&(Ve.tier2d+=1,Ks(s)),Ve.cooldownS=Yr.cooldownUpS,Ve.underBudgetS=0)}function va(){Er(),Y0(),Gu(),Gd(),uA(),F0(),Al(new D().copy(an.position).normalize())}function GA(){dn!=null&&dn.checked?kd():$0()}[al,T0,A0,gr].forEach(n=>{n.addEventListener(n.type==="color"?"input":"change",Xu),n.type==="range"&&n.addEventListener("input",Xu)});[ol,Js,ea,ta,na,ia,ra,sa].forEach(n=>{n.addEventListener(n.type==="color"?"input":"change",$u),n.type==="range"&&n.addEventListener("input",$u)});[qe,Nn,xi,ls,Et,bt,_t,vt,vr,cs,Hi,ht,Tt,Wi,qi,Xi,$i,Yi,Jn,ei,ji,Ki,us,Qi,gn].forEach(n=>{n&&(n.addEventListener(n.type==="checkbox"?"change":n.type==="color"?"input":"change",va),n.type==="range"&&n.addEventListener("input",va))});dn&&dn.addEventListener("change",GA);sl&&sl.addEventListener("click",bA);Kn&&(Kn.addEventListener("input",n=>Up(Number(n.target.value))),Kn.addEventListener("change",n=>Up(Number(n.target.value))),ws&&(ws.textContent=Kn.value));ma&&ma.addEventListener("click",()=>{qe!=null&&qe.checked&&Me!=null&&Me.enabled&&Me.ready&&Me.hasSurface&&(H0(),Me.update(0,dl,{dtSimOverride:600,forceReadback:!0}))});dn!=null&&dn.checked&&kd();document.addEventListener("surface",Ld);YT.addEventListener("click",()=>{const n=Od(),e=Qn.length?Qn[Qn.length-1].height:n.height,t={...n,id:`extra-${Date.now()}`,height:e+.3};Qn.push(t),zd(),Fi(new D().copy(an.position).normalize())});window.addEventListener("resize",RA);[Io,Lo,Uo].forEach(n=>{n&&n.addEventListener("input",Er)});oa&&oa.addEventListener("change",Er);Bo(!0);Y0();(async()=>{var n;try{await Ae.initOceanCompute(),(n=Ae.oceanComputeSystem)!=null&&n.enabled&&console.log("[Ocean] WebGPU compute ocean initialized")}catch(e){console.warn("[Ocean] Failed to init compute ocean:",e)}})();yr&&yr.addEventListener("change",()=>{if(!Le||!Ae.planet)return;const n=Fd(),e=Le,t=Ae.buildWaterMesh(e.radius,e.subdivisions,e.seaLevel,e.heightScale,e.iceCap,n);Ae.replaceWater(t),P0=Ae.water,Pt.setStatus(`Water shader: ${n}`)});const Hp=SA();Hp&&er&&(er.value=Hp);V0(er.value);Bd(er.value);zd();aA();Zi.setAnimationLoop(DA);IA();function VA(){if(!mn)return;const n=new D().copy(fs).normalize().multiplyScalar(-1),e=new D().copy(wt.position).sub(mn.position).normalize(),t=Math.max(0,n.dot(e)),i=mn.material;i.emissiveIntensity=0,i.color.setScalar(.75+.25*t),i.needsUpdate=!0}
