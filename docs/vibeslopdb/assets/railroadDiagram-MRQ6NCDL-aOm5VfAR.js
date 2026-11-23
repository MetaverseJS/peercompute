import{g as s,r as l,d as t}from"./chunk-OY52VR5R-5LEoeccu.js";import{p as m}from"./chunk-JWPE2WC7-Cc4xp-Hv.js";import{_ as n,
n as i}from"./carnageWindow-Ta-Zfo9P.js";import{c as p,M as u}from"./cynefin-EF2NZ3EQ-xLOlsQlR.js";import"./preload-helper-FD8EeCEm.js";
var d=p().Railroad.parser.LangiumParser,a=n(e=>{switch(e.$type){case"RailroadTerminalExpr":return{type:"terminal",value:e.
value};case"RailroadNonTerminalExpr":return{type:"nonterminal",name:e.name};case"RailroadSpecialExpr":return{type:"speci\
al",text:e.text};case"RailroadSequenceExpr":{const r=e.elements.map(a);return r.length===1?r[0]:{type:"sequence",elements:r}}case"\
RailroadChoiceExpr":{const r=e.alternatives.map(a);return r.length===1?r[0]:{type:"choice",alternatives:r}}case"Railroad\
OptionalExpr":return{type:"optional",element:a(e.element)};case"RailroadOneOrMoreExpr":return{type:"repetition",element:a(
e.element),min:1,max:1/0};case"RailroadZeroOrMoreExpr":return{type:"repetition",element:a(e.element),min:0,max:1/0};default:
throw new Error(`Unsupported railroad expression: ${e.$type}`)}},"transformExpression"),c=n(e=>({name:e.name,definition:a(
e.definition)}),"transformRule"),g=n(e=>{m(e,t),e.title&&t.setTitle(e.title),e.rules.map(r=>t.addRule(c(r)))},"populateD\
b"),y={parse:n(e=>{t.clear(),i.debug("[Railroad Parser] Starting Langium parse");const r=d.parse(e);if(r.lexerErrors.length>
0||r.parserErrors.length>0)throw new u(r);const o=r.value;i.debug("[Railroad Parser] Parsed rules:",o.rules.length),g(o),
i.debug("[Railroad Parser] Parse complete")},"parse"),parser:{yy:t}},x={parser:y,db:t,renderer:l,styles:s};export{x as diagram};
