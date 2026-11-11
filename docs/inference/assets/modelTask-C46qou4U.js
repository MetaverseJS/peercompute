import{_ as Li}from"./index-L3PMMKML.js";import{c as Xi}from"./GgufArtifactReader-CuyxhwUc.js";import{aX as vi,aw as j,aY as Zi,
aZ as Oi,a_ as Yi,au as ni,a$ as Gi}from"./main-BVBDmgKD.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ni="182",ei=0,Ji=1,ri=1,ai=100,hi=204,oi=205,li=3,$i=0,Pi=300,ci=1e3,he=1001,ui=1002,Hi=1006,ji=1008,Qi=1009,Ki=1015,
ts=1023,Ui="",lt="srgb",di="srgb-linear",fi="linear",Re="srgb",Pt=7680,pi=519,mi=35044,oe=35048,le=2e3,xi=2001;function es(p){
for(let t=p.length-1;t>=0;--t)if(p[t]>=65535)return!0;return!1}function yi(p){return document.createElementNS("http://ww\
w.w3.org/1999/xhtml",p)}const gi={};function Q(...p){const t="THREE."+p.shift();console.warn(t,...p)}function Dt(...p){const t="\
THREE."+p.shift();console.error(t,...p)}function bi(...p){const t=p.join(" ");t in gi||(gi[t]=!0,Q(...p))}class Be{addEventListener(t,e){
this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].
push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){
const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const n=s.indexOf(e);n!==-1&&s.splice(n,1)}}dispatchEvent(t){
const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let n=0,
a=s.length;n<a;n++)s[n].call(this,t);t.target=null}}}const $=["00","01","02","03","04","05","06","07","08","09","0a","0b",
"0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23",
"24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b",
"3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53",
"54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b",
"6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83",
"84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b",
"9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3",
"b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb",
"cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3",
"e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb",
"fc","fd","fe","ff"];function ie(){const p=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|
0,i=Math.random()*4294967295|0;return($[p&255]+$[p>>8&255]+$[p>>16&255]+$[p>>24&255]+"-"+$[t&255]+$[t>>8&255]+"-"+$[t>>16&
15|64]+$[t>>24&255]+"-"+$[e&63|128]+$[e>>8&255]+"-"+$[e>>16&255]+$[e>>24&255]+$[i&255]+$[i>>8&255]+$[i>>16&255]+$[i>>24&
255]).toLowerCase()}function v(p,t,e){return Math.max(t,Math.min(e,p))}function is(p,t){return(p%t+t)%t}function De(p,t,e){
return(1-e)*p+e*t}function Ht(p,t){switch(t.constructor){case Float32Array:return p;case Uint32Array:return p/4294967295;case Uint16Array:
return p/65535;case Uint8Array:return p/255;case Int32Array:return Math.max(p/2147483647,-1);case Int16Array:return Math.
max(p/32767,-1);case Int8Array:return Math.max(p/127,-1);default:throw new Error("Invalid component type.")}}function K(p,t){
switch(t.constructor){case Float32Array:return p;case Uint32Array:return Math.round(p*4294967295);case Uint16Array:return Math.
round(p*65535);case Uint8Array:return Math.round(p*255);case Int32Array:return Math.round(p*2147483647);case Int16Array:
return Math.round(p*32767);case Int8Array:return Math.round(p*127);default:throw new Error("Invalid component type.")}}class ut{constructor(t=0,e=0){
ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){
this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){
return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("in\
dex is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error(
"index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){
return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.
y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){
return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,
this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){
return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.
y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.
x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=v(this.x,t.x,e.x),this.y=v(this.y,t.y,e.
y),this}clampScalar(t,e){return this.x=v(this.x,t,e),this.y=v(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.
divideScalar(i||1).multiplyScalar(v(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){
return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(
this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.
x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*
this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.
abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){
const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(v(i,-1,
1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*
e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(
t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,
this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],
this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(
e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),n=this.x-t.x,a=this.y-t.y;return this.x=n*i-a*s+t.x,this.y=n*
s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.
y}}class se{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,n,a,r){
let h=i[s+0],o=i[s+1],l=i[s+2],c=i[s+3],u=n[a+0],d=n[a+1],f=n[a+2],m=n[a+3];if(r<=0){t[e+0]=h,t[e+1]=o,t[e+2]=l,t[e+3]=c;
return}if(r>=1){t[e+0]=u,t[e+1]=d,t[e+2]=f,t[e+3]=m;return}if(c!==m||h!==u||o!==d||l!==f){let w=h*u+o*d+l*f+c*m;w<0&&(u=
-u,d=-d,f=-f,m=-m,w=-w);let b=1-r;if(w<.9995){const x=Math.acos(w),y=Math.sin(x);b=Math.sin(b*x)/y,r=Math.sin(r*x)/y,h=h*
b+u*r,o=o*b+d*r,l=l*b+f*r,c=c*b+m*r}else{h=h*b+u*r,o=o*b+d*r,l=l*b+f*r,c=c*b+m*r;const x=1/Math.sqrt(h*h+o*o+l*l+c*c);h*=
x,o*=x,l*=x,c*=x}}t[e]=h,t[e+1]=o,t[e+2]=l,t[e+3]=c}static multiplyQuaternionsFlat(t,e,i,s,n,a){const r=i[s],h=i[s+1],o=i[s+
2],l=i[s+3],c=n[a],u=n[a+1],d=n[a+2],f=n[a+3];return t[e]=r*f+l*c+h*d-o*u,t[e+1]=h*f+l*u+o*c-r*d,t[e+2]=o*f+l*d+r*u-h*c,
t[e+3]=l*f-r*c-h*u-o*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){
this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this.
_w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),
this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=
t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,n=t._z,a=t._order,r=Math.cos,h=Math.
sin,o=r(i/2),l=r(s/2),c=r(n/2),u=h(i/2),d=h(s/2),f=h(n/2);switch(a){case"XYZ":this._x=u*l*c+o*d*f,this._y=o*d*c-u*l*f,this.
_z=o*l*f+u*d*c,this._w=o*l*c-u*d*f;break;case"YXZ":this._x=u*l*c+o*d*f,this._y=o*d*c-u*l*f,this._z=o*l*f-u*d*c,this._w=o*
l*c+u*d*f;break;case"ZXY":this._x=u*l*c-o*d*f,this._y=o*d*c+u*l*f,this._z=o*l*f+u*d*c,this._w=o*l*c-u*d*f;break;case"ZYX":
this._x=u*l*c-o*d*f,this._y=o*d*c+u*l*f,this._z=o*l*f-u*d*c,this._w=o*l*c+u*d*f;break;case"YZX":this._x=u*l*c+o*d*f,this.
_y=o*d*c+u*l*f,this._z=o*l*f-u*d*c,this._w=o*l*c-u*d*f;break;case"XZY":this._x=u*l*c-o*d*f,this._y=o*d*c-u*l*f,this._z=o*
l*f+u*d*c,this._w=o*l*c+u*d*f;break;default:Q("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===
!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this.
_z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],n=e[8],
a=e[1],r=e[5],h=e[9],o=e[2],l=e[6],c=e[10],u=i+r+c;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(l-h)*d,this.
_y=(n-o)*d,this._z=(a-s)*d}else if(i>r&&i>c){const d=2*Math.sqrt(1+i-r-c);this._w=(l-h)/d,this._x=.25*d,this._y=(s+a)/d,
this._z=(n+o)/d}else if(r>c){const d=2*Math.sqrt(1+r-i-c);this._w=(n-o)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(h+l)/d}else{
const d=2*Math.sqrt(1+c-i-r);this._w=(a-s)/d,this._x=(n+o)/d,this._y=(h+l)/d,this._z=.25*d}return this._onChangeCallback(),
this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this.
_z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=
t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(v(this.dot(t),-1,1)))}rotateTowards(t,e){
const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.
set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),
this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+
this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){
let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this.
_z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){
return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,n=t._z,a=t._w,r=e._x,h=e._y,o=e._z,
l=e._w;return this._x=i*l+a*r+s*o-n*h,this._y=s*l+a*h+n*r-i*o,this._z=n*l+a*o+i*h-s*r,this._w=a*l-i*r-s*h-n*o,this._onChangeCallback(),
this}slerp(t,e){if(e<=0)return this;if(e>=1)return this.copy(t);let i=t._x,s=t._y,n=t._z,a=t._w,r=this.dot(t);r<0&&(i=-i,
s=-s,n=-n,a=-a,r=-r);let h=1-e;if(r<.9995){const o=Math.acos(r),l=Math.sin(o);h=Math.sin(h*o)/l,e=Math.sin(e*o)/l,this._x=
this._x*h+i*e,this._y=this._y*h+s*e,this._z=this._z*h+n*e,this._w=this._w*h+a*e,this._onChangeCallback()}else this._x=this.
_x*h+i*e,this._y=this._y*h+s*e,this._z=this._z*h+n*e,this._w=this._w*h+a*e,this.normalize();return this}slerpQuaternions(t,e,i){
return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.
sqrt(1-i),n=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),n*Math.sin(e),n*Math.cos(e))}equals(t){return t._x===
this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+
2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+
3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this.
_onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.
iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class _{constructor(t=0,e=0,i=0){_.prototype.isVector3=
!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.
x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){
switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of ran\
ge: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error(
"index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=
t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.
z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.
x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=
t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.
x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.
x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(wi.setFromEuler(t))}applyAxisAngle(t,e){
return this.applyQuaternion(wi.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,n=t.elements;return this.
x=n[0]*e+n[3]*i+n[6]*s,this.y=n[1]*e+n[4]*i+n[7]*s,this.z=n[2]*e+n[5]*i+n[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(
t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=t.elements,a=1/(n[3]*e+n[7]*i+n[11]*s+n[15]);return this.
x=(n[0]*e+n[4]*i+n[8]*s+n[12])*a,this.y=(n[1]*e+n[5]*i+n[9]*s+n[13])*a,this.z=(n[2]*e+n[6]*i+n[10]*s+n[14])*a,this}applyQuaternion(t){
const e=this.x,i=this.y,s=this.z,n=t.x,a=t.y,r=t.z,h=t.w,o=2*(a*s-r*i),l=2*(r*e-n*s),c=2*(n*i-a*e);return this.x=e+h*o+a*
c-r*l,this.y=i+h*l+r*o-n*c,this.z=s+h*c+n*l-a*o,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){
const e=this.x,i=this.y,s=this.z,n=t.elements;return this.x=n[0]*e+n[4]*i+n[8]*s,this.y=n[1]*e+n[5]*i+n[9]*s,this.z=n[2]*
e+n[6]*i+n[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.
multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=
v(this.x,t.x,e.x),this.y=v(this.y,t.y,e.y),this.z=v(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=v(this.x,t,e),this.
y=v(this.y,t,e),this.z=v(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(
v(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.
x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.
y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.
y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*
t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.
x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.
divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.
x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-
t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,n=t.z,a=e.
x,r=e.y,h=e.z;return this.x=s*h-n*r,this.y=n*a-i*h,this.z=i*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)
return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ve.copy(this).
projectOnVector(t),this.sub(ve)}reflect(t){return this.sub(ve.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.
sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(v(i,-1,1))}distanceTo(t){
return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+
i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){
return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.
x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(
t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){
const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(
t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,
this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(
t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=
t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=
t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.
x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.
random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.
cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ve=new _,wi=new se;
class kt{constructor(t,e,i,s,n,a,r,h,o){kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(
t,e,i,s,n,a,r,h,o)}set(t,e,i,s,n,a,r,h,o){const l=this.elements;return l[0]=t,l[1]=s,l[2]=r,l[3]=e,l[4]=n,l[5]=h,l[6]=i,
l[7]=a,l[8]=o,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(
this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.
set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){
return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,n=this.elements,a=i[0],r=i[3],
h=i[6],o=i[1],l=i[4],c=i[7],u=i[2],d=i[5],f=i[8],m=s[0],w=s[3],b=s[6],x=s[1],y=s[4],M=s[7],A=s[2],S=s[5],z=s[8];return n[0]=
a*m+r*x+h*A,n[3]=a*w+r*y+h*S,n[6]=a*b+r*M+h*z,n[1]=o*m+l*x+c*A,n[4]=o*w+l*y+c*S,n[7]=o*b+l*M+c*z,n[2]=u*m+d*x+f*A,n[5]=u*
w+d*y+f*S,n[8]=u*b+d*M+f*z,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=
t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],a=t[4],r=t[5],h=t[6],o=t[7],
l=t[8];return e*a*l-e*r*o-i*n*l+i*r*h+s*n*o-s*a*h}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],a=t[4],r=t[5],
h=t[6],o=t[7],l=t[8],c=l*a-r*o,u=r*h-l*n,d=o*n-a*h,f=e*c+i*u+s*d;if(f===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/f;
return t[0]=c*m,t[1]=(s*o-l*i)*m,t[2]=(r*i-s*a)*m,t[3]=u*m,t[4]=(l*e-s*h)*m,t[5]=(s*n-r*e)*m,t[6]=d*m,t[7]=(i*h-o*e)*m,t[8]=
(a*e-i*n)*m,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=
e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.
elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,n,a,r){
const h=Math.cos(n),o=Math.sin(n);return this.set(i*h,i*o,-i*(h*a+o*r)+a+t,-s*o,s*h,-s*(-o*a+h*r)+r+e,0,0,1),this}scale(t,e){
return this.premultiply(Oe.makeScale(t,e)),this}rotate(t){return this.premultiply(Oe.makeRotation(-t)),this}translate(t,e){
return this.premultiply(Oe.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,
0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,
1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<
9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){
const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],
t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Oe=new kt,Mi=new kt().set(.4123908,.3575843,
.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zi=new kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,
1.8759675,.0415551,.0556301,-.203977,1.0569715);function ss(){const p={enabled:!0,workingColorSpace:di,spaces:{},convert:function(s,n,a){
return this.enabled===!1||n===a||!n||!a||(this.spaces[n].transfer===Re&&(s.r=zt(s.r),s.g=zt(s.g),s.b=zt(s.b)),this.spaces[n].
primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.
spaces[a].transfer===Re&&(s.r=$t(s.r),s.g=$t(s.g),s.b=$t(s.b))),s},workingToColorSpace:function(s,n){return this.convert(
s,this.workingColorSpace,n)},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace)},getPrimaries:function(s){
return this.spaces[s].primaries},getTransfer:function(s){return s===Ui?fi:this.spaces[s].transfer},getToneMappingMode:function(s){
return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,n=this.workingColorSpace){
return s.fromArray(this.spaces[n].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,n,a){
return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.
spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.
spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,n){return bi("ColorManagement: .fro\
mWorkingColorSpace() has been renamed to .workingToColorSpace()."),p.workingToColorSpace(s,n)},toWorkingColorSpace:function(s,n){
return bi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),p.colorSpaceToWorking(s,
n)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return p.define({[di]:{primaries:t,whitePoint:i,transfer:fi,
toXYZ:Mi,fromXYZ:zi,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:lt},outputColorSpaceConfig:{drawingBufferColorSpace:lt}},
[lt]:{primaries:t,whitePoint:i,transfer:Re,toXYZ:Mi,fromXYZ:zi,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:lt}}}),
p}const rt=ss();function zt(p){return p<.04045?p*.0773993808:Math.pow(p*.9478672986+.0521327014,2.4)}function $t(p){return p<
.0031308?p*12.92:1.055*Math.pow(p,.41666)-.055}let Ut;class ns{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||
typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ut===void 0&&(Ut=yi("canvas")),
Ut.width=t.width,Ut.height=t.height;const s=Ut.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(
t,0,0,t.width,t.height),i=Ut}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=yi(
"canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(
0,0,t.width,t.height),n=s.data;for(let a=0;a<n.length;a++)n[a]=zt(n[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.
data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.
floor(zt(e[i]/255)*255):e[i]=zt(e[i]);return{data:e,width:t.width,height:t.height}}else return Q("ImageUtils.sRGBToLinea\
r(): Unsupported image type. No color space conversion applied."),t}}let rs=0;class as{constructor(t=null){this.isSource=
!0,Object.defineProperty(this,"id",{value:rs++}),this.uuid=ie(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){
const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):
typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.
depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&
t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.
isArray(s)){n=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?n.push(Ne(s[a].image)):n.push(Ne(s[a]))}else n=Ne(s);
i.url=n}return e||(t.images[this.uuid]=i),i}}function Ne(p){return typeof HTMLImageElement<"u"&&p instanceof HTMLImageElement||
typeof HTMLCanvasElement<"u"&&p instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&p instanceof ImageBitmap?ns.getDataURL(
p):p.data?{data:Array.from(p.data),width:p.width,height:p.height,type:p.data.constructor.name}:(Q("Texture: Unable to se\
rialize Texture."),{})}let hs=0;const Pe=new _;class vt extends Be{constructor(t=vt.DEFAULT_IMAGE,e=vt.DEFAULT_MAPPING,i=he,s=he,n=Hi,a=ji,r=ts,h=Qi,o=vt.
DEFAULT_ANISOTROPY,l=Ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hs++}),this.uuid=ie(),this.name=
"",this.source=new as(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=n,this.minFilter=
a,this.anisotropy=o,this.format=r,this.internalFormat=null,this.type=h,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.
center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=
!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=
null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=
0}get width(){return this.source.getSize(Pe).x}get height(){return this.source.getSize(Pe).y}get depth(){return this.source.
getSize(Pe).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(
this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.
updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().
copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.
channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=
t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.
repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.
matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,
this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=
t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=
!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){Q(`Texture.setValues(): parameter '${e}' has value of\
 undefined.`);continue}const s=this[e];if(s===void 0){Q(`Texture.setValues(): property '${e}' does not exist.`);continue}
s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){
const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{
version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.
mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.
x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,
type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.
flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};
return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent(
{type:"dispose"})}transformUv(t){if(this.mapping!==Pi)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ci:
t.x=t.x-Math.floor(t.x);break;case he:t.x=t.x<0?0:1;break;case ui:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:
t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ci:t.y=t.y-Math.floor(t.y);break;case he:t.y=t.y<0?
0:1;break;case ui:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&
(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.
pmremVersion++}}vt.DEFAULT_IMAGE=null;vt.DEFAULT_MAPPING=Pi;vt.DEFAULT_ANISOTROPY=1;class ne{constructor(t=0,e=0,i=0,s=1){
ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){
return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.
x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){
return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:
this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.
x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){
return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?
t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.
z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){
return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.
w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.
y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){
return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,n=this.w,a=t.elements;
return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*n,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*n,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*n,this.
w=a[3]*e+a[7]*i+a[11]*s+a[15]*n,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){
return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<
1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,
i,s,n;const h=t.elements,o=h[0],l=h[4],c=h[8],u=h[1],d=h[5],f=h[9],m=h[2],w=h[6],b=h[10];if(Math.abs(l-u)<.01&&Math.abs(
c-m)<.01&&Math.abs(f-w)<.01){if(Math.abs(l+u)<.1&&Math.abs(c+m)<.1&&Math.abs(f+w)<.1&&Math.abs(o+d+b-3)<.1)return this.set(
1,0,0,0),this;e=Math.PI;const y=(o+1)/2,M=(d+1)/2,A=(b+1)/2,S=(l+u)/4,z=(c+m)/4,g=(f+w)/4;return y>M&&y>A?y<.01?(i=0,s=.707106781,
n=.707106781):(i=Math.sqrt(y),s=S/i,n=z/i):M>A?M<.01?(i=.707106781,s=0,n=.707106781):(s=Math.sqrt(M),i=S/s,n=g/s):A<.01?
(i=.707106781,s=.707106781,n=0):(n=Math.sqrt(A),i=z/n,s=g/n),this.set(i,s,n,e),this}let x=Math.sqrt((w-f)*(w-f)+(c-m)*(c-
m)+(u-l)*(u-l));return Math.abs(x)<.001&&(x=1),this.x=(w-f)/x,this.y=(c-m)/x,this.z=(u-l)/x,this.w=Math.acos((o+d+b-1)/2),
this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){
return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){
return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){
return this.x=v(this.x,t.x,e.x),this.y=v(this.y,t.y,e.y),this.z=v(this.z,t.z,e.z),this.w=v(this.w,t.w,e.w),this}clampScalar(t,e){
return this.x=v(this.x,t,e),this.y=v(this.y,t,e),this.z=v(this.z,t,e),this.w=v(this.w,t,e),this}clampLength(t,e){const i=this.
length();return this.divideScalar(i||1).multiplyScalar(v(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(
this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(
this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(
this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.
trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.
z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+
this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.
w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.
divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.
x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-
t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.
y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){
return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.
getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),
this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class re{constructor(t=new _(
1/0,1/0,1/0),e=new _(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(
e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(at.fromArray(t,e));return this}setFromBufferAttribute(t){
this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(at.fromBufferAttribute(t,e));return this}setFromPoints(t){
this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=at.
copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.
makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),
this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,
this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?
t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(
this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),
this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.
updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const n=i.getAttribute("position");if(e===!0&&n!==void 0&&t.isInstancedMesh!==
!0)for(let a=0,r=n.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,at):at.fromBufferAttribute(n,a),at.applyMatrix4(t.matrixWorld),
this.expandByPoint(at);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ce.copy(t.boundingBox)):
(i.boundingBox===null&&i.computeBoundingBox(),ce.copy(i.boundingBox)),ce.applyMatrix4(t.matrixWorld),this.union(ce)}const s=t.
children;for(let n=0,a=s.length;n<a;n++)this.expandByObject(s[n],e);return this}containsPoint(t){return t.x>=this.min.x&&
t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.
min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){
return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.
z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.
y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,at),at.distanceToSquared(
t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.
x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=
t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.
z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.
getCenter(jt),ue.subVectors(this.max,jt),qt.subVectors(t.a,jt),Vt.subVectors(t.b,jt),Wt.subVectors(t.c,jt),St.subVectors(
Vt,qt),Ft.subVectors(Wt,Vt),Et.subVectors(qt,Wt);let e=[0,-St.z,St.y,0,-Ft.z,Ft.y,0,-Et.z,Et.y,St.z,0,-St.x,Ft.z,0,-Ft.x,
Et.z,0,-Et.x,-St.y,St.x,0,-Ft.y,Ft.x,0,-Et.y,Et.x,0];return!Ue(e,qt,Vt,Wt,ue)||(e=[1,0,0,0,1,0,0,0,1],!Ue(e,qt,Vt,Wt,ue))?
!1:(de.crossVectors(St,Ft),e=[de.x,de.y,de.z],Ue(e,qt,Vt,Wt,ue))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){
return this.clampPoint(t,at).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),
t.radius=this.getSize(at).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.
makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:
(xt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),xt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),
xt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),xt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),
xt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),xt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),
xt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),xt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),
this.setFromPoints(xt),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.
min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.
fromArray(t.min),this.max.fromArray(t.max),this}}const xt=[new _,new _,new _,new _,new _,new _,new _,new _],at=new _,ce=new re,
qt=new _,Vt=new _,Wt=new _,St=new _,Ft=new _,Et=new _,jt=new _,ue=new _,de=new _,It=new _;function Ue(p,t,e,i,s){for(let n=0,
a=p.length-3;n<=a;n+=3){It.fromArray(p,n);const r=s.x*Math.abs(It.x)+s.y*Math.abs(It.y)+s.z*Math.abs(It.z),h=t.dot(It),o=e.
dot(It),l=i.dot(It);if(Math.max(-Math.max(h,o,l),Math.min(h,o,l))>r)return!1}return!0}const os=new re,Qt=new _,qe=new _;
class ii{constructor(t=new _,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.
radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):os.setFromPoints(t).getCenter(i);let s=0;for(let n=0,
a=t.length;n<a;n++)s=Math.max(s,i.distanceToSquared(t[n]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.
copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=
-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(
this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=
e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=
this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(
this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),
t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.
radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())
return this.center.copy(t),this.radius=0,this;Qt.subVectors(t,this.center);const e=Qt.lengthSq();if(e>this.radius*this.radius){
const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Qt,s/i),this.radius+=s}return this}union(t){return t.
isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.
radius):(qe.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Qt.copy(t.center).add(qe)),this.expandByPoint(
Qt.copy(t.center).sub(qe))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.
constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=
t.radius,this.center.fromArray(t.center),this}}const yt=new _,Ve=new _,fe=new _,Ct=new _,We=new _,pe=new _,Le=new _;class ls{constructor(t=new _,e=new _(
0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.
origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,
t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,
yt)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):
e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){
const e=yt.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(yt.copy(this.origin).
addScaledVector(this.direction,e),yt.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Ve.copy(t).add(e).multiplyScalar(
.5),fe.copy(e).sub(t).normalize(),Ct.copy(this.origin).sub(Ve);const n=t.distanceTo(e)*.5,a=-this.direction.dot(fe),r=Ct.
dot(this.direction),h=-Ct.dot(fe),o=Ct.lengthSq(),l=Math.abs(1-a*a);let c,u,d,f;if(l>0)if(c=a*h-r,u=a*r-h,f=n*l,c>=0)if(u>=
-f)if(u<=f){const m=1/l;c*=m,u*=m,d=c*(c+a*u+2*r)+u*(a*c+u+2*h)+o}else u=n,c=Math.max(0,-(a*u+r)),d=-c*c+u*(u+2*h)+o;else
u=-n,c=Math.max(0,-(a*u+r)),d=-c*c+u*(u+2*h)+o;else u<=-f?(c=Math.max(0,-(-a*n+r)),u=c>0?-n:Math.min(Math.max(-n,-h),n),
d=-c*c+u*(u+2*h)+o):u<=f?(c=0,u=Math.min(Math.max(-n,-h),n),d=u*(u+2*h)+o):(c=Math.max(0,-(a*n+r)),u=c>0?n:Math.min(Math.
max(-n,-h),n),d=-c*c+u*(u+2*h)+o);else u=a>0?-n:n,c=Math.max(0,-(a*u+r)),d=-c*c+u*(u+2*h)+o;return i&&i.copy(this.origin).
addScaledVector(this.direction,c),s&&s.copy(Ve).addScaledVector(fe,u),d}intersectSphere(t,e){yt.subVectors(t.center,this.
origin);const i=yt.dot(this.direction),s=yt.dot(yt)-i*i,n=t.radius*t.radius;if(s>n)return null;const a=Math.sqrt(n-s),r=i-
a,h=i+a;return h<0?null:r<0?this.at(h,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.
center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.
origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.
distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===
0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,n,a,r,h;const o=1/this.direction.x,l=1/this.direction.y,c=1/
this.direction.z,u=this.origin;return o>=0?(i=(t.min.x-u.x)*o,s=(t.max.x-u.x)*o):(i=(t.max.x-u.x)*o,s=(t.min.x-u.x)*o),l>=
0?(n=(t.min.y-u.y)*l,a=(t.max.y-u.y)*l):(n=(t.max.y-u.y)*l,a=(t.min.y-u.y)*l),i>a||n>s||((n>i||isNaN(i))&&(i=n),(a<s||isNaN(
s))&&(s=a),c>=0?(r=(t.min.z-u.z)*c,h=(t.max.z-u.z)*c):(r=(t.max.z-u.z)*c,h=(t.min.z-u.z)*c),i>h||r>s)||((r>i||i!==i)&&(i=
r),(h<s||s!==s)&&(s=h),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,yt)!==null}intersectTriangle(t,e,i,s,n){
We.subVectors(e,t),pe.subVectors(i,t),Le.crossVectors(We,pe);let a=this.direction.dot(Le),r;if(a>0){if(s)return null;r=1}else if(a<
0)r=-1,a=-a;else return null;Ct.subVectors(this.origin,t);const h=r*this.direction.dot(pe.crossVectors(Ct,pe));if(h<0)return null;
const o=r*this.direction.dot(We.cross(Ct));if(o<0||h+o>a)return null;const l=-r*Ct.dot(Le);return l<0?null:this.at(l/a,n)}applyMatrix4(t){
return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&
t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(t,e,i,s,n,a,r,h,o,l,c,u,d,f,m,w){
dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,n,a,r,h,o,l,c,u,d,
f,m,w)}set(t,e,i,s,n,a,r,h,o,l,c,u,d,f,m,w){const b=this.elements;return b[0]=t,b[4]=e,b[8]=i,b[12]=s,b[1]=n,b[5]=a,b[9]=
r,b[13]=h,b[2]=o,b[6]=l,b[10]=c,b[14]=u,b[3]=d,b[7]=f,b[11]=m,b[15]=w,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,
0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=
i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=
i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=
i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],
e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.
setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.
set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();
const e=this.elements,i=t.elements,s=1/Lt.setFromMatrixColumn(t,0).length(),n=1/Lt.setFromMatrixColumn(t,1).length(),a=1/
Lt.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*n,e[5]=i[5]*n,e[6]=i[6]*
n,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.
elements,i=t.x,s=t.y,n=t.z,a=Math.cos(i),r=Math.sin(i),h=Math.cos(s),o=Math.sin(s),l=Math.cos(n),c=Math.sin(n);if(t.order===
"XYZ"){const u=a*l,d=a*c,f=r*l,m=r*c;e[0]=h*l,e[4]=-h*c,e[8]=o,e[1]=d+f*o,e[5]=u-m*o,e[9]=-r*h,e[2]=m-u*o,e[6]=f+d*o,e[10]=
a*h}else if(t.order==="YXZ"){const u=h*l,d=h*c,f=o*l,m=o*c;e[0]=u+m*r,e[4]=f*r-d,e[8]=a*o,e[1]=a*c,e[5]=a*l,e[9]=-r,e[2]=
d*r-f,e[6]=m+u*r,e[10]=a*h}else if(t.order==="ZXY"){const u=h*l,d=h*c,f=o*l,m=o*c;e[0]=u-m*r,e[4]=-a*c,e[8]=f+d*r,e[1]=d+
f*r,e[5]=a*l,e[9]=m-u*r,e[2]=-a*o,e[6]=r,e[10]=a*h}else if(t.order==="ZYX"){const u=a*l,d=a*c,f=r*l,m=r*c;e[0]=h*l,e[4]=
f*o-d,e[8]=u*o+m,e[1]=h*c,e[5]=m*o+u,e[9]=d*o-f,e[2]=-o,e[6]=r*h,e[10]=a*h}else if(t.order==="YZX"){const u=a*h,d=a*o,f=r*
h,m=r*o;e[0]=h*l,e[4]=m-u*c,e[8]=f*c+d,e[1]=c,e[5]=a*l,e[9]=-r*l,e[2]=-o*l,e[6]=d*c+f,e[10]=u-m*c}else if(t.order==="XZY"){
const u=a*h,d=a*o,f=r*h,m=r*o;e[0]=h*l,e[4]=-c,e[8]=o*l,e[1]=u*c+m,e[5]=a*l,e[9]=d*c-f,e[2]=f*c-d,e[6]=r*l,e[10]=m*c+u}return e[3]=
0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(cs,t,us)}lookAt(t,e,i){
const s=this.elements;return et.subVectors(t,e),et.lengthSq()===0&&(et.z=1),et.normalize(),Tt.crossVectors(i,et),Tt.lengthSq()===
0&&(Math.abs(i.z)===1?et.x+=1e-4:et.z+=1e-4,et.normalize(),Tt.crossVectors(i,et)),Tt.normalize(),me.crossVectors(et,Tt),
s[0]=Tt.x,s[4]=me.x,s[8]=et.x,s[1]=Tt.y,s[5]=me.y,s[9]=et.y,s[2]=Tt.z,s[6]=me.z,s[10]=et.z,this}multiply(t){return this.
multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.
elements,n=this.elements,a=i[0],r=i[4],h=i[8],o=i[12],l=i[1],c=i[5],u=i[9],d=i[13],f=i[2],m=i[6],w=i[10],b=i[14],x=i[3],
y=i[7],M=i[11],A=i[15],S=s[0],z=s[4],g=s[8],T=s[12],k=s[1],F=s[5],B=s[9],C=s[13],E=s[2],R=s[6],D=s[10],I=s[14],N=s[3],V=s[7],
X=s[11],U=s[15];return n[0]=a*S+r*k+h*E+o*N,n[4]=a*z+r*F+h*R+o*V,n[8]=a*g+r*B+h*D+o*X,n[12]=a*T+r*C+h*I+o*U,n[1]=l*S+c*k+
u*E+d*N,n[5]=l*z+c*F+u*R+d*V,n[9]=l*g+c*B+u*D+d*X,n[13]=l*T+c*C+u*I+d*U,n[2]=f*S+m*k+w*E+b*N,n[6]=f*z+m*F+w*R+b*V,n[10]=
f*g+m*B+w*D+b*X,n[14]=f*T+m*C+w*I+b*U,n[3]=x*S+y*k+M*E+A*N,n[7]=x*z+y*F+M*R+A*V,n[11]=x*g+y*B+M*D+A*X,n[15]=x*T+y*C+M*I+
A*U,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=
t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],
s=t[8],n=t[12],a=t[1],r=t[5],h=t[9],o=t[13],l=t[2],c=t[6],u=t[10],d=t[14],f=t[3],m=t[7],w=t[11],b=t[15],x=h*d-o*u,y=r*d-
o*c,M=r*u-h*c,A=a*d-o*l,S=a*u-h*l,z=a*c-r*l;return e*(m*x-w*y+b*M)-i*(f*x-w*A+b*S)+s*(f*y-m*A+b*z)-n*(f*M-m*S+w*z)}transpose(){
const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],
t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?
(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],n=t[3],
a=t[4],r=t[5],h=t[6],o=t[7],l=t[8],c=t[9],u=t[10],d=t[11],f=t[12],m=t[13],w=t[14],b=t[15],x=c*w*o-m*u*o+m*h*d-r*w*d-c*h*
b+r*u*b,y=f*u*o-l*w*o-f*h*d+a*w*d+l*h*b-a*u*b,M=l*m*o-f*c*o+f*r*d-a*m*d-l*r*b+a*c*b,A=f*c*h-l*m*h-f*r*u+a*m*u+l*r*w-a*c*
w,S=e*x+i*y+s*M+n*A;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const z=1/S;return t[0]=x*z,t[1]=(m*u*n-c*
w*n-m*s*d+i*w*d+c*s*b-i*u*b)*z,t[2]=(r*w*n-m*h*n+m*s*o-i*w*o-r*s*b+i*h*b)*z,t[3]=(c*h*n-r*u*n-c*s*o+i*u*o+r*s*d-i*h*d)*z,
t[4]=y*z,t[5]=(l*w*n-f*u*n+f*s*d-e*w*d-l*s*b+e*u*b)*z,t[6]=(f*h*n-a*w*n-f*s*o+e*w*o+a*s*b-e*h*b)*z,t[7]=(a*u*n-l*h*n+l*s*
o-e*u*o-a*s*d+e*h*d)*z,t[8]=M*z,t[9]=(f*c*n-l*m*n-f*i*d+e*m*d+l*i*b-e*c*b)*z,t[10]=(a*m*n-f*r*n+f*i*o-e*m*o-a*i*b+e*r*b)*
z,t[11]=(l*r*n-a*c*n-l*i*o+e*c*o+a*i*d-e*r*d)*z,t[12]=A*z,t[13]=(l*m*s-f*c*s+f*i*u-e*m*u-l*i*w+e*c*w)*z,t[14]=(f*r*s-a*m*
s-f*i*h+e*m*h+a*i*w-e*r*w)*z,t[15]=(a*c*s-l*r*s+l*i*h-e*c*h-a*i*u+e*r*u)*z,this}scale(t){const e=this.elements,i=t.x,s=t.
y,n=t.z;return e[0]*=i,e[4]*=s,e[8]*=n,e[1]*=i,e[5]*=s,e[9]*=n,e[2]*=i,e[6]*=s,e[10]*=n,e[3]*=i,e[7]*=s,e[11]*=n,this}getMaxScaleOnAxis(){
const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];
return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,
1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,
0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,
0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),
this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),n=1-i,a=t.x,r=t.y,h=t.z,o=n*a,l=n*r;return this.set(o*a+i,o*
r-s*h,o*h+s*r,0,o*r+s*h,l*r+i,l*h-s*a,0,o*h-s*r,l*h+s*a,n*h*h+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,
0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,n,a){return this.set(1,i,n,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){
const s=this.elements,n=e._x,a=e._y,r=e._z,h=e._w,o=n+n,l=a+a,c=r+r,u=n*o,d=n*l,f=n*c,m=a*l,w=a*c,b=r*c,x=h*o,y=h*l,M=h*
c,A=i.x,S=i.y,z=i.z;return s[0]=(1-(m+b))*A,s[1]=(d+M)*A,s[2]=(f-y)*A,s[3]=0,s[4]=(d-M)*S,s[5]=(1-(u+b))*S,s[6]=(w+x)*S,
s[7]=0,s[8]=(f+y)*z,s[9]=(w-x)*z,s[10]=(1-(u+m))*z,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.
elements;if(t.x=s[12],t.y=s[13],t.z=s[14],this.determinant()===0)return i.set(1,1,1),e.identity(),this;let n=Lt.set(s[0],
s[1],s[2]).length();const a=Lt.set(s[4],s[5],s[6]).length(),r=Lt.set(s[8],s[9],s[10]).length();this.determinant()<0&&(n=
-n),ht.copy(this);const o=1/n,l=1/a,c=1/r;return ht.elements[0]*=o,ht.elements[1]*=o,ht.elements[2]*=o,ht.elements[4]*=l,
ht.elements[5]*=l,ht.elements[6]*=l,ht.elements[8]*=c,ht.elements[9]*=c,ht.elements[10]*=c,e.setFromRotationMatrix(ht),i.
x=n,i.y=a,i.z=r,this}makePerspective(t,e,i,s,n,a,r=le,h=!1){const o=this.elements,l=2*n/(e-t),c=2*n/(i-s),u=(e+t)/(e-t),
d=(i+s)/(i-s);let f,m;if(h)f=n/(a-n),m=a*n/(a-n);else if(r===le)f=-(a+n)/(a-n),m=-2*a*n/(a-n);else if(r===xi)f=-a/(a-n),
m=-a*n/(a-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return o[0]=l,o[4]=0,
o[8]=u,o[12]=0,o[1]=0,o[5]=c,o[9]=d,o[13]=0,o[2]=0,o[6]=0,o[10]=f,o[14]=m,o[3]=0,o[7]=0,o[11]=-1,o[15]=0,this}makeOrthographic(t,e,i,s,n,a,r=le,h=!1){
const o=this.elements,l=2/(e-t),c=2/(i-s),u=-(e+t)/(e-t),d=-(i+s)/(i-s);let f,m;if(h)f=1/(a-n),m=a/(a-n);else if(r===le)
f=-2/(a-n),m=-(a+n)/(a-n);else if(r===xi)f=-1/(a-n),m=-n/(a-n);else throw new Error("THREE.Matrix4.makeOrthographic(): I\
nvalid coordinate system: "+r);return o[0]=l,o[4]=0,o[8]=0,o[12]=u,o[1]=0,o[5]=c,o[9]=0,o[13]=d,o[2]=0,o[6]=0,o[10]=f,o[14]=
m,o[3]=0,o[7]=0,o[11]=0,o[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;
return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;
return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=
i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Lt=new _,ht=new dt,cs=new _(
0,0,0),us=new _(1,1,1),Tt=new _,me=new _,et=new _,Ai=new dt,_i=new se;class ae{constructor(t=0,e=0,i=0,s=ae.DEFAULT_ORDER){
this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){
return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){
return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=
e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this.
_order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this.
_order,i=!0){const s=t.elements,n=s[0],a=s[4],r=s[8],h=s[1],o=s[5],l=s[9],c=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this.
_y=Math.asin(v(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-a,n)):(this._x=Math.atan2(u,o),
this._z=0);break;case"YXZ":this._x=Math.asin(-v(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(r,d),this._z=Math.atan2(
h,o)):(this._y=Math.atan2(-c,n),this._z=0);break;case"ZXY":this._x=Math.asin(v(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.
atan2(-c,d),this._z=Math.atan2(-a,o)):(this._y=0,this._z=Math.atan2(h,n));break;case"ZYX":this._y=Math.asin(-v(c,-1,1)),
Math.abs(c)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(h,n)):(this._x=0,this._z=Math.atan2(-a,o));break;case"Y\
ZX":this._z=Math.asin(v(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-l,o),this._y=Math.atan2(-c,n)):(this._x=0,this.
_y=Math.atan2(r,d));break;case"XZY":this._z=Math.asin(-v(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,o),this._y=
Math.atan2(r,n)):(this._x=Math.atan2(-l,d),this._y=0);break;default:Q("Euler: .setFromRotationMatrix() encountered an un\
known order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ai.makeRotationFromQuaternion(
t),this.setFromRotationMatrix(Ai,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return _i.
setFromEuler(this),this.setFromQuaternion(_i,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===
this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),
this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=
t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ae.DEFAULT_ORDER=
"XYZ";class ds{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=
-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==
0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let fs=0;const Si=new _,Xt=new se,gt=new dt,xe=new _,Kt=new _,ps=new _,ms=new se,
Fi=new _(1,0,0),Ci=new _(0,1,0),Ti=new _(0,0,1),Bi={type:"added"},xs={type:"removed"},Zt={type:"childadded",child:null},
Xe={type:"childremoved",child:null};class At extends Be{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,
"id",{value:fs++}),this.uuid=ie(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=At.DEFAULT_UP.
clone();const t=new _,e=new ae,i=new se,s=new _(1,1,1);function n(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(
i,void 0,!1)}e._onChange(n),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},
rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,
enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new kt}}),this.matrix=new dt,this.matrixWorld=
new dt,this.matrixAutoUpdate=At.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,
this.matrixWorldNeedsUpdate=!1,this.layers=new ds,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=
!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData=
{}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),
this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.
quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){
this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){
this.quaternion.copy(t)}rotateOnAxis(t,e){return Xt.setFromAxisAngle(t,e),this.quaternion.multiply(Xt),this}rotateOnWorldAxis(t,e){
return Xt.setFromAxisAngle(t,e),this.quaternion.premultiply(Xt),this}rotateX(t){return this.rotateOnAxis(Fi,t)}rotateY(t){
return this.rotateOnAxis(Ci,t)}rotateZ(t){return this.rotateOnAxis(Ti,t)}translateOnAxis(t,e){return Si.copy(t).applyQuaternion(
this.quaternion),this.position.add(Si.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Fi,t)}translateY(t){
return this.translateOnAxis(Ci,t)}translateZ(t){return this.translateOnAxis(Ti,t)}localToWorld(t){return this.updateWorldMatrix(
!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(gt.copy(this.
matrixWorld).invert())}lookAt(t,e,i){t.isVector3?xe.copy(t):xe.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,
!1),Kt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gt.lookAt(Kt,xe,this.up):gt.lookAt(xe,Kt,this.
up),this.quaternion.setFromRotationMatrix(gt),s&&(gt.extractRotation(s.matrixWorld),Xt.setFromRotationMatrix(gt),this.quaternion.
premultiply(Xt.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}
return t===this?(Dt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),
t.parent=this,this.children.push(t),t.dispatchEvent(Bi),Zt.child=t,this.dispatchEvent(Zt),Zt.child=null):Dt("Object3D.ad\
d: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)
this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(
e,1),t.dispatchEvent(xs),Xe.child=t,this.dispatchEvent(Xe),Xe.child=null),this}removeFromParent(){const t=this.parent;return t!==
null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),gt.
copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),gt.multiply(t.parent.matrixWorld)),t.
applyMatrix4(gt),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bi),
Zt.child=t,this.dispatchEvent(Zt),Zt.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){
return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.
length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){
this[t]===e&&i.push(this);const s=this.children;for(let n=0,a=s.length;n<a;n++)s[n].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){
return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(
!0,!1),this.matrixWorld.decompose(Kt,t,ps),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(
Kt,ms,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).
normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){
if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){
const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,
this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||
t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(
this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<
s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),
this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.
matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let n=0,
a=s.length;n<a;n++)s[n].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},
materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",
generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===
!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===
!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.
userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===
!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.
toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedM\
esh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.
reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.
toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(
r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.
slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,
s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=
this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(
t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=
this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function n(r,h){return r[h.
uuid]===void 0&&(r[h.uuid]=h.toJSON(t)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.
background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.
isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||
this.isLine||this.isPoints){s.geometry=n(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==
void 0){const h=r.shapes;if(Array.isArray(h))for(let o=0,l=h.length;o<l;o++){const c=h[o];n(t.shapes,c)}else n(t.shapes,
h)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(t.
skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];
for(let h=0,o=this.material.length;h<o;h++)r.push(n(t.materials,this.material[h]));s.material=r}else s.material=n(t.materials,
this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].
toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const h=this.animations[r];
s.animations.push(n(t.animations,h))}}if(e){const r=a(t.geometries),h=a(t.materials),o=a(t.textures),l=a(t.images),c=a(t.
shapes),u=a(t.skeletons),d=a(t.animations),f=a(t.nodes);r.length>0&&(i.geometries=r),h.length>0&&(i.materials=h),o.length>
0&&(i.textures=o),l.length>0&&(i.images=l),c.length>0&&(i.shapes=c),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=
d),f.length>0&&(i.nodes=f)}return i.object=s,i;function a(r){const h=[];for(const o in r){const l=r[o];delete l.metadata,
h.push(l)}return h}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.
up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(
t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=
t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=
t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=
t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<
t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}At.DEFAULT_UP=new _(0,1,0);At.DEFAULT_MATRIX_AUTO_UPDATE=
!0;At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ot=new _,bt=new _,Ze=new _,wt=new _,Yt=new _,Gt=new _,ki=new _,Ye=new _,
Ge=new _,Je=new _,$e=new ne,He=new ne,je=new ne;class ct{constructor(t=new _,e=new _,i=new _){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){
s.subVectors(i,e),ot.subVectors(t,e),s.cross(ot);const n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(
0,0,0)}static getBarycoord(t,e,i,s,n){ot.subVectors(s,e),bt.subVectors(i,e),Ze.subVectors(t,e);const a=ot.dot(ot),r=ot.dot(
bt),h=ot.dot(Ze),o=bt.dot(bt),l=bt.dot(Ze),c=a*o-r*r;if(c===0)return n.set(0,0,0),null;const u=1/c,d=(o*h-r*l)*u,f=(a*l-
r*h)*u;return n.set(1-d-f,f,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,wt)===null?!1:wt.x>=0&&wt.
y>=0&&wt.x+wt.y<=1}static getInterpolation(t,e,i,s,n,a,r,h){return this.getBarycoord(t,e,i,s,wt)===null?(h.x=0,h.y=0,"z"in
h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(n,wt.x),h.addScaledVector(a,wt.y),h.addScaledVector(
r,wt.z),h)}static getInterpolatedAttribute(t,e,i,s,n,a){return $e.setScalar(0),He.setScalar(0),je.setScalar(0),$e.fromBufferAttribute(
t,e),He.fromBufferAttribute(t,i),je.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector($e,n.x),a.addScaledVector(
He,n.y),a.addScaledVector(je,n.z),a}static isFrontFacing(t,e,i,s){return ot.subVectors(i,e),bt.subVectors(t,e),ot.cross(
bt).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.
a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(
t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){
return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ot.subVectors(this.c,this.b),bt.subVectors(
this.a,this.b),ot.cross(bt).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){
return ct.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){
return ct.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,n){return ct.getInterpolation(t,this.a,this.b,
this.c,e,i,s,n)}containsPoint(t){return ct.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return ct.isFrontFacing(
this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.
b,n=this.c;let a,r;Yt.subVectors(s,i),Gt.subVectors(n,i),Ye.subVectors(t,i);const h=Yt.dot(Ye),o=Gt.dot(Ye);if(h<=0&&o<=
0)return e.copy(i);Ge.subVectors(t,s);const l=Yt.dot(Ge),c=Gt.dot(Ge);if(l>=0&&c<=l)return e.copy(s);const u=h*c-l*o;if(u<=
0&&h>=0&&l<=0)return a=h/(h-l),e.copy(i).addScaledVector(Yt,a);Je.subVectors(t,n);const d=Yt.dot(Je),f=Gt.dot(Je);if(f>=
0&&d<=f)return e.copy(n);const m=d*o-h*f;if(m<=0&&o>=0&&f<=0)return r=o/(o-f),e.copy(i).addScaledVector(Gt,r);const w=l*
f-d*c;if(w<=0&&c-l>=0&&d-f>=0)return ki.subVectors(n,s),r=(c-l)/(c-l+(d-f)),e.copy(s).addScaledVector(ki,r);const b=1/(w+
m+u);return a=m*b,r=u*b,e.copy(i).addScaledVector(Yt,a).addScaledVector(Gt,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(
this.b)&&t.c.equals(this.c)}}const qi={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,
beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,
cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,
cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,
darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,
darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,
deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,
fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,
grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,
lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,
lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,
lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,
lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,
mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,
midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,
olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,
paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,
powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,
salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,
slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,
tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},
Bt={h:0,s:0,l:0},ye={h:0,s:0,l:0};function Qe(p,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?p+(t-p)*6*e:e<1/2?t:e<2/3?p+(t-
p)*6*(2/3-e):p}class Mt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){
if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.
setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=lt){return t=
Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,rt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=rt.
workingColorSpace){return this.r=t,this.g=e,this.b=i,rt.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=rt.workingColorSpace){
if(t=is(t,1),e=v(e,0,1),i=v(i,0,1),e===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+e):i+e-i*e,a=2*i-n;this.r=Qe(a,n,
t+1/3),this.g=Qe(a,n,t),this.b=Qe(a,n,t-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(t,e=lt){function i(n){n!==
void 0&&parseFloat(n)<1&&Q("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){
let n;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,
parseInt(n[3],10))/255,e);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(n[4]),
this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,
e);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.
exec(r))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,e);break;default:Q("Co\
lor: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const n=s[1],a=n.length;if(a===3)return this.setRGB(
parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(
n,16),e);Q("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=lt){
const i=qi[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Q("Color: Unknown color "+t),this}clone(){return new this.
constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=
zt(t.r),this.g=zt(t.g),this.b=zt(t.b),this}copyLinearToSRGB(t){return this.r=$t(t.r),this.g=$t(t.g),this.b=$t(t.b),this}convertSRGBToLinear(){
return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=lt){return rt.
workingToColorSpace(H.copy(this),t),Math.round(v(H.r*255,0,255))*65536+Math.round(v(H.g*255,0,255))*256+Math.round(v(H.b*
255,0,255))}getHexString(t=lt){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=rt.workingColorSpace){rt.
workingToColorSpace(H.copy(this),e);const i=H.r,s=H.g,n=H.b,a=Math.max(i,s,n),r=Math.min(i,s,n);let h,o;const l=(r+a)/2;
if(r===a)h=0,o=0;else{const c=a-r;switch(o=l<=.5?c/(a+r):c/(2-a-r),a){case i:h=(s-n)/c+(s<n?6:0);break;case s:h=(n-i)/c+
2;break;case n:h=(i-s)/c+4;break}h/=6}return t.h=h,t.s=o,t.l=l,t}getRGB(t,e=rt.workingColorSpace){return rt.workingToColorSpace(
H.copy(this),e),t.r=H.r,t.g=H.g,t.b=H.b,t}getStyle(t=lt){rt.workingToColorSpace(H.copy(this),t);const e=H.r,i=H.g,s=H.b;
return t!==lt?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)}\
,${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Bt),this.setHSL(Bt.h+t,Bt.s+e,Bt.l+i)}add(t){return this.r+=
t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.
r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(
0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=
t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){
return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Bt),t.getHSL(ye);
const i=De(Bt.h,ye.h,e),s=De(Bt.s,ye.s,e),n=De(Bt.l,ye.l,e);return this.setHSL(i,s,n),this}setFromVector3(t){return this.
r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,n=t.elements;return this.r=n[0]*e+n[3]*
i+n[6]*s,this.g=n[1]*e+n[4]*i+n[7]*s,this.b=n[2]*e+n[5]*i+n[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===
this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=
this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){
return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const H=new Mt;Mt.NAMES=qi;let ys=0;class gs extends Be{constructor(){
super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ys++}),this.uuid=ie(),this.name="",this.type="Material",
this.blending=ri,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hi,
this.blendDst=oi,this.blendEquation=ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.
blendColor=new Mt(0,0,0),this.blendAlpha=0,this.depthFunc=li,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=
255,this.stencilFunc=pi,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pt,this.stencilZFail=Pt,this.stencilZPass=
Pt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.
colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=
!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.
toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){
this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.
onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){Q(`Material: paramet\
er '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Q(`Material: '${e}' is not a property of THR\
EE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===
void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Mate\
rial.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=
this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),
this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),
this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.
emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),
this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=
this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.
shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==
void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.
clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=
this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=
this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.
sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.
isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),
this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),
this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&
this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.
iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==
void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),
this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.
isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.
alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.
lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=
this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.
toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(
t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.
isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=
this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),
this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.
emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.
specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=
this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.
specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==
void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==
void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==
void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.
toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.
isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),
this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==
void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&
(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=
this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ri&&(i.blending=
this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=
this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==hi&&(i.blendSrc=this.blendSrc),this.blendDst!==oi&&
(i.blendDst=this.blendDst),this.blendEquation!==ai&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=
this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=
this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==
0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==li&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.
depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.
stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pi&&(i.stencilFunc=this.stencilFunc),
this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),
this.stencilFail!==Pt&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pt&&(i.stencilZFail=this.stencilZFail),this.
stencilZPass!==Pt&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==
void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==
0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),
this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),
this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=
!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=
!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===
!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),
this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=
this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&
(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(n){
const a=[];for(const r in n){const h=n[r];delete h.metadata,a.push(h)}return a}if(e){const n=s(t.textures),a=s(t.images);
n.length>0&&(i.textures=n),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.
name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=
t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.
blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),
this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=
t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.
stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;
const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let n=0;n!==s;++n)i[n]=e[n].clone()}
return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,
this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,
this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,
this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,
this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(
t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Vi extends gs{constructor(t){
super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Mt(16777215),this.map=null,this.lightMap=
null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=
null,this.envMapRotation=new ae,this.combine=$i,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=
1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),
this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.
aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,
this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=
t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,
this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const L=new _,ge=new ut;let bs=0;class mt{constructor(t,e,i=!1){
if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=
!0,Object.defineProperty(this,"id",{value:bs++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/
e:0,this.normalized=i,this.usage=mi,this.updateRanges=[],this.gpuType=Ki,this.version=0}onUploadCallback(){}set needsUpdate(t){
t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){
this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,
this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,
i*=e.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.
set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ge.fromBufferAttribute(this,e),ge.applyMatrix3(
t),this.setXY(e,ge.x,ge.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)L.fromBufferAttribute(this,e),L.applyMatrix3(
t),this.setXYZ(e,L.x,L.y,L.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)L.fromBufferAttribute(this,e),
L.applyMatrix4(t),this.setXYZ(e,L.x,L.y,L.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)L.fromBufferAttribute(
this,e),L.applyNormalMatrix(t),this.setXYZ(e,L.x,L.y,L.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)
L.fromBufferAttribute(this,e),L.transformDirection(t),this.setXYZ(e,L.x,L.y,L.z);return this}set(t,e=0){return this.array.
set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ht(i,this.array)),i}setComponent(t,e,i){
return this.normalized&&(i=K(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];
return this.normalized&&(e=Ht(e,this.array)),e}setX(t,e){return this.normalized&&(e=K(e,this.array)),this.array[t*this.itemSize]=
e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ht(e,this.array)),e}setY(t,e){return this.
normalized&&(e=K(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.
normalized&&(e=Ht(e,this.array)),e}setZ(t,e){return this.normalized&&(e=K(e,this.array)),this.array[t*this.itemSize+2]=e,
this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ht(e,this.array)),e}setW(t,e){return this.normalized&&
(e=K(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=K(e,this.
array),i=K(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&
(e=K(e,this.array),i=K(i,this.array),s=K(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,n){
return t*=this.itemSize,this.normalized&&(e=K(e,this.array),i=K(i,this.array),s=K(s,this.array),n=K(n,this.array)),this.
array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=n,this}onUpload(t){return this.onUploadCallback=t,this}clone(){
return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.
constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.
usage!==mi&&(t.usage=this.usage),t}}class ws extends mt{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ms extends mt{constructor(t,e,i){
super(new Uint32Array(t),e,i)}}class zs extends mt{constructor(t,e,i){super(new Float32Array(t),e,i)}}let As=0;const st=new dt,
Ke=new At,Jt=new _,it=new re,te=new re,Y=new _;class ke extends Be{constructor(){super(),this.isBufferGeometry=!0,Object.
defineProperty(this,"id",{value:As++}),this.uuid=ie(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=
null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=
null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){
return Array.isArray(t)?this.index=new(es(t)?Ms:ws)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.
indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.
attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==
void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){
this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(
t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new kt().getNormalMatrix(t);i.applyNormalMatrix(
n),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==
null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return st.
makeRotationFromQuaternion(t),this.applyMatrix4(st),this}rotateX(t){return st.makeRotationX(t),this.applyMatrix4(st),this}rotateY(t){
return st.makeRotationY(t),this.applyMatrix4(st),this}rotateZ(t){return st.makeRotationZ(t),this.applyMatrix4(st),this}translate(t,e,i){
return st.makeTranslation(t,e,i),this.applyMatrix4(st),this}scale(t,e,i){return st.makeScale(t,e,i),this.applyMatrix4(st),
this}lookAt(t){return Ke.lookAt(t),Ke.updateMatrix(),this.applyMatrix4(Ke.matrix),this}center(){return this.computeBoundingBox(),
this.boundingBox.getCenter(Jt).negate(),this.translate(Jt.x,Jt.y,Jt.z),this}setFromPoints(t){const e=this.getAttribute("\
position");if(e===void 0){const i=[];for(let s=0,n=t.length;s<n;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute(
"position",new zs(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const n=t[s];e.setXYZ(s,n.x,n.y,n.z||
0)}t.length>e.count&&Q("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),
e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new re);const t=this.attributes.
position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Dt("BufferGeometry.computeBoundingBox(): GLBufferA\
ttribute requires a manual bounding box.",this),this.boundingBox.set(new _(-1/0,-1/0,-1/0),new _(1/0,1/0,1/0));return}if(t!==
void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const n=e[i];it.setFromBufferAttribute(
n),this.morphTargetsRelative?(Y.addVectors(this.boundingBox.min,it.min),this.boundingBox.expandByPoint(Y),Y.addVectors(this.
boundingBox.max,it.max),this.boundingBox.expandByPoint(Y)):(this.boundingBox.expandByPoint(it.min),this.boundingBox.expandByPoint(
it.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.
min.z))&&Dt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely t\
o have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);const t=this.
attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Dt("BufferGeometry.computeBoundingSpher\
e(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new _,1/0);return}if(t){const i=this.
boundingSphere.center;if(it.setFromBufferAttribute(t),e)for(let n=0,a=e.length;n<a;n++){const r=e[n];te.setFromBufferAttribute(
r),this.morphTargetsRelative?(Y.addVectors(it.min,te.min),it.expandByPoint(Y),Y.addVectors(it.max,te.max),it.expandByPoint(
Y)):(it.expandByPoint(te.min),it.expandByPoint(te.max))}it.getCenter(i);let s=0;for(let n=0,a=t.count;n<a;n++)Y.fromBufferAttribute(
t,n),s=Math.max(s,i.distanceToSquared(Y));if(e)for(let n=0,a=e.length;n<a;n++){const r=e[n],h=this.morphTargetsRelative;
for(let o=0,l=r.count;o<l;o++)Y.fromBufferAttribute(r,o),h&&(Jt.fromBufferAttribute(t,o),Y.add(Jt)),s=Math.max(s,i.distanceToSquared(
Y))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Dt('BufferGeometry.computeBoundingSphere(\
): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.
index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Dt("BufferGeometry: .compute\
Tangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,n=e.
uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mt(new Float32Array(4*i.count),4));const a=this.getAttribute(
"tangent"),r=[],h=[];for(let g=0;g<i.count;g++)r[g]=new _,h[g]=new _;const o=new _,l=new _,c=new _,u=new ut,d=new ut,f=new ut,
m=new _,w=new _;function b(g,T,k){o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,T),c.fromBufferAttribute(i,k),u.fromBufferAttribute(
n,g),d.fromBufferAttribute(n,T),f.fromBufferAttribute(n,k),l.sub(o),c.sub(o),d.sub(u),f.sub(u);const F=1/(d.x*f.y-f.x*d.
y);isFinite(F)&&(m.copy(l).multiplyScalar(f.y).addScaledVector(c,-d.y).multiplyScalar(F),w.copy(c).multiplyScalar(d.x).addScaledVector(
l,-f.x).multiplyScalar(F),r[g].add(m),r[T].add(m),r[k].add(m),h[g].add(w),h[T].add(w),h[k].add(w))}let x=this.groups;x.length===
0&&(x=[{start:0,count:t.count}]);for(let g=0,T=x.length;g<T;++g){const k=x[g],F=k.start,B=k.count;for(let C=F,E=F+B;C<E;C+=
3)b(t.getX(C+0),t.getX(C+1),t.getX(C+2))}const y=new _,M=new _,A=new _,S=new _;function z(g){A.fromBufferAttribute(s,g),
S.copy(A);const T=r[g];y.copy(T),y.sub(A.multiplyScalar(A.dot(T))).normalize(),M.crossVectors(S,T);const F=M.dot(h[g])<0?
-1:1;a.setXYZW(g,y.x,y.y,y.z,F)}for(let g=0,T=x.length;g<T;++g){const k=x[g],F=k.start,B=k.count;for(let C=F,E=F+B;C<E;C+=
3)z(t.getX(C+0)),z(t.getX(C+1)),z(t.getX(C+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");
if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new mt(new Float32Array(e.count*3),3),this.setAttribute(
"normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const s=new _,n=new _,a=new _,r=new _,h=new _,o=new _,l=new _,
c=new _;if(t)for(let u=0,d=t.count;u<d;u+=3){const f=t.getX(u+0),m=t.getX(u+1),w=t.getX(u+2);s.fromBufferAttribute(e,f),
n.fromBufferAttribute(e,m),a.fromBufferAttribute(e,w),l.subVectors(a,n),c.subVectors(s,n),l.cross(c),r.fromBufferAttribute(
i,f),h.fromBufferAttribute(i,m),o.fromBufferAttribute(i,w),r.add(l),h.add(l),o.add(l),i.setXYZ(f,r.x,r.y,r.z),i.setXYZ(m,
h.x,h.y,h.z),i.setXYZ(w,o.x,o.y,o.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),n.fromBufferAttribute(
e,u+1),a.fromBufferAttribute(e,u+2),l.subVectors(a,n),c.subVectors(s,n),l.cross(c),i.setXYZ(u+0,l.x,l.y,l.z),i.setXYZ(u+
1,l.x,l.y,l.z),i.setXYZ(u+2,l.x,l.y,l.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.
normal;for(let e=0,i=t.count;e<i;e++)Y.fromBufferAttribute(t,e),Y.normalize(),t.setXYZ(e,Y.x,Y.y,Y.z)}toNonIndexed(){function t(r,h){
const o=r.array,l=r.itemSize,c=r.normalized,u=new o.constructor(h.length*l);let d=0,f=0;for(let m=0,w=h.length;m<w;m++){
r.isInterleavedBufferAttribute?d=h[m]*r.data.stride+r.offset:d=h[m]*l;for(let b=0;b<l;b++)u[f++]=o[d++]}return new mt(u,
l,c)}if(this.index===null)return Q("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ke,
i=this.index.array,s=this.attributes;for(const r in s){const h=s[r],o=t(h,i);e.setAttribute(r,o)}const n=this.morphAttributes;
for(const r in n){const h=[],o=n[r];for(let l=0,c=o.length;l<c;l++){const u=o[l],d=t(u,i);h.push(d)}e.morphAttributes[r]=
h}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,h=a.length;r<h;r++){const o=a[r];e.addGroup(
o.start,o.count,o.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"Buffe\
rGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>
0&&(t.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const o in h)h[o]!==void 0&&(t[o]=h[o]);
return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.
slice.call(e.array)});const i=this.attributes;for(const h in i){const o=i[h];t.data.attributes[h]=o.toJSON(t.data)}const s={};
let n=!1;for(const h in this.morphAttributes){const o=this.morphAttributes[h],l=[];for(let c=0,u=o.length;c<u;c++){const d=o[c];
l.push(d.toJSON(t.data))}l.length>0&&(s[h]=l,n=!0)}n&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);
const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&
(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes=
{},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.
index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const o in s){const l=s[o];this.setAttribute(o,l.clone(
e))}const n=t.morphAttributes;for(const o in n){const l=[],c=n[o];for(let u=0,d=c.length;u<d;u++)l.push(c[u].clone(e));this.
morphAttributes[o]=l}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];
this.addGroup(c.start,c.count,c.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const h=t.boundingSphere;
return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.
count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ei=new dt,Rt=new ls,be=new ii,
Ii=new _,we=new _,Me=new _,ze=new _,ti=new _,Ae=new _,Ri=new _,_e=new _;class _s extends At{constructor(t=new ke,e=new Vi){
super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=
void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=
t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),
this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){
const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=
[],this.morphTargetDictionary={};for(let n=0,a=s.length;n<a;n++){const r=s[n].name||String(n);this.morphTargetInfluences.
push(0),this.morphTargetDictionary[r]=n}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,n=i.morphAttributes.
position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(n&&r){Ae.set(0,0,0);for(let h=0,
o=n.length;h<o;h++){const l=r[h],c=n[h];l!==0&&(ti.fromBufferAttribute(c,t),a?Ae.addScaledVector(ti,l):Ae.addScaledVector(
ti.sub(e),l))}e.add(Ae)}return e}raycast(t,e){const i=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(i.boundingSphere===
null&&i.computeBoundingSphere(),be.copy(i.boundingSphere),be.applyMatrix4(n),Rt.copy(t.ray).recast(t.near),!(be.containsPoint(
Rt.origin)===!1&&(Rt.intersectSphere(be,Ii)===null||Rt.origin.distanceToSquared(Ii)>(t.far-t.near)**2))&&(Ei.copy(n).invert(),
Rt.copy(t.ray).applyMatrix4(Ei),!(i.boundingBox!==null&&Rt.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(
t,e,Rt)))}_computeIntersections(t,e,i){let s;const n=this.geometry,a=this.material,r=n.index,h=n.attributes.position,o=n.
attributes.uv,l=n.attributes.uv1,c=n.attributes.normal,u=n.groups,d=n.drawRange;if(r!==null)if(Array.isArray(a))for(let f=0,
m=u.length;f<m;f++){const w=u[f],b=a[w.materialIndex],x=Math.max(w.start,d.start),y=Math.min(r.count,Math.min(w.start+w.
count,d.start+d.count));for(let M=x,A=y;M<A;M+=3){const S=r.getX(M),z=r.getX(M+1),g=r.getX(M+2);s=Se(this,b,t,i,o,l,c,S,
z,g),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=w.materialIndex,e.push(s))}}else{const f=Math.max(0,d.start),m=Math.
min(r.count,d.start+d.count);for(let w=f,b=m;w<b;w+=3){const x=r.getX(w),y=r.getX(w+1),M=r.getX(w+2);s=Se(this,a,t,i,o,l,
c,x,y,M),s&&(s.faceIndex=Math.floor(w/3),e.push(s))}}else if(h!==void 0)if(Array.isArray(a))for(let f=0,m=u.length;f<m;f++){
const w=u[f],b=a[w.materialIndex],x=Math.max(w.start,d.start),y=Math.min(h.count,Math.min(w.start+w.count,d.start+d.count));
for(let M=x,A=y;M<A;M+=3){const S=M,z=M+1,g=M+2;s=Se(this,b,t,i,o,l,c,S,z,g),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=
w.materialIndex,e.push(s))}}else{const f=Math.max(0,d.start),m=Math.min(h.count,d.start+d.count);for(let w=f,b=m;w<b;w+=
3){const x=w,y=w+1,M=w+2;s=Se(this,a,t,i,o,l,c,x,y,M),s&&(s.faceIndex=Math.floor(w/3),e.push(s))}}}}function Ss(p,t,e,i,s,n,a,r){
let h;if(t.side===Ji?h=i.intersectTriangle(a,n,s,!0,r):h=i.intersectTriangle(s,n,a,t.side===ei,r),h===null)return null;_e.
copy(r),_e.applyMatrix4(p.matrixWorld);const o=e.ray.origin.distanceTo(_e);return o<e.near||o>e.far?null:{distance:o,point:_e.
clone(),object:p}}function Se(p,t,e,i,s,n,a,r,h,o){p.getVertexPosition(r,we),p.getVertexPosition(h,Me),p.getVertexPosition(
o,ze);const l=Ss(p,t,e,i,we,Me,ze,Ri);if(l){const c=new _;ct.getBarycoord(Ri,we,Me,ze,c),s&&(l.uv=ct.getInterpolatedAttribute(
s,r,h,o,c,new ut)),n&&(l.uv1=ct.getInterpolatedAttribute(n,r,h,o,c,new ut)),a&&(l.normal=ct.getInterpolatedAttribute(a,r,
h,o,c,new _),l.normal.dot(i.direction)>0&&l.normal.multiplyScalar(-1));const u={a:r,b:h,c:o,normal:new _,materialIndex:0};
ct.getNormal(we,Me,ze,u.normal),l.face=u,l.barycoord=c}return l}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(
new CustomEvent("register",{detail:{revision:Ni}}));typeof window<"u"&&(window.__THREE__?Q("WARNING: Multiple instances \
of Three.js being imported."):window.__THREE__=Ni);class Fs extends _s{constructor(t,e,i=!1,s=!1,n=1e4){const a=new ke;super(
a,e),this.isMarchingCubes=!0;const r=this,h=new Float32Array(36),o=new Float32Array(36),l=new Float32Array(36);this.enableUvs=
i,this.enableColors=s,this.init=function(x){this.resolution=x,this.isolation=80,this.size=x,this.size2=this.size*this.size,
this.size3=this.size2*this.size,this.halfsize=this.size/2,this.delta=2/this.size,this.yd=this.size,this.zd=this.size2,this.
field=new Float32Array(this.size3),this.normal_cache=new Float32Array(this.size3*3),this.palette=new Float32Array(this.size3*
3),this.count=0;const y=n*3;this.positionArray=new Float32Array(y*3);const M=new mt(this.positionArray,3);M.setUsage(oe),
a.setAttribute("position",M),this.normalArray=new Float32Array(y*3);const A=new mt(this.normalArray,3);if(A.setUsage(oe),
a.setAttribute("normal",A),this.enableUvs){this.uvArray=new Float32Array(y*2);const S=new mt(this.uvArray,2);S.setUsage(
oe),a.setAttribute("uv",S)}if(this.enableColors){this.colorArray=new Float32Array(y*3);const S=new mt(this.colorArray,3);
S.setUsage(oe),a.setAttribute("color",S)}a.boundingSphere=new ii(new _,1)};function c(x,y,M){return x+(y-x)*M}function u(x,y,M,A,S,z,g,T,k,F){
const B=(M-g)/(T-g),C=r.normal_cache;h[y+0]=A+B*r.delta,h[y+1]=S,h[y+2]=z,o[y+0]=c(C[x+0],C[x+3],B),o[y+1]=c(C[x+1],C[x+
4],B),o[y+2]=c(C[x+2],C[x+5],B),l[y+0]=c(r.palette[k*3+0],r.palette[F*3+0],B),l[y+1]=c(r.palette[k*3+1],r.palette[F*3+1],
B),l[y+2]=c(r.palette[k*3+2],r.palette[F*3+2],B)}function d(x,y,M,A,S,z,g,T,k,F){const B=(M-g)/(T-g),C=r.normal_cache;h[y+
0]=A,h[y+1]=S+B*r.delta,h[y+2]=z;const E=x+r.yd*3;o[y+0]=c(C[x+0],C[E+0],B),o[y+1]=c(C[x+1],C[E+1],B),o[y+2]=c(C[x+2],C[E+
2],B),l[y+0]=c(r.palette[k*3+0],r.palette[F*3+0],B),l[y+1]=c(r.palette[k*3+1],r.palette[F*3+1],B),l[y+2]=c(r.palette[k*3+
2],r.palette[F*3+2],B)}function f(x,y,M,A,S,z,g,T,k,F){const B=(M-g)/(T-g),C=r.normal_cache;h[y+0]=A,h[y+1]=S,h[y+2]=z+B*
r.delta;const E=x+r.zd*3;o[y+0]=c(C[x+0],C[E+0],B),o[y+1]=c(C[x+1],C[E+1],B),o[y+2]=c(C[x+2],C[E+2],B),l[y+0]=c(r.palette[k*
3+0],r.palette[F*3+0],B),l[y+1]=c(r.palette[k*3+1],r.palette[F*3+1],B),l[y+2]=c(r.palette[k*3+2],r.palette[F*3+2],B)}function m(x){
const y=x*3;r.normal_cache[y]===0&&(r.normal_cache[y+0]=r.field[x-1]-r.field[x+1],r.normal_cache[y+1]=r.field[x-r.yd]-r.
field[x+r.yd],r.normal_cache[y+2]=r.field[x-r.zd]-r.field[x+r.zd])}function w(x,y,M,A,S){const z=A+1,g=A+r.yd,T=A+r.zd,k=z+
r.yd,F=z+r.zd,B=A+r.yd+r.zd,C=z+r.yd+r.zd;let E=0;const R=r.field[A],D=r.field[z],I=r.field[g],N=r.field[k],V=r.field[T],
X=r.field[F],U=r.field[B],G=r.field[C];R<S&&(E|=1),D<S&&(E|=2),I<S&&(E|=8),N<S&&(E|=4),V<S&&(E|=16),X<S&&(E|=32),U<S&&(E|=
128),G<S&&(E|=64);const P=Cs[E];if(P===0)return 0;const J=r.delta,nt=x+J,tt=y+J,O=M+J;P&1&&(m(A),m(z),u(A*3,0,S,x,y,M,R,
D,A,z)),P&2&&(m(z),m(k),d(z*3,3,S,nt,y,M,D,N,z,k)),P&4&&(m(g),m(k),u(g*3,6,S,x,tt,M,I,N,g,k)),P&8&&(m(A),m(g),d(A*3,9,S,
x,y,M,R,I,A,g)),P&16&&(m(T),m(F),u(T*3,12,S,x,y,O,V,X,T,F)),P&32&&(m(F),m(C),d(F*3,15,S,nt,y,O,X,G,F,C)),P&64&&(m(B),m(C),
u(B*3,18,S,x,tt,O,U,G,B,C)),P&128&&(m(T),m(B),d(T*3,21,S,x,y,O,V,U,T,B)),P&256&&(m(A),m(T),f(A*3,24,S,x,y,M,R,V,A,T)),P&
512&&(m(z),m(F),f(z*3,27,S,nt,y,M,D,X,z,F)),P&1024&&(m(k),m(C),f(k*3,30,S,nt,tt,M,N,G,k,C)),P&2048&&(m(g),m(B),f(g*3,33,
S,x,tt,M,I,U,g,B)),E<<=4;let W,Z,_t,Nt=0,ft=0;for(;Fe[E+ft]!=-1;)W=E+ft,Z=W+1,_t=W+2,b(h,o,l,3*Fe[W],3*Fe[Z],3*Fe[_t]),ft+=
3,Nt++;return Nt}function b(x,y,M,A,S,z){const g=r.count*3;if(r.positionArray[g+0]=x[A],r.positionArray[g+1]=x[A+1],r.positionArray[g+
2]=x[A+2],r.positionArray[g+3]=x[S],r.positionArray[g+4]=x[S+1],r.positionArray[g+5]=x[S+2],r.positionArray[g+6]=x[z],r.
positionArray[g+7]=x[z+1],r.positionArray[g+8]=x[z+2],r.material.flatShading===!0){const T=(y[A+0]+y[S+0]+y[z+0])/3,k=(y[A+
1]+y[S+1]+y[z+1])/3,F=(y[A+2]+y[S+2]+y[z+2])/3;r.normalArray[g+0]=T,r.normalArray[g+1]=k,r.normalArray[g+2]=F,r.normalArray[g+
3]=T,r.normalArray[g+4]=k,r.normalArray[g+5]=F,r.normalArray[g+6]=T,r.normalArray[g+7]=k,r.normalArray[g+8]=F}else r.normalArray[g+
0]=y[A+0],r.normalArray[g+1]=y[A+1],r.normalArray[g+2]=y[A+2],r.normalArray[g+3]=y[S+0],r.normalArray[g+4]=y[S+1],r.normalArray[g+
5]=y[S+2],r.normalArray[g+6]=y[z+0],r.normalArray[g+7]=y[z+1],r.normalArray[g+8]=y[z+2];if(r.enableUvs){const T=r.count*
2;r.uvArray[T+0]=x[A+0],r.uvArray[T+1]=x[A+2],r.uvArray[T+2]=x[S+0],r.uvArray[T+3]=x[S+2],r.uvArray[T+4]=x[z+0],r.uvArray[T+
5]=x[z+2]}r.enableColors&&(r.colorArray[g+0]=M[A+0],r.colorArray[g+1]=M[A+1],r.colorArray[g+2]=M[A+2],r.colorArray[g+3]=
M[S+0],r.colorArray[g+4]=M[S+1],r.colorArray[g+5]=M[S+2],r.colorArray[g+6]=M[z+0],r.colorArray[g+7]=M[z+1],r.colorArray[g+
8]=M[z+2]),r.count+=3}this.addBall=function(x,y,M,A,S,z){const g=Math.sign(A);A=Math.abs(A);const T=z!=null;let k=new Mt(
x,y,M);if(T)try{k=z instanceof Mt?z:Array.isArray(z)?new Mt(Math.min(Math.abs(z[0]),1),Math.min(Math.abs(z[1]),1),Math.min(
Math.abs(z[2]),1)):new Mt(z)}catch{k=new Mt(x,y,M)}const F=this.size*Math.sqrt(A/S),B=M*this.size,C=y*this.size,E=x*this.
size;let R=Math.floor(B-F);R<1&&(R=1);let D=Math.floor(B+F);D>this.size-1&&(D=this.size-1);let I=Math.floor(C-F);I<1&&(I=
1);let N=Math.floor(C+F);N>this.size-1&&(N=this.size-1);let V=Math.floor(E-F);V<1&&(V=1);let X=Math.floor(E+F);X>this.size-
1&&(X=this.size-1);let U,G,P,J,nt,tt,O,W,Z,_t,Nt;for(P=R;P<D;P++)for(nt=this.size2*P,W=P/this.size-M,Z=W*W,G=I;G<N;G++)for(J=
nt+this.size*G,O=G/this.size-y,_t=O*O,U=V;U<X;U++)if(tt=U/this.size-x,Nt=A/(1e-6+tt*tt+_t+Z)-S,Nt>0){this.field[J+U]+=Nt*
g;const ft=Math.sqrt((U-E)*(U-E)+(G-C)*(G-C)+(P-B)*(P-B))/F,Ie=1-ft*ft*ft*(ft*(ft*6-15)+10);this.palette[(J+U)*3+0]+=k.r*
Ie,this.palette[(J+U)*3+1]+=k.g*Ie,this.palette[(J+U)*3+2]+=k.b*Ie}},this.addPlaneX=function(x,y){const M=this.size,A=this.
yd,S=this.zd,z=this.field;let g,T,k,F,B,C,E,R=M*Math.sqrt(x/y);for(R>M&&(R=M),g=0;g<R;g++)if(C=g/M,F=C*C,B=x/(1e-4+F)-y,
B>0)for(T=0;T<M;T++)for(E=g+T*A,k=0;k<M;k++)z[S*k+E]+=B},this.addPlaneY=function(x,y){const M=this.size,A=this.yd,S=this.
zd,z=this.field;let g,T,k,F,B,C,E,R,D=M*Math.sqrt(x/y);for(D>M&&(D=M),T=0;T<D;T++)if(C=T/M,F=C*C,B=x/(1e-4+F)-y,B>0)for(E=
T*A,g=0;g<M;g++)for(R=E+g,k=0;k<M;k++)z[S*k+R]+=B},this.addPlaneZ=function(x,y){const M=this.size,A=this.yd,S=this.zd,z=this.
field;let g,T,k,F,B,C,E,R,D=M*Math.sqrt(x/y);for(D>M&&(D=M),k=0;k<D;k++)if(C=k/M,F=C*C,B=x/(1e-4+F)-y,B>0)for(E=S*k,T=0;T<
M;T++)for(R=E+T*A,g=0;g<M;g++)z[R+g]+=B},this.setCell=function(x,y,M,A){const S=this.size2*M+this.size*y+x;this.field[S]=
A},this.getCell=function(x,y,M){const A=this.size2*M+this.size*y+x;return this.field[A]},this.blur=function(x=1){const y=this.
field,M=y.slice(),A=this.size,S=this.size2;for(let z=0;z<A;z++)for(let g=0;g<A;g++)for(let T=0;T<A;T++){const k=S*T+A*g+
z;let F=M[k],B=1;for(let C=-1;C<=1;C+=2){const E=C+z;if(!(E<0||E>=A))for(let R=-1;R<=1;R+=2){const D=R+g;if(!(D<0||D>=A))
for(let I=-1;I<=1;I+=2){const N=I+T;if(N<0||N>=A)continue;const V=S*N+A*D+E,X=M[V];B++,F+=x*(X-F)/B}}}y[k]=F}},this.reset=
function(){for(let x=0;x<this.size3;x++)this.normal_cache[x*3]=0,this.field[x]=0,this.palette[x*3]=this.palette[x*3+1]=this.
palette[x*3+2]=0},this.update=function(){this.count=0;const x=this.size-2;for(let y=1;y<x;y++){const M=this.size2*y,A=(y-
this.halfsize)/this.halfsize;for(let S=1;S<x;S++){const z=M+this.size*S,g=(S-this.halfsize)/this.halfsize;for(let T=1;T<
x;T++){const k=(T-this.halfsize)/this.halfsize,F=z+T;w(k,g,A,F,this.isolation)}}}this.geometry.setDrawRange(0,this.count),
a.getAttribute("position").needsUpdate=!0,a.getAttribute("normal").needsUpdate=!0,this.enableUvs&&(a.getAttribute("uv").
needsUpdate=!0),this.enableColors&&(a.getAttribute("color").needsUpdate=!0),this.count/3>n&&console.warn("THREE.Marching\
Cubes: Geometry buffers too small for rendering. Please create an instance with a higher poly count.")},this.init(t)}}const Cs=new Int32Array(
[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,
2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,
1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,
2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,
85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,
2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,
85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,
2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,
170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,
2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),
Fe=new Int32Array([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,
-1,-1,-1,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,11,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,-1,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,10,1,0,8,10,
8,11,10,-1,-1,-1,-1,-1,-1,-1,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,-1,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,7,
8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,
-1,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,-1,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,-1,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,-1,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,-1,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,
-1,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,-1,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,-1,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,
-1,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,-1,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,4,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,-1,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,-1,2,10,5,3,2,5,3,5,4,3,4,8,
-1,-1,-1,-1,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,-1,0,5,4,0,1,5,2,3,11,-1,-1,
-1,-1,-1,-1,-1,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,-1,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,4,9,5,0,8,1,8,10,1,8,11,10,
-1,-1,-1,-1,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,-1,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,9,7,8,5,7,9,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,-1,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,-1,1,5,3,3,5,7,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,-1,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,-1,8,0,2,8,2,5,8,5,7,10,5,2,-1,
-1,-1,-1,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,-1,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,
-1,-1,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,-1,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,-1,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,
-1,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,-1,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,-1,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,-1,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,6,5,1,2,6,3,0,8,-1,-1,-1,
-1,-1,-1,-1,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,-1,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,-1,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,-1,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,-1,5,10,6,1,9,2,9,11,2,9,8,11,-1,
-1,-1,-1,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,-1,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,-1,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,
-1,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,
-1,-1,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,-1,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,-1,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,-1,
1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,-1,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,-1,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,-1,3,11,2,7,8,4,10,
6,5,-1,-1,-1,-1,-1,-1,-1,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,-1,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,-1,9,2,1,9,11,2,9,4,11,
7,11,4,5,10,6,-1,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,-1,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,-1,0,5,9,0,6,5,0,3,6,11,6,3,8,
4,7,-1,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,-1,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,
-1,-1,-1,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,-1,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,-1,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,
-1,-1,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,-1,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,
-1,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,-1,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,-1,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,-1,
6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,-1,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,-1,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,-1,3,11,6,3,6,0,
0,6,4,-1,-1,-1,-1,-1,-1,-1,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,-1,0,7,3,0,
10,7,0,9,10,6,7,10,-1,-1,-1,-1,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,-1,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,-1,1,2,6,1,6,
8,1,8,9,8,6,7,-1,-1,-1,-1,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,-1,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,-1,7,3,2,6,7,2,-1,-1,-1,-1,
-1,-1,-1,-1,-1,-1,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,-1,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,-1,1,8,0,1,7,8,1,10,7,6,7,10,2,
3,11,-1,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,-1,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,-1,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,-1,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,-1,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,8,1,9,8,3,1,11,7,6,-1,
-1,-1,-1,-1,-1,-1,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,-1,2,9,0,2,10,9,6,11,
7,-1,-1,-1,-1,-1,-1,-1,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,-1,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,0,8,7,6,0,6,2,
0,-1,-1,-1,-1,-1,-1,-1,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,-1,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,-1,10,7,6,10,1,7,1,3,7,-1,
-1,-1,-1,-1,-1,-1,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,-1,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,-1,7,6,10,7,10,8,8,10,9,-1,-1,
-1,-1,-1,-1,-1,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,-1,8,6,11,8,4,6,9,0,1,-1,
-1,-1,-1,-1,-1,-1,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,-1,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,3,0,11,0,6,11,0,4,
6,-1,-1,-1,-1,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,-1,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,-1,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,
-1,-1,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,-1,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,
-1,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,-1,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,-1,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,-1,10,9,
4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,-1,
5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,-1,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,-1,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,-1,6,
11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,-1,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,-1,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,-1,7,2,3,7,6,
2,5,4,9,-1,-1,-1,-1,-1,-1,-1,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,-1,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,-1,6,2,8,6,8,7,2,1,8,4,
8,5,1,5,8,-1,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,-1,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,-1,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,-1,
7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,-1,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,-1,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,-1,0,
11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,-1,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,-1,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,-1,0,11,
3,0,6,11,0,9,6,5,6,9,1,2,10,-1,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,-1,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,-1,5,8,9,5,2,8,5,
6,2,3,8,2,-1,-1,-1,-1,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,-1,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,-1,1,5,6,2,1,6,-1,-1,-1,-1,-1,
-1,-1,-1,-1,-1,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,-1,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,-1,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,
-1,-1,-1,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11,5,10,11,7,5,8,3,0,
-1,-1,-1,-1,-1,-1,-1,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,-1,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,-1,11,1,2,11,7,1,7,5,
1,-1,-1,-1,-1,-1,-1,-1,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,-1,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,-1,7,5,2,7,2,11,5,9,2,3,2,
8,9,8,2,-1,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,-1,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,
-1,-1,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,-1,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,-1,
9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,-1,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,
-1,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,-1,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,-1,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,-1,
2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,-1,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,-1,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,-1,9,4,5,2,11,
3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,-1,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,-1,3,10,2,3,5,
10,3,8,5,4,5,8,0,1,9,-1,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,-1,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,-1,0,4,5,1,0,5,-1,-1,-1,
-1,-1,-1,-1,-1,-1,-1,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,-1,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,11,7,4,9,11,9,10,
11,-1,-1,-1,-1,-1,-1,-1,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,-1,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,-1,3,1,4,3,4,8,1,10,
4,7,4,11,10,11,4,-1,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,-1,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,-1,11,7,4,11,4,2,2,4,0,-1,-1,
-1,-1,-1,-1,-1,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,-1,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,-1,9,10,7,9,7,4,10,2,7,8,7,0,2,0,
7,-1,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,-1,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,
-1,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,-1,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
-1,-1,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,-1,0,1,10,0,10,8,8,10,11,-1,-1,
-1,-1,-1,-1,-1,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,-1,3,0,9,3,9,11,1,2,9,
2,11,9,-1,-1,-1,-1,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,
10,8,9,-1,-1,-1,-1,-1,-1,-1,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,-1,1,10,2,-1,-1,
-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),pt=320,Ts=[.485,.456,.406],
Bs=[.229,.224,.225],Wi=(p,t)=>new OffscreenCanvas(p,t),ee=p=>Object.assign(new Error(p),{code:"ERR_MESH_FOREGROUND"});function Ee(p){
const{width:t,height:e,data:i}=p??{};if(!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<1||e<1||t*e>4096*4096||!(i instanceof
Uint8Array||i instanceof Uint8ClampedArray)||i.length!==t*e*4)throw new Error("TripoSR needs bounded RGBA pixels");return p}
function si(p){const{width:t,height:e,data:i}=Ee(p);let s=0,n=0,a=0;for(let r=0;r<e;r++)for(let h=0;h<t;h++){const o=i[(r*
t+h)*4+3]<=16;o&&s++,(h===0||r===0||h===t-1||r===e-1)&&(n++,o&&a++)}return s>=Math.max(1,t*e*.01)&&a>=n*.25}function ks(p){
if(!si(p))throw ee("This stored TripoSR package needs a transparent cutout. Load the current TripoSR package to remove i\
mage backgrounds automatically.");return p}function Es(p){const t=pt**2;if(!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||
p.length!==t*4)throw new Error("Foreground input must be 320×320 RGBA");let e=1e-6;for(let s=0;s<p.length;s+=4)e=Math.max(
e,p[s],p[s+1],p[s+2]);const i=new Float32Array(t*3);for(let s=0;s<t;s++)for(let n=0;n<3;n++)i[n*t+s]=(p[s*4+n]/e-Ts[n])/
Bs[n];return i}function Is(p,{canvas:t=Wi}={}){const{width:e,height:i,data:s}=Ee(p),n=new Uint8ClampedArray(s);for(let o=3;o<
n.length;o+=4)n[o]=255;const a=t(e,i),r=t(pt,pt);a.getContext("2d").putImageData(new ImageData(n,e,i),0,0);const h=r.getContext(
"2d",{willReadFrequently:!0});return h.imageSmoothingEnabled=!0,h.imageSmoothingQuality="high",h.drawImage(a,0,0,pt,pt),
Es(h.getImageData(0,0,pt,pt).data)}function Rs(p,t,{canvas:e=Wi}={}){const{width:i,height:s,data:n}=Ee(p),a=pt;if(!(t instanceof
Float32Array)||t.length!==a*a)throw ee("Invalid foreground model mask");let r=1/0,h=-1/0;for(const b of t){if(!Number.isFinite(
b)||b<-1e-4||b>1.0001)throw ee("Invalid foreground model values");r=Math.min(r,b),h=Math.max(h,b)}if(h-r<1e-6)throw ee("\
The foreground model could not isolate an object. Try one clearly visible object or a transparent cutout.");const o=new Uint8ClampedArray(
a*a*4);for(let b=0;b<t.length;b++){const x=Math.floor(255*(t[b]-r)/(h-r));o[b*4]=o[b*4+1]=o[b*4+2]=x,o[b*4+3]=255}const l=e(
a,a),c=e(i,s);l.getContext("2d").putImageData(new ImageData(o,a,a),0,0);const u=c.getContext("2d",{willReadFrequently:!0});
u.imageSmoothingEnabled=!0,u.imageSmoothingQuality="high",u.drawImage(l,0,0,i,s);const d=u.getImageData(0,0,i,s).data,f=new Uint8Array(
n);let m=0;for(let b=0;b<i*s;b++){const x=Math.round(n[b*4+3]*d[b*4]/255);f[b*4+3]=x,x>=128&&m++}const w={width:i,height:s,
channels:4,data:f};if(!m||!si(w))throw ee("The foreground model could not isolate an object. Try one clearly visible obj\
ect with space around it, or a transparent cutout.");return w}const q=Object.freeze({imageSize:512,foregroundRatio:.85,radius:.87,
channels:40,planeSize:64,threshold:25,resolution:64,queryBatch:32768,maxVertices:1e5,maxTriangles:15e4});function Ot(p,t){
for(const e of p)if(!Number.isFinite(e))throw new Error(`${t} contains non-finite values`);return p}function Ds(p){const{
width:t,height:e,data:i}=Ee(p);let s=t,n=e,a=-1,r=-1;for(let h=0;h<e;h++)for(let o=0;o<t;o++)i[(h*t+o)*4+3]&&(s=Math.min(
s,o),n=Math.min(n,h),a=Math.max(a,o),r=Math.max(r,h));if(a<s)throw new Error("The image has no visible foreground");return{
x:s,y:n,width:a-s+1,height:r-n+1}}function vs(p){const t=q.imageSize**2;if(!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)||
p.length!==t*4)throw new Error("TripoSR input must be 512×512 RGBA");const e=new Float32Array(t*3);for(let i=0;i<t;i++){
const s=p[i*4+3]/255;for(let n=0;n<3;n++)e[n*t+i]=p[i*4+n]/255*s+.5*(1-s)}return e}function Os(p,{canvas:t=(e,i)=>new OffscreenCanvas(
e,i)}={}){p=ks(p);const e=Ds(p),i=q.imageSize,s=t(p.width,p.height),n=t(i,i);s.getContext("2d").putImageData(new ImageData(
new Uint8ClampedArray(p.data),p.width,p.height),0,0);const a=i*q.foregroundRatio/Math.max(e.width,e.height),r=e.width*a,
h=e.height*a,o=n.getContext("2d",{willReadFrequently:!0});return o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="hig\
h",o.drawImage(s,e.x,e.y,e.width,e.height,(i-r)/2,(i-h)/2,r,h),vs(o.getImageData(0,0,i,i).data)}function Ns(p,t,e){if(!Number.
isInteger(p)||p<4||p>128||!Number.isSafeInteger(t)||!Number.isSafeInteger(e)||t<0||e<1||e>q.queryBatch||t+e>p**3)throw new Error(
"Invalid TripoSR query grid");const i=new Float32Array(e*3),s=2*q.radius/(p-1);for(let n=0;n<e;n++){const a=t+n;i[n*3]=a%
p*s-q.radius,i[n*3+1]=Math.floor(a/p)%p*s-q.radius,i[n*3+2]=Math.floor(a/(p*p))*s-q.radius}return i}function Ps(p,t){if(!(p instanceof
Float32Array)||p.length!==7680*64||!(t instanceof Float32Array)||t.length%3||t.length/3>q.queryBatch)throw new Error("In\
valid TripoSR sample tensors");Ot(t,"Query points");const e=new Float32Array(t.length/3*120);for(let i=0;i<t.length/3;i++){
const s=t[i*3]/q.radius,n=t[i*3+1]/q.radius,a=t[i*3+2]/q.radius;for(let r=0;r<3;r++){const h=((r===2?n:s)+1)*32-.5,o=((r===
0?n:a)+1)*32-.5,l=Math.floor(h),c=Math.floor(o),u=h-l,d=o-c;for(let f=0;f<40;f++){let m=0;for(let w=0;w<2;w++)for(let b=0;b<
2;b++){const x=l+b,y=c+w;x>=0&&x<64&&y>=0&&y<64&&(m+=p[(r*40+f)*4096+y*64+x]*(b?u:1-u)*(w?d:1-d))}e[i*120+r*40+f]=m}}}return Ot(
e,"Triplane features")}function Us(p,t=q.resolution){if(!(p instanceof Float32Array)||p.length!==t**3||!Number.isInteger(
t)||t<4||t>128)throw new Error("Invalid density field");Ot(p,"Density");const e=new Vi,i=new Fs(t,e,!1,!1,Math.floor(q.maxVertices/
3)+1);try{i.field.set(p),i.isolation=q.threshold,i.update();const s=i.count;if(!s)throw new Error("No solid object was f\
ound; use one object on a plain or transparent background");if(s>q.maxVertices)throw new Error("Generated mesh exceeds i\
ts vertex budget");const n=new Float32Array(i.positionArray.slice(0,s*3)),a=new Float32Array(i.normalArray.slice(0,s*3)),
r=Uint32Array.from({length:s},(h,o)=>o);for(let h=0;h<n.length;h++)n[h]=((n[h]+1)*t/(t-1)-1)*q.radius;for(let h=0;h<a.length;h+=
3){const o=Math.hypot(a[h],a[h+1],a[h+2]);if(!Number.isFinite(o)||o<=1e-12)throw new Error("Generated surface has an inv\
alid normal");a[h]/=o,a[h+1]/=o,a[h+2]/=o}return{positions:n,normals:a,indices:r}}finally{i.geometry.dispose(),e.dispose()}}
function qs(p){for(const t of["positions","normals"]){const e=p[t];for(let i=0;i<e.length;i+=3){const s=e[i+1];e[i+1]=e[i+
2],e[i+2]=-s}}return p}function Vs(p){return Ot(p,"Vertex colors"),Float32Array.from(p,t=>{const e=Math.max(0,Math.min(1,
t));return e<=.04045?e/12.92:((e+.055)/1.055)**2.4})}const Di=()=>new Promise(p=>setTimeout(p,0)),Te=4*1024**2,Ce=p=>Object.
values(p??{}).forEach(t=>t.dispose?.());async function Ws(p,t,e,i){if(!t||t.size<1||t.size>512*1024**2)throw new Error("\
3D model file exceeds its loader budget");const s=new Uint8Array(t.size);for(let n=0;n<s.length;n+=Te)j(e),s.set(await p.
read(t.path,n,Math.min(Te,s.length-n),{signal:e}),n),i?.({type:"model-load",stage:t.path,loaded:Math.min(n+Te,s.length),
total:s.length});return s}function Ls(p,t){const e=p.createCommandEncoder.bind(p),i=p.queue.submit.bind(p.queue);p.createCommandEncoder=
(...s)=>{const n=e(...s),a=n.beginComputePass.bind(n);return n.beginComputePass=(...r)=>{const h=a(...r);for(const o of[
"dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const l=h[o].bind(h);h[o]=(...c)=>{const u=l(...c);return t.gpuDispatches++,
u}}return h},n},p.queue.submit=(...s)=>{const n=i(...s);return t.gpuSubmissions++,n}}async function Xs({manifest:p,runtimeAssets:t,
artifactPort:e,signal:i,onProgress:s,gpu:n=globalThis.navigator?.gpu,loadOrt:a=()=>Li(()=>import("./ort.webgpu.bundle.min-WyWkMMpy.js"),
[],import.meta.url),createReader:r=Xi,prepareImage:h=Os,readModelFile:o=Ws,prepareForeground:l=Is,applyMask:c=Rs}){
const{manifest:u}=vi(p),d={gpuDispatches:0,gpuSubmissions:0,generatedRequests:0};let f,m,w,b,x,y,M=!1,A=!1,S=!1;const z=F=>{
A||(S=!0,d.gpuFailure??=String(F?.message??F??"GPU device lost").slice(0,300))},g=F=>z(F.error);async function T(F,B){if(S)
throw new Error(`Model session lost: 3D ${d.gpuFailure}`);const C=["validation","out-of-memory","internal"];for(const I of C)
f.pushErrorScope(I);let E,R;try{E=await B(),await f.queue.onSubmittedWorkDone()}catch(I){R=I}const D=[];for(const I of C.
reverse())try{const N=await f.popErrorScope();N&&D.push({filter:I,error:N})}catch(N){D.push({filter:I,error:N})}if(D.length||
S){const I=D.find(V=>V.filter==="out-of-memory")?.error??D[0]?.error??d.gpuFailure;z(I),Ce(E);const N=new Error(`Model s\
ession lost: 3D ${F}: ${d.gpuFailure}`,{cause:I});throw N.code="ERR_MESH_GPU",N}if(R){z(R);const I=new Error(`Model sess\
ion lost: 3D ${F}: ${d.gpuFailure}`,{cause:R});throw I.code="ERR_MESH_GPU",I}return E}async function k(){if(A)return;A=!0,
m?.close(),m=null;let F;for(const B of[b,x,y])try{await B?.release()}catch(C){F??=C}if(b=x=y=null,f?.removeEventListener(
"uncapturederror",g),f?.destroy(),F)throw S=!0,d.gpuFailure??=String(F.message??F),F}try{j(i);const F=await n?.requestAdapter(
{powerPreference:"high-performance"});if(!F||F.isFallbackAdapter||F.info?.isFallbackAdapter)throw new Error("3D generati\
on requires hardware WebGPU");if(f=await F.requestDevice({requiredLimits:{maxBufferSize:F.limits.maxBufferSize,maxStorageBufferBindingSize:F.
limits.maxStorageBufferBindingSize}}),d.adapter={vendor:F.info?.vendor??"",architecture:F.info?.architecture??"",isFallbackAdapter:!1},
d.runtimeFeatures=[...f.features],f.addEventListener("uncapturederror",g),f.lost.then(z,z),Ls(f,d),w=await a(),w.env.versions.
web!==Zi)throw new Error("Unexpected 3D ORT runtime version");w.env.wasm.proxy=!1,w.env.wasm.numThreads=1,w.env.wasm.wasmPaths=
t,m=r(e,{manifest:u,signal:i,maxReadBytes:Te,maxReads:1,maxQueuedReads:2,readTimeoutMs:6e4});const B=I=>o(m,u.files.find(
N=>N.path===I),i,s),C={executionProviders:[{name:"webgpu",device:f}],enableMemPattern:!1,enableCpuMemArena:!1,extra:{session:{
disable_prepacking:"1"}}};let E=await B("triplane_q8.onnx"),R=await B("triplane_q8.onnx.data");await T("encoder load",async()=>{
b=await w.InferenceSession.create(E,{...C,externalData:[{path:"triplane_q8.onnx.data",data:R}]})}),E=R=null,j(i);const D=await B(
"decoder.onnx");if(await T("decoder load",async()=>{x=await w.InferenceSession.create(D,C)}),j(i),u.model.backgroundRemoval===
"u2netp"){const I=await B("u2netp.onnx");await T("foreground load",async()=>{y=await w.InferenceSession.create(I,C)})}if(d.
artifactReads=m.getStats(),m.close(),m=null,j(i),b.inputNames.join()!=="image"||b.outputNames.join()!=="triplane"||x.inputNames.
join()!=="features"||x.outputNames.join()!=="density,color"||y&&(y.inputNames.join()!=="input.1"||y.outputNames.join()!==
"1959,1960,1961,1962,1963,1964,1965"))throw new Error("3D graph interfaces differ from the pinned pipeline")}catch(F){try{
await k()}catch{}throw F}return{get lost(){return S},getEvidence(){return structuredClone(d)},dispose:k,async generate(F,{
signal:B,onProgress:C}={}){if(A)throw new Error("3D model is unloaded");if(M)throw new Error("3D model is already genera\
ting");if(S)throw new Error(`Model session lost: 3D ${d.gpuFailure}`);const E=Oi(F,u);M=!0;const R=d.gpuDispatches,D=d.gpuSubmissions;
try{j(B),C?.({type:"mesh-generation",stage:"image",loaded:0,total:1});let I=E.image;if(y&&!si(I)){const O=new w.Tensor("\
float32",l(I),[1,3,pt,pt]);let W;try{W=await T("foreground separation",()=>y.run({"input.1":O})),j(B);const Z=W[1959];if(Z?.
type!=="float32"||Z.dims.join()!=="1,1,320,320")throw new Error("Unexpected foreground model output");I=c(I,Z.data)}finally{
O.dispose(),Ce(W)}d.foregroundRequests=(d.foregroundRequests??0)+1}j(B);const N=new w.Tensor("float32",h(I),[1,3,512,512]);
let V,X;try{V=await T("image encoding",()=>b.run({image:N}));const O=V.triplane;if(O?.type!=="float32"||O.dims.join()!==
"1,3,40,64,64")throw new Error("Unexpected TripoSR encoder output");X=Ot(new Float32Array(O.data),"Triplane")}finally{N.
dispose(),Ce(V)}j(B);const U=async O=>{j(B);const W=new w.Tensor("float32",Ps(X,O),[O.length/3,120]);let Z;try{Z=await T(
"field decoding",()=>x.run({features:W}));const _t=O.length/3;if(Z.density?.type!=="float32"||Z.color?.type!=="float32"||
Z.density.data.length!==_t||Z.color.data.length!==_t*3)throw new Error("Unexpected TripoSR decoder output");return{density:Ot(
new Float32Array(Z.density.data),"Density"),color:Ot(new Float32Array(Z.color.data),"Vertex colors")}}finally{W.dispose(),
Ce(Z)}},G=q.resolution**3,P=new Float32Array(G);for(let O=0;O<G;O+=q.queryBatch){const W=Math.min(q.queryBatch,G-O);P.set(
(await U(Ns(q.resolution,O,W))).density,O),C?.({type:"mesh-generation",stage:"shape",loaded:O+W,total:G}),await Di()}j(B);
const J=Us(P),nt=J.positions.length/3;J.colors=new Float32Array(J.positions.length);for(let O=0;O<nt;O+=q.queryBatch){const W=Math.
min(nt,O+q.queryBatch);J.colors.set(Vs((await U(J.positions.subarray(O*3,W*3))).color),O*3),C?.({type:"mesh-generation",
stage:"color",loaded:W,total:nt}),await Di()}if(j(B),d.gpuDispatches<=R)throw z(new Error("3D execution did not dispatch\
 work on the admitted GPU")),new Error(`Model session lost: ${d.gpuFailure}`);const tt=await Yi(qs(J));return j(B),d.generatedRequests++,
d.lastMesh={vertexCount:tt.vertexCount,triangleCount:tt.triangleCount,byteLength:tt.byteLength},C?.({type:"mesh-generati\
on",stage:"done",loaded:1,total:1}),{text:"",mesh:tt,gpuDispatches:d.gpuDispatches-R,gpuSubmissions:d.gpuSubmissions-D}}finally{
M=!1}}}}function Zs(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("3D ge\
neration requires a ComputeManager-owned worker")}function Ys({createEngine:p=Xs,assertWorker:t=Zs,baseUrl:e=globalThis.
location?.href}={}){const i=new Map,s=n=>({sessionId:n.sessionId,manifestCid:n.manifestCid,status:n.engine?.lost?"lost":
n.status,workerId:n.workerId,...n.engine?.getEvidence()});return async function(a,r={}){if(t(),ni(a?.sessionId),j(r.signal),
a.command==="load"){if(i.size)throw new Error("Unload the resident 3D model first");const{manifest:l}=vi(a.manifest),c=Gi(
a.runtimeAssets,e),u={sessionId:a.sessionId,manifestCid:a.manifestCid,manifest:l,status:"loading",workerId:r.workerId,engine:null};
i.set(a.sessionId,u);try{return u.engine=await p({manifest:l,runtimeAssets:c,artifactPort:a.artifactPort,signal:r.signal,
onProgress:r.emitProgress}),j(r.signal),u.status="ready",s(u)}catch(d){try{await u.engine?.dispose(),i.delete(a.sessionId)}catch(f){
throw u.status="lost",new AggregateError([d,f],"Model session lost: 3D cleanup failed")}throw d}}const h=i.get(a.sessionId);
if(!h)throw new Error("3D model session is not loaded");if(a.command==="status")return s(h);if(a.command==="unload")return h.
status="unloading",await h.engine.dispose(),i.delete(a.sessionId),{sessionId:a.sessionId,status:"unloaded"};if(a.command!==
"generate")throw new Error("Unknown 3D model command");if(ni(a.requestId),h.status!=="ready"||h.engine.lost)throw new Error(
"Model session lost: 3D model is not ready");const o=Oi(a,h.manifest);h.status="generating";try{const l=await h.engine.generate(
o,{signal:r.signal,onProgress:r.emitProgress});return j(r.signal),{...l,sessionId:a.sessionId,requestId:a.requestId,workerId:h.
workerId}}catch(l){throw(l instanceof WebAssembly.RuntimeError||/Model session lost/.test(l?.message??""))&&(h.status="l\
ost"),l}finally{h.status!=="lost"&&(h.status=h.engine.lost?"lost":"ready")}}}const Hs=Ys();export{Ys as createMeshTaskHandler,Hs as handleModelTask};
