import{az as s,aA as i,aB as n}from"./carnageWindow-BBcEUL8m.js";import"./preload-helper-FD8EeCEm.js";n();var a=class extends s{constructor(r){
super(r),this.rootDir=(void 0)(r),(void 0)((void 0)(this.rootDir))||(void 0)(this.rootDir)}async init(r,t){return this.pg=
r,{emscriptenOpts:{...t,preRun:[...t.preRun||[],e=>{let o=e.NODEFS;e.FS.mkdirTree(i),e.FS.mount(o,{root:this.rootDir},i)}]}}}async closeFs(){
this.pg.Module.FS.quit()}};export{a as NodeFS};
