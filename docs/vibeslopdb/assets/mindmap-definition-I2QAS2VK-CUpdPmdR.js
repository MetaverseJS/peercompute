import{g as oe}from"./chunk-XXDRQBXY-BQvl6q1d.js";import{s as ae}from"./chunk-TU62E6Q5-CbiVnirb.js";import{_ as l,n as O,
E as ce,F as le,a1 as he,a4 as V,k as $,x as F,ar as de,am as ge,an as ue,ao as pe}from"./carnageWindow-Ta-Zfo9P.js";import"./preload-helper-FD8EeCEm.js";
var X=(function(){var e=l(function(x,i,n,o){for(n=n||{},o=x.length;o--;n[x[o]]=i);return n},"o"),r=[1,4],g=[1,13],c=[1,12],
t=[1,15],h=[1,16],p=[1,20],m=[1,19],E=[6,7,8],v=[1,26],C=[1,24],I=[1,25],d=[6,7,11],w=[1,6,13,15,16,19,22],Y=[1,33],q=[1,
34],R=[1,6,7,11,13,15,16,19,22],G={trace:l(function(){},"trace"),yy:{},symbols_:{error:2,start:3,mindMap:4,spaceLines:5,
SPACELINE:6,NL:7,MINDMAP:8,document:9,stop:10,EOF:11,statement:12,SPACELIST:13,node:14,ICON:15,CLASS:16,nodeWithId:17,nodeWithoutId:18,
NODE_DSTART:19,NODE_DESCR:20,NODE_DEND:21,NODE_ID:22,$accept:0,$end:1},terminals_:{2:"error",6:"SPACELINE",7:"NL",8:"MIN\
DMAP",11:"EOF",13:"SPACELIST",15:"ICON",16:"CLASS",19:"NODE_DSTART",20:"NODE_DESCR",21:"NODE_DEND",22:"NODE_ID"},productions_:[
0,[3,1],[3,2],[5,1],[5,2],[5,2],[4,2],[4,3],[10,1],[10,1],[10,1],[10,2],[10,2],[9,3],[9,2],[12,2],[12,2],[12,2],[12,1],[
12,1],[12,1],[12,1],[12,1],[14,1],[14,1],[18,3],[17,1],[17,4]],performAction:l(function(i,n,o,a,f,s,A){var u=s.length-1;
switch(f){case 6:case 7:return a;case 8:a.getLogger().trace("Stop NL ");break;case 9:a.getLogger().trace("Stop EOF ");break;case 11:
a.getLogger().trace("Stop NL2 ");break;case 12:a.getLogger().trace("Stop EOF2 ");break;case 15:a.getLogger().info("Node:\
 ",s[u].id),a.addNode(s[u-1].length,s[u].id,s[u].descr,s[u].type);break;case 16:a.getLogger().trace("Icon: ",s[u]),a.decorateNode(
{icon:s[u]});break;case 17:case 21:a.decorateNode({class:s[u]});break;case 18:a.getLogger().trace("SPACELIST");break;case 19:
a.getLogger().trace("Node: ",s[u].id),a.addNode(0,s[u].id,s[u].descr,s[u].type);break;case 20:a.decorateNode({icon:s[u]});
break;case 25:a.getLogger().trace("node found ..",s[u-2]),this.$={id:s[u-1],descr:s[u-1],type:a.getType(s[u-2],s[u])};break;case 26:
this.$={id:s[u],descr:s[u],type:a.nodeType.DEFAULT};break;case 27:a.getLogger().trace("node found ..",s[u-3]),this.$={id:s[u-
3],descr:s[u-1],type:a.getType(s[u-2],s[u])};break}},"anonymous"),table:[{3:1,4:2,5:3,6:[1,5],8:r},{1:[3]},{1:[2,1]},{4:6,
6:[1,7],7:[1,8],8:r},{6:g,7:[1,10],9:9,12:11,13:c,14:14,15:t,16:h,17:17,18:18,19:p,22:m},e(E,[2,3]),{1:[2,2]},e(E,[2,4]),
e(E,[2,5]),{1:[2,6],6:g,12:21,13:c,14:14,15:t,16:h,17:17,18:18,19:p,22:m},{6:g,9:22,12:11,13:c,14:14,15:t,16:h,17:17,18:18,
19:p,22:m},{6:v,7:C,10:23,11:I},e(d,[2,22],{17:17,18:18,14:27,15:[1,28],16:[1,29],19:p,22:m}),e(d,[2,18]),e(d,[2,19]),e(
d,[2,20]),e(d,[2,21]),e(d,[2,23]),e(d,[2,24]),e(d,[2,26],{19:[1,30]}),{20:[1,31]},{6:v,7:C,10:32,11:I},{1:[2,7],6:g,12:21,
13:c,14:14,15:t,16:h,17:17,18:18,19:p,22:m},e(w,[2,14],{7:Y,11:q}),e(R,[2,8]),e(R,[2,9]),e(R,[2,10]),e(d,[2,15]),e(d,[2,
16]),e(d,[2,17]),{20:[1,35]},{21:[1,36]},e(w,[2,13],{7:Y,11:q}),e(R,[2,11]),e(R,[2,12]),{21:[1,37]},e(d,[2,25]),e(d,[2,27])],
defaultActions:{2:[2,1],6:[2,2]},parseError:l(function(i,n){if(n.recoverable)this.trace(i);else{var o=new Error(i);throw o.
hash=n,o}},"parseError"),parse:l(function(i){var n=this,o=[0],a=[],f=[null],s=[],A=this.table,u="",P=0,J=0,ne=2,K=1,ie=s.
slice.call(arguments,1),y=Object.create(this.lexer),L={yy:{}};for(var j in this.yy)Object.prototype.hasOwnProperty.call(
this.yy,j)&&(L.yy[j]=this.yy[j]);y.setInput(i,L.yy),L.yy.lexer=y,L.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var H=y.
yylloc;s.push(H);var se=y.options&&y.options.ranges;typeof L.yy.parseError=="function"?this.parseError=L.yy.parseError:this.
parseError=Object.getPrototypeOf(this).parseError;function re(k){o.length=o.length-2*k,f.length=f.length-k,s.length=s.length-
k}l(re,"popStack");function Q(){var k;return k=a.pop()||y.lex()||K,typeof k!="number"&&(k instanceof Array&&(a=k,k=a.pop()),
k=n.symbols_[k]||k),k}l(Q,"lex");for(var _,D,b,W,T={},M,S,Z,U;;){if(D=o[o.length-1],this.defaultActions[D]?b=this.defaultActions[D]:
((_===null||typeof _>"u")&&(_=Q()),b=A[D]&&A[D][_]),typeof b>"u"||!b.length||!b[0]){var z="";U=[];for(M in A[D])this.terminals_[M]&&
M>ne&&U.push("'"+this.terminals_[M]+"'");y.showPosition?z="Parse error on line "+(P+1)+`:
`+y.showPosition()+`
Expecting `+U.join(", ")+", got '"+(this.terminals_[_]||_)+"'":z="Parse error on line "+(P+1)+": Unexpected "+(_==K?"end\
 of input":"'"+(this.terminals_[_]||_)+"'"),this.parseError(z,{text:y.match,token:this.terminals_[_]||_,line:y.yylineno,
loc:H,expected:U})}if(b[0]instanceof Array&&b.length>1)throw new Error("Parse Error: multiple actions possible at state:\
 "+D+", token: "+_);switch(b[0]){case 1:o.push(_),f.push(y.yytext),s.push(y.yylloc),o.push(b[1]),_=null,J=y.yyleng,u=y.yytext,
P=y.yylineno,H=y.yylloc;break;case 2:if(S=this.productions_[b[1]][1],T.$=f[f.length-S],T._$={first_line:s[s.length-(S||1)].
first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(S||1)].first_column,last_column:s[s.length-1].last_column},
se&&(T._$.range=[s[s.length-(S||1)].range[0],s[s.length-1].range[1]]),W=this.performAction.apply(T,[u,J,P,L.yy,b[1],f,s].
concat(ie)),typeof W<"u")return W;S&&(o=o.slice(0,-1*S*2),f=f.slice(0,-1*S),s=s.slice(0,-1*S)),o.push(this.productions_[b[1]][0]),
f.push(T.$),s.push(T._$),Z=A[o[o.length-2]][o[o.length-1]],o.push(Z);break;case 3:return!0}}return!0},"parse")},te=(function(){
var x={EOF:1,parseError:l(function(n,o){if(this.yy.parser)this.yy.parser.parseError(n,o);else throw new Error(n)},"parse\
Error"),setInput:l(function(i,n){return this.yy=n||this.yy||{},this._input=i,this._more=this._backtrack=this.done=!1,this.
yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,
first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),
input:l(function(){var i=this._input[0];this.yytext+=i,this.yyleng++,this.offset++,this.match+=i,this.matched+=i;var n=i.
match(/(?:\r\n?|\n).*/g);return n?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&
this.yylloc.range[1]++,this._input=this._input.slice(1),i},"input"),unput:l(function(i){var n=i.length,o=i.split(/(?:\r\n?|\n)/g);
this._input=i+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-n),this.offset-=n;var a=this.match.split(/(?:\r\n?|\n)/g);
this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),o.length-1&&
(this.yylineno-=o.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.
yylineno+1,first_column:this.yylloc.first_column,last_column:o?(o.length===a.length?this.yylloc.first_column:0)+a[a.length-
o.length].length-o[0].length:this.yylloc.first_column-n},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-
n]),this.yyleng=this.yytext.length,this},"unput"),more:l(function(){return this._more=!0,this},"more"),reject:l(function(){
if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+
`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer =\
 true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:l(function(i){this.unput(this.
match.slice(i))},"less"),pastInput:l(function(){var i=this.matched.substr(0,this.matched.length-this.match.length);return(i.
length>20?"...":"")+i.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:l(function(){var i=this.match;return i.length<
20&&(i+=this._input.substr(0,20-i.length)),(i.substr(0,20)+(i.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:l(
function(){var i=this.pastInput(),n=new Array(i.length+1).join("-");return i+this.upcomingInput()+`
`+n+"^"},"showPosition"),test_match:l(function(i,n){var o,a,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,
yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.
yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.
offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.
ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),a=i[0].match(/(?:\r\n?|\n).*/g),a&&(this.yylineno+=a.length),this.yylloc=
{first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:a?a[a.length-
1].length-a[a.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+i[0].length},this.yytext+=i[0],this.match+=i[0],
this.matches=i,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),
this._more=!1,this._backtrack=!1,this._input=this._input.slice(i[0].length),this.matched+=i[0],o=this.performAction.call(
this,this.yy,this,n,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),o)return o;
if(this._backtrack){for(var s in f)this[s]=f[s];return!1}return!1},"test_match"),next:l(function(){if(this.done)return this.
EOF;this._input||(this.done=!0);var i,n,o,a;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),s=0;s<
f.length;s++)if(o=this._input.match(this.rules[f[s]]),o&&(!n||o[0].length>n[0].length)){if(n=o,a=s,this.options.backtrack_lexer){
if(i=this.test_match(o,f[s]),i!==!1)return i;if(this._backtrack){n=!1;continue}else return!1}else if(!this.options.flex)
break}return n?(i=this.test_match(n,f[a]),i!==!1?i:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+
(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:l(function(){var n=this.next();return n||this.
lex()},"lex"),begin:l(function(n){this.conditionStack.push(n)},"begin"),popState:l(function(){var n=this.conditionStack.
length-1;return n>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:l(function(){return this.
conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.
length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:l(function(n){return n=this.conditionStack.length-
1-Math.abs(n||0),n>=0?this.conditionStack[n]:"INITIAL"},"topState"),pushState:l(function(n){this.begin(n)},"pushState"),
stateStackSize:l(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:l(
function(n,o,a,f){switch(a){case 0:return n.getLogger().trace("Found comment",o.yytext),6;case 1:return 8;case 2:this.begin(
"CLASS");break;case 3:return this.popState(),16;case 4:this.popState();break;case 5:n.getLogger().trace("Begin icon"),this.
begin("ICON");break;case 6:return n.getLogger().trace("SPACELINE"),6;case 7:return 7;case 8:return 15;case 9:n.getLogger().
trace("end icon"),this.popState();break;case 10:return n.getLogger().trace("Exploding node"),this.begin("NODE"),19;case 11:
return n.getLogger().trace("Cloud"),this.begin("NODE"),19;case 12:return n.getLogger().trace("Explosion Bang"),this.begin(
"NODE"),19;case 13:return n.getLogger().trace("Cloud Bang"),this.begin("NODE"),19;case 14:return this.begin("NODE"),19;case 15:
return this.begin("NODE"),19;case 16:return this.begin("NODE"),19;case 17:return this.begin("NODE"),19;case 18:return 13;case 19:
return 22;case 20:return 11;case 21:this.begin("NSTR2");break;case 22:return"NODE_DESCR";case 23:this.popState();break;case 24:
n.getLogger().trace("Starting NSTR"),this.begin("NSTR");break;case 25:return n.getLogger().trace("description:",o.yytext),
"NODE_DESCR";case 26:this.popState();break;case 27:return this.popState(),n.getLogger().trace("node end ))"),"NODE_DEND";case 28:
return this.popState(),n.getLogger().trace("node end )"),"NODE_DEND";case 29:return this.popState(),n.getLogger().trace(
"node end ...",o.yytext),"NODE_DEND";case 30:return this.popState(),n.getLogger().trace("node end (("),"NODE_DEND";case 31:
return this.popState(),n.getLogger().trace("node end (-"),"NODE_DEND";case 32:return this.popState(),n.getLogger().trace(
"node end (-"),"NODE_DEND";case 33:return this.popState(),n.getLogger().trace("node end (("),"NODE_DEND";case 34:return this.
popState(),n.getLogger().trace("node end (("),"NODE_DEND";case 35:return n.getLogger().trace("Long description:",o.yytext),
20;case 36:return n.getLogger().trace("Long description:",o.yytext),20}},"anonymous"),rules:[/^(?:\s*%%.*)/i,/^(?:mindmap\b)/i,
/^(?::::)/i,/^(?:.+)/i,/^(?:\n)/i,/^(?:::icon\()/i,/^(?:[\s]+[\n])/i,/^(?:[\n]+)/i,/^(?:[^\)]+)/i,/^(?:\))/i,/^(?:-\))/i,
/^(?:\(-)/i,/^(?:\)\))/i,/^(?:\))/i,/^(?:\(\()/i,/^(?:\{\{)/i,/^(?:\()/i,/^(?:\[)/i,/^(?:[\s]+)/i,/^(?:[^\(\[\n\)\{\}]+)/i,
/^(?:$)/i,/^(?:["][`])/i,/^(?:[^`"]+)/i,/^(?:[`]["])/i,/^(?:["])/i,/^(?:[^"]+)/i,/^(?:["])/i,/^(?:[\)]\))/i,/^(?:[\)])/i,
/^(?:[\]])/i,/^(?:\}\})/i,/^(?:\(-)/i,/^(?:-\))/i,/^(?:\(\()/i,/^(?:\()/i,/^(?:[^\)\]\(\}]+)/i,/^(?:.+(?!\(\())/i],conditions:{
CLASS:{rules:[3,4],inclusive:!1},ICON:{rules:[8,9],inclusive:!1},NSTR2:{rules:[22,23],inclusive:!1},NSTR:{rules:[25,26],
inclusive:!1},NODE:{rules:[21,24,27,28,29,30,31,32,33,34,35,36],inclusive:!1},INITIAL:{rules:[0,1,2,5,6,7,10,11,12,13,14,
15,16,17,18,19,20],inclusive:!0}}};return x})();G.lexer=te;function B(){this.yy={}}return l(B,"Parser"),B.prototype=G,G.
Parser=B,new B})();X.parser=X;var fe=X,ee=12,N={DEFAULT:0,NO_BORDER:0,ROUNDED_RECT:1,RECT:2,CIRCLE:3,CLOUD:4,BANG:5,HEXAGON:6},
me=class{constructor(){this.nodes=[],this.count=0,this.elements={},this.getLogger=this.getLogger.bind(this),this.nodeType=
N,this.clear(),this.getType=this.getType.bind(this),this.getElementById=this.getElementById.bind(this),this.getParent=this.
getParent.bind(this),this.getMindmap=this.getMindmap.bind(this),this.addNode=this.addNode.bind(this),this.decorateNode=this.
decorateNode.bind(this)}static{l(this,"MindmapDB")}clear(){this.nodes=[],this.count=0,this.elements={},this.baseLevel=void 0}getParent(e){
for(let r=this.nodes.length-1;r>=0;r--)if(this.nodes[r].level<e)return this.nodes[r];return null}getMindmap(){return this.
nodes.length>0?this.nodes[0]:null}addNode(e,r,g,c){O.info("addNode",e,r,g,c);let t=!1;this.nodes.length===0?(this.baseLevel=
e,e=0,t=!0):this.baseLevel!==void 0&&(e=e-this.baseLevel,t=!1);const h=$();let p=h.mindmap?.padding??V.mindmap.padding;switch(c){case this.
nodeType.ROUNDED_RECT:case this.nodeType.RECT:case this.nodeType.HEXAGON:p*=2;break}const m={id:this.count++,nodeId:F(r,
h),level:e,descr:F(g,h),type:c,children:[],width:h.mindmap?.maxNodeWidth??V.mindmap.maxNodeWidth,padding:p,isRoot:t},E=this.
getParent(e);if(E)E.children.push(m),this.nodes.push(m);else if(t)this.nodes.push(m);else throw new Error(`There can be \
only one root. No parent could be found for ("${m.descr}")`)}getType(e,r){switch(O.debug("In get type",e,r),e){case"[":return this.
nodeType.RECT;case"(":return r===")"?this.nodeType.ROUNDED_RECT:this.nodeType.CLOUD;case"((":return this.nodeType.CIRCLE;case"\
)":return this.nodeType.CLOUD;case"))":return this.nodeType.BANG;case"{{":return this.nodeType.HEXAGON;default:return this.
nodeType.DEFAULT}}setElementForId(e,r){this.elements[e]=r}getElementById(e){return this.elements[e]}decorateNode(e){if(!e)
return;const r=$(),g=this.nodes[this.nodes.length-1];e.icon&&(g.icon=F(e.icon,r)),e.class&&(g.class=F(e.class,r))}type2Str(e){
switch(e){case this.nodeType.DEFAULT:return"no-border";case this.nodeType.RECT:return"rect";case this.nodeType.ROUNDED_RECT:
return"rounded-rect";case this.nodeType.CIRCLE:return"circle";case this.nodeType.CLOUD:return"cloud";case this.nodeType.
BANG:return"bang";case this.nodeType.HEXAGON:return"hexgon";default:return"no-border"}}assignSections(e,r,g=0,c=!1){if(e.
level===0?e.section=void 0:e.section=c?(g-1)%(ee-1):r,e.children)for(const[t,h]of e.children.entries()){const p=e.level===
0?t%(ee-1):r;this.assignSections(h,p,g+1,c)}}flattenNodes(e,r){const g=$(),c=["mindmap-node"];e.isRoot===!0?c.push("sect\
ion-root","section--1"):e.section!==void 0&&c.push(`section-${e.section}`),e.class&&c.push(e.class);const t=c.join(" "),
h=l(m=>{const v=(g.theme?.toLowerCase()??"").includes("redux");switch(m){case N.CIRCLE:return"mindmapCircle";case N.RECT:
return"rect";case N.ROUNDED_RECT:return"rounded";case N.CLOUD:return"cloud";case N.BANG:return"bang";case N.HEXAGON:return"\
hexagon";case N.DEFAULT:return v?"rounded":"defaultMindmapNode";case N.NO_BORDER:default:return"rect"}},"getShapeFromTyp\
e"),p={id:e.id.toString(),domId:"node_"+e.id.toString(),label:e.descr,labelType:"markdown",isGroup:!1,shape:h(e.type),width:e.
width,height:e.height??0,padding:e.padding,cssClasses:t,cssStyles:[],centerLabel:!0,look:g.look,icon:e.icon,x:e.x,y:e.y,
level:e.level,nodeId:e.nodeId,type:e.type,section:e.section};if(r.push(p),e.children)for(const m of e.children)this.flattenNodes(
m,r)}generateEdges(e,r){if(!e.children)return;const g=$();for(const c of e.children){let t="edge";c.section!==void 0&&(t+=
` section-edge-${c.section}`);const h=e.level+1;t+=` edge-depth-${h}`;const p={id:`edge_${e.id}_${c.id}`,start:e.id.toString(),
end:c.id.toString(),type:"normal",curve:"basis",thickness:"normal",look:g.look,classes:t,depth:e.level,section:c.section};
r.push(p),this.generateEdges(c,r)}}getData(){const e=this.getMindmap(),r=$(),c=de().layout!==void 0,t=r;if(c||(t.layout=
"cose-bilkent"),!e)return{nodes:[],edges:[],config:t};O.debug("getData: mindmapRoot",e,r),this.assignSections(e,void 0,0,
r.mindmap?.colorBy==="depth");const h=[],p=[];this.flattenNodes(e,h),this.generateEdges(e,p),O.debug(`getData: processed\
 ${h.length} nodes and ${p.length} edges`);const m=new Map;for(const E of h)m.set(E.id,{shape:E.shape,width:E.width,height:E.
height,padding:E.padding});return{nodes:h,edges:p,config:t,rootNode:e,markers:["point"],direction:"TB",nodeSpacing:50,rankSpacing:50,
shapes:Object.fromEntries(m),type:"mindmap"}}getLogger(){return O}},ye=l(async(e,r,g,c)=>{O.debug(`Rendering mindmap dia\
gram
`+e);const t=c.db,h=t.getData(),p=oe(r,h.config.securityLevel);if(h.type=c.type,h.layoutAlgorithm=ce(h.config.layout,{fallback:"\
cose-bilkent"}),h.diagramId=r,!t.getMindmap())return;h.nodes.forEach(d=>{d.shape==="rounded"?(d.radius=15,d.taper=15,d.stroke=
"none",d.width=0,d.padding=15):d.shape==="circle"?d.padding=10:d.shape==="rect"?(d.width=0,d.padding=10):d.shape==="hexa\
gon"&&(d.width=0,d.height=0)}),await le(h,p);const{themeVariables:E}=he(),{useGradient:v,gradientStart:C,gradientStop:I}=E;
if(v&&C&&I){const d=p.attr("id"),w=p.append("defs").append("linearGradient").attr("id",`${d}-gradient`).attr("gradientUn\
its","objectBoundingBox").attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%");w.append("stop").attr("offse\
t","0%").attr("stop-color",C).attr("stop-opacity",1),w.append("stop").attr("offset","100%").attr("stop-color",I).attr("s\
top-opacity",1)}ae(p,h.config.mindmap?.padding??V.mindmap.padding,"mindmapDiagram",h.config.mindmap?.useMaxWidth??V.mindmap.
useMaxWidth)},"draw"),Ee={draw:ye},_e=l(e=>{const{theme:r,look:g}=e;let c="";for(let t=0;t<e.THEME_COLOR_LIMIT;t++)e["li\
neColor"+t]=e["lineColor"+t]||e["cScaleInv"+t],ge(e["lineColor"+t])?e["lineColor"+t]=ue(e["lineColor"+t],20):e["lineColo\
r"+t]=pe(e["lineColor"+t],20);for(let t=0;t<e.THEME_COLOR_LIMIT;t++){const h=""+(g==="neo"?Math.max(10-(t-1)*2,2):17-3*t),
p=r==="redux"||r==="redux-dark"?e.nodeBorder:e["cScaleLabel"+(r==="neutral"?1:t)];c+=`
    .section-${t-1} rect, .section-${t-1} path, .section-${t-1} circle, .section-${t-1} polygon, .section-${t-1} path  {\

      fill: ${e["cScale"+t]};
    }
    .section-${t-1} text {
     fill: ${e["cScaleLabel"+t]};
    }
     .section-${t-1} span {
     color: ${e["cScaleLabel"+t]};
    }
    .node-icon-${t-1} {
      font-size: 40px;
      color: ${e["cScaleLabel"+t]};
    }
    .section-edge-${t-1}{
      stroke: ${e["cScale"+t]};
    }
    .edge-depth-${t-1}{
      stroke-width: ${h};
    }
    .section-${t-1} line {
      stroke: ${e["cScaleInv"+t]} ;
      stroke-width: 3;
    }

    .disabled, .disabled circle, .disabled text {
      fill: lightgray;
    }
    .disabled text {
      fill: #efefef;
    }
    [data-look="neo"].mindmap-node.section-${t-1} rect, [data-look="neo"].mindmap-node.section-${t-1} path, [data-look="\
neo"].mindmap-node.section-${t-1} circle, [data-look="neo"].mindmap-node.section-${t-1} polygon {
      fill: ${r==="redux"||r==="redux-dark"||r==="neutral"?e.mainBkg:e["cScale"+t]};
      stroke: ${r==="redux"||r==="redux-dark"?e.nodeBorder:e["cScale"+t]};
      stroke-width: ${e.strokeWidth??2}px;
    }
    [data-look="neo"].section-edge-${t-1}{
      stroke: ${r?.includes("redux")||r==="neo-dark"?e.nodeBorder:e["cScale"+t]};
    }
    [data-look="neo"].mindmap-node.section-${t-1} text, [data-look="neo"].mindmap-node.section-${t-1} span {
     fill: ${p};
     color: ${p};
    }
    `}return c},"genSections"),ke=l((e,r,g)=>{let c="";for(let t=0;t<e;t++)c+=`
    [data-look="neo"].mindmap-node.section-${t-1} rect, [data-look="neo"].mindmap-node.section-${t-1} path, [data-look="\
neo"].mindmap-node.section-${t-1} circle, [data-look="neo"].mindmap-node.section-${t-1} polygon {
      stroke: url(${r}-gradient);
      fill: ${g};
    }
    .section-${t-1} line {
      stroke-width: 0;
    }`;return c},"genGradient"),be=l(e=>{const{theme:r}=e,g=e.svgId,c=r?.includes("redux")?e.nodeBorder:e["cScaleLabel"+
(r==="neutral"?1:0)],t=e.dropShadow?e.dropShadow.replace("url(#drop-shadow)",`url(${g}-drop-shadow)`):"none";return`
  .edge {
    stroke-width: 3;
  }
  ${_e(e)}
  .section-root rect, .section-root path, .section-root circle, .section-root polygon  {
    fill: ${e.git0};
  }
  .section-root text {
    fill: ${e.gitBranchLabel0};
  }
  .section-root span {
    color: ${r?.includes("redux")?e.nodeBorder:e.gitBranchLabel0};
  }
  .icon-container {
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .edge {
    fill: none;
  }
  .mindmap-node-label {
    dy: 1em;
    alignment-baseline: middle;
    text-anchor: middle;
    dominant-baseline: middle;
    text-align: center;
  }
  [data-look="neo"].mindmap-node  {
    filter: ${t};
  }
  [data-look="neo"].mindmap-node.section-root rect, [data-look="neo"].mindmap-node.section-root path, [data-look="neo"].\
mindmap-node.section-root circle, [data-look="neo"].mindmap-node.section-root polygon  {
    fill: ${r?.includes("redux")?e.mainBkg:e.git0};
  }
  [data-look="neo"].mindmap-node.section-root .text-inner-tspan, [data-look="neo"].mindmap-node.section-root span {
    fill: ${c};
    color: ${c};
  }
  ${e.useGradient&&g&&e.mainBkg?ke(e.THEME_COLOR_LIMIT,g,e.mainBkg):""}
`},"getStyles"),Se=be,ve={get db(){return new me},renderer:Ee,parser:fe,styles:Se};export{ve as diagram};
