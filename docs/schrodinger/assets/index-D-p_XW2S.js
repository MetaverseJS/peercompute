(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const nr=[{symbol:"H",name:"Hydrogen",Z:1,category:"nonmetal",color:"#d7f7ff",densityKgM3:.0899,meltingK:13.99,boilingK:20.27,youngsModulusPa:null,bulkModulusPa:null,conductivitySpm:0,radioactive:!1},{symbol:"He",name:"Helium",Z:2,category:"noble gas",color:"#f5d6ff",densityKgM3:.1786,meltingK:.95,boilingK:4.22,youngsModulusPa:null,bulkModulusPa:null,conductivitySpm:0,radioactive:!1},{symbol:"C",name:"Carbon",Z:6,category:"nonmetal",color:"#b9c0c7",densityKgM3:2260,meltingK:3915,boilingK:4300,youngsModulusPa:105e10,bulkModulusPa:443e9,conductivitySpm:1e5,radioactive:!1},{symbol:"N",name:"Nitrogen",Z:7,category:"nonmetal",color:"#9fc5ff",densityKgM3:1.2506,meltingK:63.15,boilingK:77.36,youngsModulusPa:null,bulkModulusPa:null,conductivitySpm:0,radioactive:!1},{symbol:"O",name:"Oxygen",Z:8,category:"nonmetal",color:"#ff9f9f",densityKgM3:1.429,meltingK:54.36,boilingK:90.19,youngsModulusPa:null,bulkModulusPa:null,conductivitySpm:0,radioactive:!1},{symbol:"Na",name:"Sodium",Z:11,category:"alkali metal",color:"#ffd37a",densityKgM3:968,meltingK:370.87,boilingK:1156,youngsModulusPa:1e10,bulkModulusPa:63e8,conductivitySpm:21e6,radioactive:!1},{symbol:"Mg",name:"Magnesium",Z:12,category:"alkaline earth",color:"#d7ffb5",densityKgM3:1738,meltingK:923,boilingK:1363,youngsModulusPa:45e9,bulkModulusPa:354e8,conductivitySpm:23e6,radioactive:!1},{symbol:"Al",name:"Aluminum",Z:13,category:"post-transition metal",color:"#d8dde6",densityKgM3:2700,meltingK:933.47,boilingK:2792,youngsModulusPa:69e9,bulkModulusPa:76e9,conductivitySpm:35e6,radioactive:!1},{symbol:"Si",name:"Silicon",Z:14,category:"metalloid",color:"#c6b399",densityKgM3:2329,meltingK:1687,boilingK:3538,youngsModulusPa:13e10,bulkModulusPa:98e9,conductivitySpm:.001,radioactive:!1},{symbol:"P",name:"Phosphorus",Z:15,category:"nonmetal",color:"#ffb36b",densityKgM3:1820,meltingK:317.3,boilingK:553.7,youngsModulusPa:null,bulkModulusPa:11e9,conductivitySpm:1e-9,radioactive:!1},{symbol:"S",name:"Sulfur",Z:16,category:"nonmetal",color:"#ffe36e",densityKgM3:2070,meltingK:388.36,boilingK:717.8,youngsModulusPa:null,bulkModulusPa:77e8,conductivitySpm:5e-16,radioactive:!1},{symbol:"Cl",name:"Chlorine",Z:17,category:"halogen",color:"#b6ff7a",densityKgM3:3.2,meltingK:171.6,boilingK:239.1,youngsModulusPa:null,bulkModulusPa:null,conductivitySpm:0,radioactive:!1},{symbol:"Ar",name:"Argon",Z:18,category:"noble gas",color:"#c7b7ff",densityKgM3:1.784,meltingK:83.8,boilingK:87.3,youngsModulusPa:null,bulkModulusPa:null,conductivitySpm:0,radioactive:!1},{symbol:"Fe",name:"Iron",Z:26,category:"transition metal",color:"#e6a36d",densityKgM3:7874,meltingK:1811,boilingK:3134,youngsModulusPa:211e9,bulkModulusPa:17e10,conductivitySpm:1e7,radioactive:!1},{symbol:"Cu",name:"Copper",Z:29,category:"transition metal",color:"#ff9b5d",densityKgM3:8960,meltingK:1357.77,boilingK:2835,youngsModulusPa:117e9,bulkModulusPa:14e10,conductivitySpm:596e5,radioactive:!1},{symbol:"Ag",name:"Silver",Z:47,category:"transition metal",color:"#edf2ff",densityKgM3:10490,meltingK:1234.93,boilingK:2435,youngsModulusPa:83e9,bulkModulusPa:1e11,conductivitySpm:63e6,radioactive:!1},{symbol:"Au",name:"Gold",Z:79,category:"transition metal",color:"#ffd05a",densityKgM3:19300,meltingK:1337.33,boilingK:3129,youngsModulusPa:78e9,bulkModulusPa:18e10,conductivitySpm:41e6,radioactive:!1},{symbol:"Pb",name:"Lead",Z:82,category:"post-transition metal",color:"#8b94a7",densityKgM3:11340,meltingK:600.61,boilingK:2022,youngsModulusPa:16e9,bulkModulusPa:46e9,conductivitySpm:48e5,radioactive:!1},{symbol:"U",name:"Uranium",Z:92,category:"actinide",color:"#6be27d",densityKgM3:19050,meltingK:1405.3,boilingK:4404,youngsModulusPa:208e9,bulkModulusPa:1e11,conductivitySpm:36e5,radioactive:!0,halfLifeYears:4468e6}],Vn=n=>nr.find(e=>e.symbol===n)||nr[0],Nc=n=>Math.max(0,Math.min(4,n-1)),Fc=(n,e)=>e<n.meltingK?"solid":e<n.boilingK?"liquid":"gas",qs=[{id:"water",label:"Water H2O",formula:"H2O",model:"water.reference-eos-v0",meltingK:273.15,boilingK:373.15},{id:"hydrogen",label:"Hydrogen H2",formula:"H2",model:"gas.reference-table-v0",meltingK:13.99,boilingK:20.27,molarMassKgMol:.002016,refractiveIndexGas:1.000132,dielectricGas:1.00026},{id:"oxygen",label:"Oxygen O2",formula:"O2",model:"gas.reference-table-v0",meltingK:54.36,boilingK:90.19,molarMassKgMol:.031998,refractiveIndexGas:1.000271,dielectricGas:1.00049},{id:"nitrogen",label:"Nitrogen N2",formula:"N2",model:"gas.reference-table-v0",meltingK:63.15,boilingK:77.36,molarMassKgMol:.028014,refractiveIndexGas:1.000298,dielectricGas:1.00058},{id:"carbon-dioxide",label:"Carbon dioxide CO2",formula:"CO2",model:"gas.reference-table-v0",meltingK:216.58,boilingK:194.67,molarMassKgMol:.04401,refractiveIndexGas:1.00045,dielectricGas:1.00098},{id:"methane",label:"Methane CH4",formula:"CH4",model:"gas.reference-table-v0",meltingK:90.69,boilingK:111.66,molarMassKgMol:.01604,refractiveIndexGas:1.000444,dielectricGas:1.00094},{id:"ammonia",label:"Ammonia NH3",formula:"NH3",model:"polar-fluid.reference-table-v0",meltingK:195.42,boilingK:239.82,molarMassKgMol:.017031,refractiveIndexGas:1.000376,dielectricGas:1.007},{id:"sodium-chloride",label:"Sodium chloride NaCl",formula:"NaCl",model:"ionic-solid.reference-table-v0",meltingK:1074,boilingK:1738,densitySolidKgM3:2160,refractiveIndexSolid:1.544,youngsModulusPa:4e10,bulkModulusPa:25e9}],Oc=n=>qs.find(e=>e.id===n)||qs[0],kn={covalent:{label:"covalent",color:"#ffc857",emissive:"#5c3410"},ionic:{label:"ionic",color:"#63e6ff",emissive:"#0f4b5c"},metallic:{label:"metallic",color:"#d7dce2",emissive:"#343a40"},unknown:{label:"unknown",color:"#d8fff0",emissive:"#173d31"}},Nl=(n="H2O")=>{const e=[],t=/([A-Z][a-z]?)(\d*)/g;let i;for(;i=t.exec(n);){const r=Math.max(1,Number.parseInt(i[2]||"1",10));for(let s=0;s<r;s++)e.push(i[1])}return e.length?e:["H","H","O"]},qt=(n,e,t=1,i="covalent bond")=>({from:n,to:e,bondClass:"covalent",order:t,label:i}),Bc=(n,e,t="ionic bond")=>({from:n,to:e,bondClass:"ionic",order:1,label:t}),pr=({formula:n,order:e=1,bondClass:t="covalent",spacing:i=.62})=>{const r=Nl(n).slice(0,2),s=t==="ionic"?Bc(0,1,`${r[0]}-${r[1]} ionic`):qt(0,1,e,`${r[0]}-${r[1]} covalent`);return{formula:n,atoms:r.map((a,o)=>({symbol:a,position:[(o-.5)*i,0,0]})),bonds:[s]}},zc=()=>{const e=52.25*Math.PI/180,t=Math.sin(e)*.56,i=Math.cos(e)*.56;return{formula:"H2O",atoms:[{symbol:"O",position:[0,0,0]},{symbol:"H",position:[t,i,0]},{symbol:"H",position:[-t,i,0]}],bonds:[qt(0,1,1,"O-H covalent"),qt(0,2,1,"O-H covalent")]}},Gc={H2O:zc(),H2:pr({formula:"H2",order:1,spacing:.56}),O2:pr({formula:"O2",order:2,spacing:.6}),N2:pr({formula:"N2",order:3,spacing:.56}),NaCl:pr({formula:"NaCl",bondClass:"ionic",spacing:.72}),CO2:{formula:"CO2",atoms:[{symbol:"O",position:[-.64,0,0]},{symbol:"C",position:[0,0,0]},{symbol:"O",position:[.64,0,0]}],bonds:[qt(0,1,2,"C-O double covalent"),qt(1,2,2,"C-O double covalent")]},CH4:{formula:"CH4",atoms:[{symbol:"C",position:[0,0,0]},{symbol:"H",position:[.55,.55,.55]},{symbol:"H",position:[-.55,-.55,.55]},{symbol:"H",position:[-.55,.55,-.55]},{symbol:"H",position:[.55,-.55,-.55]}],bonds:[qt(0,1,1,"C-H covalent"),qt(0,2,1,"C-H covalent"),qt(0,3,1,"C-H covalent"),qt(0,4,1,"C-H covalent")]},NH3:{formula:"NH3",atoms:[{symbol:"N",position:[0,0,.12]},{symbol:"H",position:[.55,0,-.16]},{symbol:"H",position:[-.28,.48,-.16]},{symbol:"H",position:[-.28,-.48,-.16]}],bonds:[qt(0,1,1,"N-H covalent"),qt(0,2,1,"N-H covalent"),qt(0,3,1,"N-H covalent")]}},kc=n=>{const e=Nl(n);return{formula:n,atoms:e.map((t,i)=>{if(i===0)return{symbol:t,position:[0,0,0]};const r=i/Math.max(1,e.length-1)*Math.PI*2;return{symbol:t,position:[Math.cos(r)*.55,Math.sin(r)*.55,0]}}),bonds:e.slice(1).map((t,i)=>qt(0,i+1,1,"template covalent"))}},Xa=(n="H2O")=>Gc[n]||kc(n),qa=(n="H2O")=>{const e=Xa(n);return e.bonds.map((t,i)=>{const r=e.atoms[t.from],s=e.atoms[t.to];return{model:"molecular-structure-reference-v0",formula:e.formula,index:i,atoms:[(r==null?void 0:r.symbol)||"?",(s==null?void 0:s.symbol)||"?"],from:t.from,to:t.to,bondClass:t.bondClass||"unknown",order:t.order||1,label:t.label||`${t.bondClass||"unknown"} bond`,confidence:"reference-template"}})},Fl=(n=[])=>n.reduce((e,t)=>{const i=t.bondClass||"unknown";return e[i]=(e[i]||0)+1,e},{}),Ol=n=>{const e=String(n);let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return t>>>0},Hc=(n=1)=>{let e=n>>>0||2654435769;const t=()=>{e=e+2654435769>>>0;let o=e;return o=Math.imul(o^o>>>16,2246822507),o=Math.imul(o^o>>>13,3266489909),(o^o>>>16)>>>0};let i=t(),r=t(),s=t(),a=t();return()=>{i>>>=0,r>>>=0,s>>>=0,a>>>=0;const o=i+r+a>>>0;return a=a+1>>>0,i=r^r>>>9,r=s+(s<<3)>>>0,s=(s<<21|s>>>11)>>>0,s=s+o>>>0,o/4294967296}},bt=(n,e,t)=>Math.min(Math.max(n,e),t),Vc=["materialId","sampleId","modelTier","timestamp","validUntil","state","mechanics","thermal","optical","electromagnetic","chemical","nuclear","validation"],Ka=({materialId:n,sampleId:e="local-cell",modelTier:t="reference-fit",validMs:i=2e3,state:r,mechanics:s={},thermal:a={},optical:o={},electromagnetic:c={},chemical:l={},nuclear:u={},validation:d={}})=>{const f=Date.now();return{materialId:n,sampleId:e,modelTier:t,timestamp:f,validUntil:f+i,state:{temperatureK:null,pressurePa:null,phase:"unknown",composition:{},densityKgM3:null,...r},mechanics:{bulkModulusPa:null,youngsModulusPa:null,shearModulusPa:null,viscosityPaS:null,surfaceTensionNpm:null,...s},thermal:{heatCapacityJkgK:null,thermalConductivityWmK:null,latentHeatJkg:null,eosParams:{},...a},optical:{refractiveIndex:null,absorptionRgb:[0,0,0],scatteringRgb:[0,0,0],polarizability:null,...o},electromagnetic:{dielectricConstant:null,electricalConductivitySpm:null,magneticSusceptibility:null,...c},chemical:{reactionRates:{},bondEvents:[],ph:null,ionFractions:{},...l},nuclear:{isotopeFractions:{},activityBqKg:0,decayHeatWKg:0,radiationSourceTerms:[],...u},validation:{status:"approximate",referenceSet:"local-reference-v0",tolerances:{},warnings:[],...d}}},Wc=n=>{const e=[];if(!n||typeof n!="object")return{ok:!1,errors:["packet must be an object"]};for(const t of Vc)t in n||e.push(`missing top-level field: ${t}`);(!n.state||typeof n.state!="object")&&e.push("state must be an object"),(!n.validation||typeof n.validation!="object")&&e.push("validation must be an object"),n.validUntil<=n.timestamp&&e.push("validUntil must be greater than timestamp");try{JSON.stringify(n)}catch(t){e.push(`packet must be JSON serializable: ${t.message}`)}return{ok:e.length===0,errors:e}},Xc=(n,e=Date.now())=>!!(n&&n.validUntil>=e),Ya=101325,Ks=461.5,qc=n=>{const e=bt(n/Ya,.01,200),t=273.15-1.8*Math.log10(e),i=373.15+22*Math.log(e);return{freezeK:bt(t,250,280),boilK:bt(i,275,650)}},Kc=({temperatureK:n,pressurePa:e=Ya})=>{const{freezeK:t,boilK:i}=qc(e),r=2.5;return n<t-r?"solid":Math.abs(n-t)<=r?"mixed":n<i-r?"liquid":Math.abs(n-i)<=r?"mixed":"gas"},bo=n=>{const e=n-273.15;return bt(999.84-.0679*(e-4)**2,930,1e3)},Yc=(n,e,t)=>{if(n==="solid")return 916.7-.08*(e-273.15);if(n==="gas")return t/(Ks*e);if(n==="mixed"){const i=t/(Ks*Math.max(e,1));return(bo(e)+i)*.5}return bo(e)},$c=({temperatureK:n=293.15,pressurePa:e=Ya,sampleId:t="water-cell"}={})=>{const i=Kc({temperatureK:n,pressurePa:e}),r=Yc(i,n,e),s=[];let a,o,c,l;return i==="solid"?(a={bulkModulusPa:88e8,youngsModulusPa:93e8,shearModulusPa:35e8,viscosityPaS:null,surfaceTensionNpm:null},o={heatCapacityJkgK:2100,thermalConductivityWmK:2.2,latentHeatJkg:333500,eosParams:{freezeK:273.15,model:"ice-Ih-reference"}},c={refractiveIndex:1.31,absorptionRgb:[.02,.015,.01],scatteringRgb:[.55,.65,.9],polarizability:1.45},l={dielectricConstant:3.2,electricalConductivitySpm:1e-8,magneticSusceptibility:-9e-6}):i==="gas"?(a={bulkModulusPa:1.33*e,youngsModulusPa:null,shearModulusPa:null,viscosityPaS:125e-7,surfaceTensionNpm:null},s.push("Young/shear modulus are not meaningful for water vapor in this model."),o={heatCapacityJkgK:1996,thermalConductivityWmK:.025,latentHeatJkg:2257e3,eosParams:{gasConstantJkgK:Ks,gamma:1.33}},c={refractiveIndex:1.00026,absorptionRgb:[.001,.001,.002],scatteringRgb:[.04,.05,.07],polarizability:1.45},l={dielectricConstant:1.0006,electricalConductivitySpm:1e-10,magneticSusceptibility:-9e-6}):(a={bulkModulusPa:22e8,youngsModulusPa:null,shearModulusPa:null,viscosityPaS:bt(.001*Math.exp(-.025*(n-293.15)),28e-5,.01),surfaceTensionNpm:bt(.0756-16e-5*(n-273.15),.04,.076)},s.push("Liquid water does not expose a static Young modulus; packet leaves it null."),o={heatCapacityJkgK:4181,thermalConductivityWmK:bt(.606-.0015*Math.abs(n-293.15),.45,.68),latentHeatJkg:i==="mixed"?2257e3:null,eosParams:{densityFit:"fresh-water-near-ambient-v0"}},c={refractiveIndex:bt(1.333-1e-4*(n-293.15),1.29,1.35),absorptionRgb:[.012,.006,.002],scatteringRgb:[.03,.04,.06],polarizability:1.45},l={dielectricConstant:bt(87.9-.36*(n-273.15),45,95),electricalConductivitySpm:55e-7,magneticSusceptibility:-9e-6}),i==="mixed"&&s.push("Mixed phase uses averaged properties until full latent-heat MD validation lands."),Ka({materialId:"water.h2o.reference-eos-v0",sampleId:t,modelTier:"reference-eos",state:{temperatureK:n,pressurePa:e,phase:i,composition:{H2O:1},densityKgM3:r},mechanics:a,thermal:o,optical:c,electromagnetic:l,chemical:{reactionRates:{},bondEvents:qa("H2O"),ph:i==="liquid"?7:null,ionFractions:i==="liquid"?{H3O:1e-7,OH:1e-7}:{}},validation:{status:"approximate",referenceSet:"water-reference-eos-v0",tolerances:{phase:"qualitative at this slice",densityKgM3:i==="liquid"?"+/- 3%":"+/- 15%",refractiveIndex:"+/- 0.02"},warnings:s}})},Yr=101325,Zc=8.31446261815324,jc=(n,e,t)=>t*n/(Zc*e),Jc=(n,e,t)=>{if(n.id==="carbon-dioxide"&&t<=5.1*Yr&&e>n.meltingK)return"gas";const i=18*Math.log(bt(t/Yr,.05,50));return e<n.meltingK?"solid":e<n.boilingK+i?"liquid":"gas"},Qc=({materialId:n="water",temperatureK:e=293.15,pressurePa:t=Yr,sampleId:i="material-cell"}={})=>{if(n==="water")return $c({temperatureK:e,pressurePa:t,sampleId:i});const r=Oc(n),s=Jc(r,e,t),a=s==="gas",o=s==="solid",c=a?jc(r.molarMassKgMol||.03,e,t):r.densitySolidKgM3||(s==="liquid"?850:1200),l=["Non-water molecule properties are coarse reference-table estimates in this slice."];return o||l.push("Static Young/shear modulus omitted for fluid/gas phase."),Ka({materialId:`${r.id}.${r.model}`,sampleId:i,modelTier:"reference-table",state:{temperatureK:e,pressurePa:t,phase:s,composition:{[r.formula]:1},densityKgM3:c},mechanics:{bulkModulusPa:a?1.4*t:r.bulkModulusPa||15e8,youngsModulusPa:o?r.youngsModulusPa||1e9:null,shearModulusPa:o?(r.youngsModulusPa||1e9)/2.6:null,viscosityPaS:a?18e-6:s==="liquid"?7e-4:null,surfaceTensionNpm:s==="liquid"?.03:null},thermal:{heatCapacityJkgK:a?1e3:1500,thermalConductivityWmK:a?.025:o?4:.18,latentHeatJkg:null,eosParams:{phaseFit:"melting-boiling-reference-v0"}},optical:{refractiveIndex:o?r.refractiveIndexSolid||1.45:r.refractiveIndexGas||1.0003,absorptionRgb:[.004,.004,.004],scatteringRgb:a?[.03,.04,.06]:[.12,.12,.12],polarizability:null},electromagnetic:{dielectricConstant:a?r.dielectricGas||1.0005:2.5,electricalConductivitySpm:r.id==="sodium-chloride"&&s==="liquid"?3:1e-12,magneticSusceptibility:-1e-6},chemical:{reactionRates:{},bondEvents:qa(r.formula),ph:null,ionFractions:{}},validation:{status:"approximate",referenceSet:r.model,tolerances:{phase:"melting/boiling threshold estimate",densityKgM3:a?"+/- 5% ideal gas":"+/- 25%"},warnings:l}})},eu=({symbol:n="H",temperatureK:e=293.15,pressurePa:t=Yr,sampleId:i="element-cell"}={})=>{const r=Vn(n),s=Fc(r,e),a=s==="gas",o=[];a&&o.push("Gas-phase element mechanics are reduced to ideal-gas bulk modulus."),s!=="solid"&&o.push("Static Young/shear modulus omitted outside solid phase.");const c=r.radioactive&&r.halfLifeYears?Math.log(2)/(r.halfLifeYears*365.25*24*3600)*(602214076e15/Math.max(1,r.Z*.0022)):0;return Ka({materialId:`element.${r.symbol.toLowerCase()}.reference-table-v0`,sampleId:i,modelTier:"reference-table",state:{temperatureK:e,pressurePa:t,phase:s,composition:{[r.symbol]:1},densityKgM3:a?t/(287*e):r.densityKgM3},mechanics:{bulkModulusPa:a?1.4*t:r.bulkModulusPa,youngsModulusPa:s==="solid"?r.youngsModulusPa:null,shearModulusPa:s==="solid"&&r.youngsModulusPa?r.youngsModulusPa/2.6:null,viscosityPaS:a?18e-6:null,surfaceTensionNpm:s==="liquid"?.5:null},thermal:{heatCapacityJkgK:s==="solid"?450:a?1e3:700,thermalConductivityWmK:s==="solid"?50:a?.03:30,latentHeatJkg:null,eosParams:{meltingK:r.meltingK,boilingK:r.boilingK}},optical:{refractiveIndex:a?1.0003:1.4,absorptionRgb:[.01,.01,.01],scatteringRgb:a?[.03,.04,.06]:[.1,.1,.1],polarizability:null},electromagnetic:{dielectricConstant:a?1.0005:2.5,electricalConductivitySpm:r.conductivitySpm,magneticSusceptibility:r.symbol==="Fe"?2e5:-1e-5},nuclear:{isotopeFractions:r.radioactive?{[`${r.symbol}-natural`]:1}:{},activityBqKg:c,decayHeatWKg:c*8e-14,radiationSourceTerms:c>0?[{type:"alpha-beta-gamma-natural",activityBqKg:c}]:[]},validation:{status:"approximate",referenceSet:"element-reference-table-v0",tolerances:{properties:"coarse engineering reference table"},warnings:o}})},mr=27.211386245988,Bl=({n=1,zEff:e=1}={})=>{if(n<1)throw new Error("n must be >= 1");return-13.605693122994*e*e/(n*n)},zl=({n=1,zEff:e=1,scale:t=4.5}={})=>{const i=Math.max(.25,e);return Math.max(2,t*n*n/i)},tu=["s","p","d","f","g"],nu=1/137.035999084,Gl=(n,e,t,i={})=>{if(!i.screeningExchange||n.Z<=1)return n.Z;const r=2*e*e,s=Math.max(0,2*(e-1)*(e-1)),a=bt(n.Z-s,0,r),o=Math.max(0,n.Z-a),c=Math.max(0,a-1)*.35,l=o*(t<=1?.85:.95),u=t>0?.015*(2*t+1):0;return bt(n.Z-c-l+u,1,n.Z)},kl=(n,e,t,i={})=>{if(!i.relativisticSpinOrbit)return n;const r=(nu*n)**2;return n*(1+.28*r/Math.max(1,e*(t+1)))},iu=({element:n,n:e,l:t,m:i,gridSize:r,options:s})=>`${n.symbol}:${e}:${t}:${i}:${r}:${!!s.screeningExchange}:${!!s.relativisticSpinOrbit}:${!!s.correlationMixing}`;let ds=null;const $a="peercompute.schrodinger.radial-webgpu-eigensolver.v0",Za="peercompute.schrodinger.orbital-grid-webgpu.v0",ru=.0529177210903,su=24.188843265857,So=96,au=768,fi=128,Rn=128,ti=(n,e,t)=>Math.min(t,Math.max(e,n)),Nt=(n,e=0)=>{if(n==null||n==="")return e;const t=Number(n);return Number.isFinite(t)?t:e},ou=(n,e)=>{const t=ti(Math.round(192+Math.max(1,e)*32),So,512);return Math.round(ti(Nt(n,t),So,au))},lu=({n,radialZ:e})=>{const t=Math.max(.25,e),i=zl({n,zEff:t,scale:10});return ti(Math.max(18/t,i),8/t,420)},cu=n=>{let e=0;for(const s of n)e=Math.max(e,Math.abs(s));const t=e*1e-4;let i=0,r=0;for(const s of n){if(Math.abs(s)<=t)continue;const a=s<0?-1:1;i!==0&&a!==i&&(r+=1),i=a}return r},uu=({energyErrorEv:n,residualRelativeL2:e,potentialModel:t})=>t!=="coulomb"?e<.002?"webgpu-screened-converged":"webgpu-screened-watch":Math.abs(n)<.08&&e<.002?"webgpu-converged":Math.abs(n)<.35&&e<.01?"webgpu-watch":"webgpu-refine",Pi=(n,e,t,i=0)=>n.createBuffer({label:e,size:Math.max(4,t),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|i}),ni=async(n,e,t,i)=>{const r=n.createBuffer({label:i,size:Math.max(4,t),usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),s=n.createCommandEncoder();s.copyBufferToBuffer(e,0,r,0,Math.max(4,t)),n.queue.submit([s.finish()]),await r.mapAsync(GPUMapMode.READ);const a=r.getMappedRange().slice(0,t);return r.unmap(),r.destroy(),new Float32Array(a)},Ys=n=>{const e=[0,0,0,0];for(let t=0;t<n.length;t+=4)e[0]+=n[t],e[1]+=n[t+1],e[2]+=n[t+2],e[3]+=n[t+3];return e},du=({vector:n,spacing:e,pointCount:t})=>{var a;const i=[],r=Math.max(1,Math.floor(t/96));for(let o=0;o<t;o+=r)i.push({rBohr:(o+1)*e,u:n[o],probabilityDensity:n[o]*n[o]});const s=t-1;return((a=i[i.length-1])==null?void 0:a.rBohr)!==(s+1)*e&&i.push({rBohr:(s+1)*e,u:n[s],probabilityDensity:n[s]*n[s]}),i},hu=async()=>{if(typeof navigator>"u"||!navigator.gpu)return{available:!1,backend:"none",reason:"navigator.gpu unavailable"};try{const n=await navigator.gpu.requestAdapter();return n?{available:!0,backend:"webgpu",reason:"ok",adapterInfo:n.info||null}:{available:!1,backend:"webgpu",reason:"requestAdapter returned null"}}catch(n){return{available:!1,backend:"webgpu",reason:n.message||String(n)}}},ja=async()=>(ds||(ds=(async()=>{if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU unavailable");const n=await navigator.gpu.requestAdapter();if(!n)throw new Error("No WebGPU adapter available");return n.requestDevice()})()),ds),fu=async({element:n=null,atomicNumber:e=null,n:t=1,l:i=0,zEff:r=null,options:s={},gridPointCount:a=null,radialExtentBohr:o=null,gpuDevice:c=null}={})=>{const l=c||await ja(),u=Math.max(1,Math.round(Nt(t,1))),d=Math.max(0,Math.round(Nt(i,0)));if(d>=u)throw new Error("radial WebGPU eigensolver requires 0 <= l < n");const f=Math.max(1,Math.round(Nt(e,(n==null?void 0:n.Z)||1))),p=Math.max(.05,Nt(r,n?Gl(n,u,d,s):f)),_=kl(p,u,d,s),v=ou(a,u),m=Math.max(1,Nt(o,lu({n:u,radialZ:_}))),h=m/(v+1),E=Nt(s.debyeLengthBohr,1/0),T=Math.max(0,Nt(s.coulombSofteningBohr,0)),y=s.debyeLengthBohr||s.coulombSofteningBohr?"screened-softened-coulomb":"coulomb",w=Bl({n:u,zEff:_})/mr,A=Math.max(1,Math.ceil(v/fi)),R=l.createShaderModule({label:"schrodinger-radial-webgpu-eigensolver",code:`
      @group(0) @binding(0) var<storage, read> params: array<f32>;
      @group(0) @binding(1) var<storage, read_write> waveU: array<f32>;
      @group(0) @binding(2) var<storage, read_write> residuals: array<f32>;
      @group(0) @binding(3) var<storage, read_write> partials: array<vec4f>;

      var<workgroup> localPartial: array<vec4f, ${fi}>;

      fn paramU(index: u32) -> u32 {
        return u32(max(0.0, params[index]) + 0.5);
      }

      fn factorialF(n: u32) -> f32 {
        var out = 1.0;
        var i = 2u;
        loop {
          if (i > n) {
            break;
          }
          out = out * f32(i);
          i = i + 1u;
        }
        return out;
      }

      fn binomialF(n: u32, k: u32) -> f32 {
        if (k > n) {
          return 0.0;
        }
        return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
      }

      fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
        var sum = 0.0;
        var i = 0u;
        loop {
          if (i > p) {
            break;
          }
          var sign = 1.0;
          if ((i % 2u) == 1u) {
            sign = -1.0;
          }
          sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
          i = i + 1u;
        }
        return sum;
      }

      fn radialUAtRadius(r: f32) -> f32 {
        let principalN = paramU(1u);
        let angularL = paramU(2u);
        let nF = max(1.0, f32(principalN));
        let lF = f32(angularL);
        let radialZ = max(0.0001, params[3u]);
        let rho = (2.0 * radialZ * max(r, 0.000001)) / nF;
        let laguerreP = principalN - angularL - 1u;
        let laguerreK = 2u * angularL + 1u;
        let numerator = factorialF(laguerreP);
        let denominator = max(1.0, 2.0 * nF * factorialF(principalN + angularL));
        let prefactor = sqrt(pow((2.0 * radialZ) / nF, 3.0) * numerator / denominator);
        return r * prefactor * exp(-0.5 * rho) * pow(rho, lF) * associatedLaguerre(laguerreP, laguerreK, rho);
      }

      fn rawUAtSlot(slot: i32) -> f32 {
        let count = i32(paramU(0u));
        if (slot <= 0 || slot > count) {
          return 0.0;
        }
        return radialUAtRadius(f32(slot) * params[4u]);
      }

      fn potentialAtRadius(r: f32) -> f32 {
        let angularL = f32(paramU(2u));
        let radialZ = max(0.0001, params[3u]);
        let softening = max(0.0, params[7u]);
        var denominator = max(r, 0.000001);
        if (softening > 0.0) {
          denominator = sqrt(r * r + softening * softening);
        }
        var screening = 1.0;
        let debyeLength = params[6u];
        if (debyeLength > 0.0) {
          screening = exp(-r / debyeLength);
        }
        let coulomb = -radialZ * screening / denominator;
        let centrifugal = angularL * (angularL + 1.0) / max(0.000001, 2.0 * r * r);
        return coulomb + centrifugal;
      }

      fn hamiltonianRawAtIndex(index: u32) -> f32 {
        let spacing = params[4u];
        let slot = i32(index) + 1;
        let r = f32(slot) * spacing;
        let u = rawUAtSlot(slot);
        let left = rawUAtSlot(slot - 1);
        let right = rawUAtSlot(slot + 1);
        let secondDerivative = (left - 2.0 * u + right) / max(0.0000001, spacing * spacing);
        return -0.5 * secondDerivative + potentialAtRadius(r) * u;
      }

      fn reduceLocal(localIndex: u32, workgroupIndex: u32) {
        workgroupBarrier();
        var stride = ${fi/2}u;
        loop {
          if (stride == 0u) {
            break;
          }
          if (localIndex < stride) {
            localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
          }
          workgroupBarrier();
          stride = stride / 2u;
        }
        if (localIndex == 0u) {
          partials[workgroupIndex] = localPartial[0u];
        }
      }

      @compute @workgroup_size(${fi})
      fn prepare(
        @builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(workgroup_id) wid: vec3u
      ) {
        let index = gid.x;
        let localIndex = lid.x;
        let count = paramU(0u);
        var sum = vec4f(0.0, 0.0, 0.0, 0.0);
        if (index < count) {
          let slot = i32(index) + 1;
          let spacing = params[4u];
          let r = f32(slot) * spacing;
          let u = rawUAtSlot(slot);
          let h = hamiltonianRawAtIndex(index);
          let density = u * u;
          waveU[index] = u;
          residuals[index] = 0.0;
          sum = vec4f(
            density * spacing,
            u * h * spacing,
            density * r * spacing,
            density * r * r * spacing
          );
        }
        localPartial[localIndex] = sum;
        reduceLocal(localIndex, wid.x);
      }

      @compute @workgroup_size(${fi})
      fn diagnose(
        @builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(workgroup_id) wid: vec3u
      ) {
        let index = gid.x;
        let localIndex = lid.x;
        let count = paramU(0u);
        var sum = vec4f(0.0, 0.0, 0.0, 0.0);
        if (index < count) {
          let slot = i32(index) + 1;
          let spacing = params[4u];
          let r = f32(slot) * spacing;
          let normScale = params[10u];
          let energy = params[11u];
          let u = rawUAtSlot(slot) * normScale;
          let h = hamiltonianRawAtIndex(index) * normScale;
          let residual = h - energy * u;
          let reference = energy * u;
          let density = u * u;
          waveU[index] = u;
          residuals[index] = residual;
          sum = vec4f(
            density * spacing,
            residual * residual * spacing,
            reference * reference * spacing,
            density * r * spacing
          );
        }
        localPartial[localIndex] = sum;
        reduceLocal(localIndex, wid.x);
      }
    `}),O=l.createBindGroupLayout({label:"schrodinger-radial-webgpu-bindgroup-layout",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),x=l.createPipelineLayout({label:"schrodinger-radial-webgpu-pipeline-layout",bindGroupLayouts:[O]}),b=l.createComputePipeline({label:"schrodinger-radial-webgpu-prepare-pipeline",layout:x,compute:{module:R,entryPoint:"prepare"}}),P=l.createComputePipeline({label:"schrodinger-radial-webgpu-diagnose-pipeline",layout:x,compute:{module:R,entryPoint:"diagnose"}}),F=new Float32Array(16);F[0]=v,F[1]=u,F[2]=d,F[3]=_,F[4]=h,F[5]=m,F[6]=Number.isFinite(E)&&E>0?E:0,F[7]=T,F[8]=w,F[9]=y==="coulomb"?0:1,F[10]=1,F[11]=w;const U=l.createBuffer({label:"schrodinger-radial-webgpu-params",size:F.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),V=Pi(l,"schrodinger-radial-webgpu-wave-u",v*4),q=Pi(l,"schrodinger-radial-webgpu-residuals",v*4),k=Pi(l,"schrodinger-radial-webgpu-partials",A*16),W=l.createBindGroup({label:"schrodinger-radial-webgpu-bindgroup",layout:O,entries:[{binding:0,resource:{buffer:U}},{binding:1,resource:{buffer:V}},{binding:2,resource:{buffer:q}},{binding:3,resource:{buffer:k}}]});l.queue.writeBuffer(U,0,F);let $=l.createCommandEncoder(),ie=$.beginComputePass({label:"schrodinger-radial-webgpu-prepare-pass"});ie.setPipeline(b),ie.setBindGroup(0,W),ie.dispatchWorkgroups(A),ie.end(),l.queue.submit([$.finish()]);const ee=await ni(l,k,A*16,"schrodinger-radial-webgpu-prepare-readback"),[he,Ue,Fe,at]=Ys(ee),Qe=Math.max(1e-30,he),K=Ue/Qe,j=1/Math.sqrt(Qe);F[10]=j,F[11]=K,l.queue.writeBuffer(U,0,F),$=l.createCommandEncoder(),ie=$.beginComputePass({label:"schrodinger-radial-webgpu-diagnose-pass"}),ie.setPipeline(P),ie.setBindGroup(0,W),ie.dispatchWorkgroups(A),ie.end(),l.queue.submit([$.finish()]);const[pe,Te,ge]=await Promise.all([ni(l,k,A*16,"schrodinger-radial-webgpu-diagnostic-readback"),ni(l,V,v*4,"schrodinger-radial-webgpu-wave-readback"),ni(l,q,v*4,"schrodinger-radial-webgpu-residual-readback")]),[Oe,ut,ke,We]=Ys(pe),Ke=Math.sqrt(Math.max(0,ut)),Ae=Ke/Math.max(1e-30,Math.sqrt(Math.max(0,ke))),Ye=K*mr,C=w*mr,$e=Ye-C;let qe=0,et=0,xe=0;for(let S=0;S<v;S+=1){qe=Math.max(qe,Math.abs(ge[S]));const g=Te[S]*Te[S];g>et&&(et=g,xe=(S+1)*h)}return U.destroy(),V.destroy(),q.destroy(),k.destroy(),{schema:$a,modelId:"radial-webgpu-hydrogenic-basis-hamiltonian-v0",mode:"time-independent-radial-schrodinger",status:uu({energyErrorEv:$e,residualRelativeL2:Ae,potentialModel:y}),backend:"webgpu-radial-schrodinger",hamiltonian:"H_l = -1/2 d2/dr2 + l(l+1)/(2r^2) - Z_eff/r",solver:"webgpu-analytic-basis-finite-difference-hamiltonian",potentialModel:y,units:{length:"bohr",energy:"hartree/eV",timeAtomicUnitAttoseconds:su},elementSymbol:(n==null?void 0:n.symbol)||null,atomicNumber:f,principalN:u,angularL:d,radialNodeCountTarget:Math.max(0,u-d-1),radialNodeCountObserved:cu(Te),zEff:p,radialZ:_,energyHartree:K,energyEv:Ye,analyticEnergyHartree:w,analyticEnergyEv:C,energyErrorHartree:K-w,energyErrorEv:$e,relativeEnergyError:Math.abs($e)/Math.max(1e-12,Math.abs(C)),residualL2Hartree:Ke,residualRelativeL2:Ae,maxAbsResidualHartree:qe,maxAbsResidualEv:qe*mr,normalization:Oe,meanRadiusBohr:We/Math.max(1e-30,Oe),meanRadiusNm:We/Math.max(1e-30,Oe)*ru,rmsRadiusBohr:Math.sqrt(Math.max(0,at/Qe)),peakRadiusBohr:xe,peakProbabilityDensity:et,gridPointCount:v,radialExtentBohr:m,spacingBohr:h,iterationsRequested:0,iterationsCompleted:0,shiftHartree:null,converged:Ae<.002,radialSamples:du({vector:Te,spacing:h,pointCount:v}),radialGrid:{schema:"peercompute.schrodinger.radial-webgpu-grid.v0",radiiBohr:null,wavefunctionU:Te,residualHartree:ge,spacingBohr:h,pointCount:v},webgpuStatus:{available:!0,kernelMode:"webgpu-radial-hamiltonian",reductionMode:"webgpu-workgroup-partials-js-final-sum",partialCount:A,workgroupSize:fi},validity:{status:"webgpu-primary-schrodinger-basis",warnings:["WebGPU samples the hydrogenic radial basis and evaluates the radial Hamiltonian/residual directly on GPU.","This is not a CPU fallback path; unavailable WebGPU is reported as unavailable."]}}},pu=async({element:n,n:e=1,l:t=0,m:i=0,gridSize:r=28,sampleCount:s=6e4,sampleSeed:a="orbital",jitterScale:o=.72,extentBohr:c=null,options:l={}}={})=>{if(!n)throw new Error("buildOrbitalGridGpu requires an element");const u=await ja(),d=Math.max(1,Math.round(Nt(e,1))),f=Math.max(0,Math.round(Nt(t,0))),p=Math.round(ti(Nt(i,0),-f,f));if(f>=d)throw new Error("orbital WebGPU grid requires 0 <= l < n");const _=Math.round(ti(Nt(r,28),8,72)),v=_*_*_,m=Math.round(ti(Nt(s,6e4),1024,25e4)),h=Ol(a),E=Gl(n,d,f,l),T=kl(E,d,f,l),y=Nt(c,zl({n:d,zEff:E})),w=y*2/Math.max(1,_-1),A=Math.max(1,Math.ceil(v/Rn)),R=u.createShaderModule({label:"schrodinger-orbital-grid-webgpu",code:`
      const PI: f32 = 3.141592653589793;

      @group(0) @binding(0) var<storage, read> params: array<f32>;
      @group(0) @binding(1) var<storage, read_write> samples: array<vec4f>;
      @group(0) @binding(2) var<storage, read_write> partials: array<vec4f>;
      @group(0) @binding(3) var<storage, read_write> pointRecords: array<vec4f>;

      var<workgroup> localPartial: array<vec4f, ${Rn}>;

      fn paramU(index: u32) -> u32 {
        return u32(max(0.0, params[index]) + 0.5);
      }

      fn paramI(index: u32) -> i32 {
        let value = params[index];
        if (value < 0.0) {
          return -i32(abs(value) + 0.5);
        }
        return i32(value + 0.5);
      }

      fn absI(value: i32) -> u32 {
        if (value < 0) {
          return u32(-value);
        }
        return u32(value);
      }

      fn factorialF(n: u32) -> f32 {
        var out = 1.0;
        var i = 2u;
        loop {
          if (i > n) {
            break;
          }
          out = out * f32(i);
          i = i + 1u;
        }
        return out;
      }

      fn binomialF(n: u32, k: u32) -> f32 {
        if (k > n) {
          return 0.0;
        }
        return factorialF(n) / max(1.0, factorialF(k) * factorialF(n - k));
      }

      fn associatedLaguerre(p: u32, k: u32, x: f32) -> f32 {
        var sum = 0.0;
        var i = 0u;
        loop {
          if (i > p) {
            break;
          }
          var sign = 1.0;
          if ((i % 2u) == 1u) {
            sign = -1.0;
          }
          sum = sum + sign * binomialF(p + k, p - i) * pow(x, f32(i)) / max(1.0, factorialF(i));
          i = i + 1u;
        }
        return sum;
      }

      fn associatedLegendre(l: u32, m: u32, x: f32) -> f32 {
        let clampedX = clamp(x, -1.0, 1.0);
        var pmm = 1.0;
        if (m > 0u) {
          let root = sqrt(max(0.0, (1.0 - clampedX) * (1.0 + clampedX)));
          var fact = 1.0;
          var i = 1u;
          loop {
            if (i > m) {
              break;
            }
            pmm = pmm * (-fact * root);
            fact = fact + 2.0;
            i = i + 1u;
          }
        }
        if (l == m) {
          return pmm;
        }
        var pmmp1 = clampedX * f32(2u * m + 1u) * pmm;
        if (l == m + 1u) {
          return pmmp1;
        }
        var pll = 0.0;
        var ll = m + 2u;
        loop {
          if (ll > l) {
            break;
          }
          pll = (f32(2u * ll - 1u) * clampedX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
          pmm = pmmp1;
          pmmp1 = pll;
          ll = ll + 1u;
        }
        return pll;
      }

      fn realSphericalHarmonic(l: u32, mSigned: i32, theta: f32, phi: f32) -> f32 {
        let absM = absI(mSigned);
        let plm = associatedLegendre(l, absM, cos(theta));
        let norm = sqrt(((f32(2u * l + 1u)) / (4.0 * PI)) * (factorialF(l - absM) / max(1.0, factorialF(l + absM))));
        if (mSigned > 0) {
          return sqrt(2.0) * norm * plm * cos(f32(absM) * phi);
        }
        if (mSigned < 0) {
          return sqrt(2.0) * norm * plm * sin(f32(absM) * phi);
        }
        return norm * plm;
      }

      fn radialComponentAt(n: u32, l: u32, r: f32, radialZ: f32) -> f32 {
        let nF = max(1.0, f32(n));
        let rho = (2.0 * radialZ * max(r, 0.000001)) / nF;
        let prefactor = sqrt(pow((2.0 * radialZ) / nF, 3.0) * (factorialF(n - l - 1u) / max(1.0, 2.0 * nF * factorialF(n + l))));
        return prefactor * exp(-0.5 * rho) * pow(rho, f32(l)) * associatedLaguerre(n - l - 1u, 2u * l + 1u, rho);
      }

      fn orbitalProbabilityFor(n: u32, l: u32, mSigned: i32, r: f32, theta: f32, phi: f32, radialZ: f32) -> f32 {
        let radial = radialComponentAt(n, l, r, radialZ);
        let ylm = realSphericalHarmonic(l, mSigned, theta, phi);
        return max(0.0, radial * radial * ylm * ylm);
      }

      fn correlationProbability(baseProbability: f32, n: u32, l: u32, mSigned: i32, r: f32, theta: f32, phi: f32, radialZ: f32, zEff: f32) -> f32 {
        if (params[12u] < 0.5 || n < 2u) {
          return baseProbability;
        }
        var mixed = 0.0;
        var weight = 0.0;
        var candidateN = n - 1u;
        var candidateL = min(l, candidateN - 1u);
        var candidateM = clamp(mSigned, -i32(candidateL), i32(candidateL));
        mixed = mixed + 0.42 * orbitalProbabilityFor(candidateN, candidateL, candidateM, r, theta, phi, radialZ);
        weight = weight + 0.42;

        candidateN = n;
        candidateL = l;
        if (l > 0u) {
          candidateL = l - 1u;
        }
        candidateM = clamp(mSigned, -i32(candidateL), i32(candidateL));
        mixed = mixed + 0.29 * orbitalProbabilityFor(candidateN, candidateL, candidateM, r, theta, phi, radialZ);
        weight = weight + 0.29;

        candidateN = n;
        candidateL = min(n - 1u, l + 1u);
        candidateM = clamp(mSigned, -i32(candidateL), i32(candidateL));
        mixed = mixed + 0.29 * orbitalProbabilityFor(candidateN, candidateL, candidateM, r, theta, phi, radialZ);
        weight = weight + 0.29;

        let strength = clamp(0.04 + zEff * 0.002, 0.04, 0.18);
        return (1.0 - strength) * baseProbability + strength * (mixed / max(0.000001, weight));
      }

      fn spinOrbitDensityFactor(theta: f32, n: u32, l: u32, mSigned: i32, zEff: f32) -> f32 {
        if (params[11u] < 0.5 || l == 0u || mSigned == 0) {
          return 1.0;
        }
        let alpha = 0.0072973525693;
        let beta = (alpha * zEff) * (alpha * zEff);
        let coupling = (0.24 * beta * f32(l)) / max(1.0, f32(n * n));
        return clamp(1.0 + coupling * cos(theta) * (f32(mSigned) / max(1.0, f32(l))), 0.5, 1.5);
      }

      fn probabilityAt(x: f32, y: f32, z: f32) -> f32 {
        let n = paramU(1u);
        let l = paramU(2u);
        let mSigned = paramI(3u);
        let zEff = params[4u];
        let radialZ = params[5u];
        let r = sqrt(x * x + y * y + z * z);
        let theta = select(acos(clamp(z / max(0.000001, r), -1.0, 1.0)), 0.0, r <= 0.000001);
        let phi = atan2(y, x);
        var probability = orbitalProbabilityFor(n, l, mSigned, r, theta, phi, radialZ);
        probability = probability * spinOrbitDensityFactor(theta, n, l, mSigned, zEff);
        return correlationProbability(probability, n, l, mSigned, r, theta, phi, radialZ, zEff);
      }

      fn reduceLocal(localIndex: u32, workgroupIndex: u32) {
        workgroupBarrier();
        var stride = ${Rn/2}u;
        loop {
          if (stride == 0u) {
            break;
          }
          if (localIndex < stride) {
            localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
          }
          workgroupBarrier();
          stride = stride / 2u;
        }
        if (localIndex == 0u) {
          partials[workgroupIndex] = localPartial[0u];
        }
      }

      fn hash32(value: u32) -> u32 {
        var x = value;
        x = (x ^ (x >> 16u)) * 0x7feb352du;
        x = (x ^ (x >> 15u)) * 0x846ca68bu;
        x = x ^ (x >> 16u);
        return x;
      }

      fn rand01(seed: u32, index: u32, salt: u32) -> f32 {
        let value = hash32(seed ^ (index * 0x9e3779b9u) ^ (salt * 0x85ebca6bu));
        return f32(value) / 4294967296.0;
      }

      @compute @workgroup_size(${Rn})
      fn evaluate(
        @builtin(global_invocation_id) gid: vec3u,
        @builtin(local_invocation_id) lid: vec3u,
        @builtin(workgroup_id) wid: vec3u
      ) {
        let index = gid.x;
        let localIndex = lid.x;
        let count = paramU(0u);
        let size = paramU(8u);
        var sum = vec4f(0.0, 0.0, 0.0, 0.0);
        if (index < count) {
          let area = size * size;
          let zIndex = index / area;
          let yz = index - zIndex * area;
          let yIndex = yz / size;
          let xIndex = yz - yIndex * size;
          let extent = params[6u];
          let spacing = params[7u];
          let x = -extent + f32(xIndex) * spacing;
          let y = -extent + f32(yIndex) * spacing;
          let z = -extent + f32(zIndex) * spacing;
          let probability = probabilityAt(x, y, z);
          let r = sqrt(x * x + y * y + z * z);
          var boundary = 0.0;
          if (xIndex == 0u || yIndex == 0u || zIndex == 0u || xIndex == size - 1u || yIndex == size - 1u || zIndex == size - 1u) {
            boundary = probability;
          }
          samples[index] = vec4f(x, y, z, probability);
          sum = vec4f(probability, probability * r, probability * r * r, boundary);
        }
        localPartial[localIndex] = sum;
        reduceLocal(localIndex, wid.x);
      }

      @compute @workgroup_size(${Rn})
      fn normalize(@builtin(global_invocation_id) gid: vec3u) {
        let index = gid.x;
        if (index >= paramU(0u)) {
          return;
        }
        let invNorm = params[10u];
        let sample = samples[index];
        samples[index] = vec4f(sample.x, sample.y, sample.z, max(0.0, sample.w * invNorm));
      }

      @compute @workgroup_size(${Rn})
      fn samplePoints(@builtin(global_invocation_id) gid: vec3u) {
        let index = gid.x;
        let pointCount = paramU(13u);
        if (index >= pointCount) {
          return;
        }
        let gridCount = paramU(0u);
        let seed = paramU(14u);
        var bestIndex = min(gridCount - 1u, u32(rand01(seed, index, 1u) * f32(gridCount)));
        var bestScore = -1.0;
        var candidateSlot = 0u;
        loop {
          if (candidateSlot >= 16u) {
            break;
          }
          let candidate = min(gridCount - 1u, u32(rand01(seed, index, 11u + candidateSlot * 3u) * f32(gridCount)));
          let probability = max(0.0, samples[candidate].w);
          let draw = max(0.000001, rand01(seed, index, 13u + candidateSlot * 3u));
          let score = pow(max(probability, 1e-30), 0.72) / draw;
          if (score > bestScore) {
            bestScore = score;
            bestIndex = candidate;
          }
          candidateSlot = candidateSlot + 1u;
        }
        let source = samples[bestIndex];
        let zJitter = 1.0 - 2.0 * rand01(seed, index, 101u);
        let ring = sqrt(max(0.0, 1.0 - zJitter * zJitter));
        let angle = rand01(seed, index, 103u) * PI * 2.0;
        let jitterRadius = pow(max(0.0, rand01(seed, index, 107u)), 0.33333334) * params[7u] * params[15u];
        let x = source.x + cos(angle) * ring * jitterRadius;
        let y = source.y + sin(angle) * ring * jitterRadius;
        let z = source.z + zJitter * jitterRadius;
        let pointRadius = sqrt(x * x + y * y + z * z);
        let shade = clamp(1.0 - pointRadius / 48.0, 0.28, 1.0);
        pointRecords[index] = vec4f(x, y, z, shade);
      }
    `}),O=u.createBindGroupLayout({label:"schrodinger-orbital-grid-bindgroup-layout",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),x=u.createPipelineLayout({label:"schrodinger-orbital-grid-pipeline-layout",bindGroupLayouts:[O]}),b=u.createComputePipeline({label:"schrodinger-orbital-grid-evaluate-pipeline",layout:x,compute:{module:R,entryPoint:"evaluate"}}),P=u.createComputePipeline({label:"schrodinger-orbital-grid-normalize-pipeline",layout:x,compute:{module:R,entryPoint:"normalize"}}),F=u.createComputePipeline({label:"schrodinger-orbital-grid-sample-pipeline",layout:x,compute:{module:R,entryPoint:"samplePoints"}}),U=new Float32Array(16);U[0]=v,U[1]=d,U[2]=f,U[3]=p,U[4]=E,U[5]=T,U[6]=y,U[7]=w,U[8]=_,U[9]=n.Z||1,U[10]=1,U[11]=l.relativisticSpinOrbit?1:0,U[12]=l.correlationMixing?1:0,U[13]=m,U[14]=h,U[15]=ti(Nt(o,.72),0,2);const V=u.createBuffer({label:"schrodinger-orbital-grid-params",size:U.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),q=Pi(u,"schrodinger-orbital-grid-samples",v*16),k=Pi(u,"schrodinger-orbital-grid-partials",A*16),W=Pi(u,"schrodinger-orbital-grid-point-records",m*16),$=u.createBindGroup({label:"schrodinger-orbital-grid-bindgroup",layout:O,entries:[{binding:0,resource:{buffer:V}},{binding:1,resource:{buffer:q}},{binding:2,resource:{buffer:k}},{binding:3,resource:{buffer:W}}]});u.queue.writeBuffer(V,0,U);let ie=u.createCommandEncoder(),ee=ie.beginComputePass({label:"schrodinger-orbital-grid-evaluate-pass"});ee.setPipeline(b),ee.setBindGroup(0,$),ee.dispatchWorkgroups(A),ee.end(),u.queue.submit([ie.finish()]);const he=await ni(u,k,A*16,"schrodinger-orbital-grid-partial-readback"),[Ue,Fe,at,Qe]=Ys(he),K=Math.max(1e-30,Ue);U[10]=1/K,u.queue.writeBuffer(V,0,U),ie=u.createCommandEncoder(),ee=ie.beginComputePass({label:"schrodinger-orbital-grid-normalize-pass"}),ee.setPipeline(P),ee.setBindGroup(0,$),ee.dispatchWorkgroups(A),ee.end(),ee=ie.beginComputePass({label:"schrodinger-orbital-grid-sample-pass"}),ee.setPipeline(F),ee.setBindGroup(0,$),ee.dispatchWorkgroups(Math.max(1,Math.ceil(m/Rn))),ee.end(),u.queue.submit([ie.finish()]);const[j,pe]=await Promise.all([ni(u,q,v*16,"schrodinger-orbital-grid-sample-readback"),ni(u,W,m*16,"schrodinger-orbital-grid-point-readback")]),Te=new Float32Array(v*3),ge=new Float32Array(v),Oe=new Float32Array(m*3),ut=new Float32Array(m*3);let ke=0,We=0,Ke=0;for(let Ae=0;Ae<v;Ae+=1){const Ye=Ae*4,C=Ae*3,$e=j[Ye+3];Te[C]=j[Ye],Te[C+1]=j[Ye+1],Te[C+2]=j[Ye+2],ge[Ae]=$e,ke+=$e,$e>We&&(We=$e,Ke=Math.hypot(Te[C],Te[C+1],Te[C+2]))}for(let Ae=0;Ae<m;Ae+=1){const Ye=Ae*4,C=Ae*3,$e=pe[Ye+3];Oe[C]=pe[Ye],Oe[C+1]=pe[Ye+1],Oe[C+2]=pe[Ye+2],ut[C]=$e,ut[C+1]=$e,ut[C+2]=$e}return V.destroy(),q.destroy(),k.destroy(),W.destroy(),{schema:Za,modelId:"orbital-grid-webgpu-hydrogenic-density-v0",status:"webgpu-grid-ready",backend:"webgpu-orbital-grid-density",positions:Te,probabilities:ge,points:Oe,colors:ut,extentBohr:y,spacingBohr:w,gridSize:_,zEff:E,radialZ:T,energyEv:Bl({n:d,zEff:E}),normalization:ke,rawNormalization:Ue,maxProbability:We,maxRadiusBohr:Ke,pointSampleCount:m,pointSamplingMode:"webgpu-hash-importance-sampling",meanRadiusBohr:Fe/K,rmsRadiusBohr:Math.sqrt(Math.max(0,at/K)),boundaryMass:Qe/K,webgpuStatus:{available:!0,kernelMode:"webgpu-orbital-grid-density",pointKernelMode:"webgpu-orbital-grid-point-sampling",reductionMode:"webgpu-workgroup-partials-js-final-sum",partialCount:A,workgroupSize:Rn},validity:{status:"webgpu-primary-orbital-grid",warnings:["The standalone orbital probability grid is evaluated on WebGPU; no CPU grid fallback is used by the live demo path."]}}},mu=async n=>{if(!(n instanceof Float32Array)||n.length%2!==0)throw new Error("complexAmplitudes must be a Float32Array of re/im pairs");const e=await ja(),t=n.length/2,i=e.createShaderModule({label:"schrodinger-probability-density",code:`
      struct Params {
        count: u32,
      };

      @group(0) @binding(0) var<storage, read> amplitudes: array<vec2<f32>>;
      @group(0) @binding(1) var<storage, read_write> probabilities: array<f32>;
      @group(0) @binding(2) var<uniform> params: Params;

      @compute @workgroup_size(128)
      fn main(@builtin(global_invocation_id) id: vec3<u32>) {
        let i = id.x;
        if (i >= params.count) {
          return;
        }
        let amp = amplitudes[i];
        probabilities[i] = amp.x * amp.x + amp.y * amp.y;
      }
    `}),r=e.createComputePipeline({label:"schrodinger-probability-density-pipeline",layout:"auto",compute:{module:i,entryPoint:"main"}}),s=e.createBuffer({label:"schrodinger-amplitudes",size:n.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),a=e.createBuffer({label:"schrodinger-probabilities",size:t*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),o=new Uint32Array([t,0,0,0]),c=e.createBuffer({label:"schrodinger-probability-params",size:o.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=e.createBuffer({label:"schrodinger-probability-readback",size:t*4,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});e.queue.writeBuffer(s,0,n),e.queue.writeBuffer(c,0,o);const u=e.createBindGroup({layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:{buffer:a}},{binding:2,resource:{buffer:c}}]}),d=e.createCommandEncoder(),f=d.beginComputePass({label:"schrodinger-probability-pass"});f.setPipeline(r),f.setBindGroup(0,u),f.dispatchWorkgroups(Math.max(1,Math.ceil(t/128))),f.end(),d.copyBufferToBuffer(a,0,l,0,t*4),e.queue.submit([d.finish()]),await l.mapAsync(GPUMapMode.READ);const p=new Float32Array(l.getMappedRange().slice(0));return l.unmap(),s.destroy(),a.destroy(),c.destroy(),l.destroy(),p},gu=async()=>{const n=new Float32Array([Math.SQRT1_2,0,0,0,.5,.5,0,0]),e=await mu(n),t=e.reduce((i,r)=>i+r,0);return{probabilities:e,total:t,ok:Math.abs(t-1)<1e-4&&Math.abs(e[0]-.5)<1e-4}},_u="modulepreload",vu=function(n,e){return new URL(n,e).href},yo={},xu=function(e,t,i){let r=Promise.resolve();if(t&&t.length>0){let a=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));r=a(t.map(u=>{if(u=vu(u,i),u in yo)return;yo[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(!!i)for(let v=o.length-1;v>=0;v--){const m=o[v];if(m.href===u&&(!d||m.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const _=document.createElement("link");if(_.rel=d?"stylesheet":_u,d||(_.as="script"),_.crossOrigin="",_.href=u,l&&_.setAttribute("nonce",l),document.head.appendChild(_),d)return new Promise((v,m)=>{_.addEventListener("load",v),_.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return e().catch(s)})},Mu="peercompute.multiscale.closure-state.v0",bu="peercompute.multiscale.closure-result.v0";function we(n,e=null){const t=Number(n);return Number.isFinite(t)?t:e}function Ft(n){return JSON.parse(JSON.stringify(n))}function ki(n){return Object.fromEntries(Object.entries(n).filter(([,e])=>e!==void 0).map(([e,t])=>[e,t&&typeof t=="object"?Ft(t):t]))}function Su({layerId:n="unknown",materialId:e="unknown",solverId:t="unknown",stateKey:i="unknown",sequence:r=0,environment:s={},primitive:a={},conserved:o={},species:c={},phaseFractions:l={},fields:u={},validity:d={}}={}){return{schema:Mu,layerId:n,materialId:e,solverId:t,stateKey:i,sequence:we(r,0),environment:Ft(s),primitive:Ft(a),conserved:Ft(o),species:Ft(c),phaseFractions:Ft(l),fields:Ft(u),validity:Ft(d)}}function yu({modelId:n="unknown-closure-model",source:e={},state:t=null,thermodynamics:i={},transport:r={},mechanics:s={},electromagnetics:a={},statistical:o={},chemistry:c={},phase:l={},diagnostics:u={},validity:d={},uncertainty:f={},conservation:p={},provenance:_={}}={}){return{schema:bu,modelId:n,source:Ft(e),state:t?Ft(t):null,thermodynamics:ki({temperatureK:we(i.temperatureK),pressurePa:we(i.pressurePa),densityKgM3:we(i.densityKgM3),heatSourceWm3:we(i.heatSourceWm3),soundSpeedMps:we(i.soundSpeedMps),specificInternalEnergyJkg:we(i.specificInternalEnergyJkg),heatCapacityJkgK:we(i.heatCapacityJkgK),latentHeatJkg:we(i.latentHeatJkg),specificEnthalpyProxy:we(i.specificEnthalpyProxy),specificFreeEnergyProxy:we(i.specificFreeEnergyProxy),specificInternalEnergyProxy:we(i.specificInternalEnergyProxy),entropyProxy:we(i.entropyProxy),phaseEnergyRateProxy:we(i.phaseEnergyRateProxy),phaseStabilityResidualProxy:we(i.phaseStabilityResidualProxy),sourceTemperatureDeltaKProxy:we(i.sourceTemperatureDeltaKProxy),latentHeatBudgetProxy:we(i.latentHeatBudgetProxy),latentHeatSinkProxy:we(i.latentHeatSinkProxy),latentHeatReleaseProxy:we(i.latentHeatReleaseProxy)}),transport:ki({thermalConductivityWmK:we(r.thermalConductivityWmK),electricalConductivitySm:we(r.electricalConductivitySm),viscosityPaS:we(r.viscosityPaS),diffusivityM2s:we(r.diffusivityM2s)}),mechanics:ki({bulkModulusPa:we(s.bulkModulusPa),shearModulusPa:we(s.shearModulusPa),youngsModulusPa:we(s.youngsModulusPa),yieldStrengthPa:we(s.yieldStrengthPa),surfaceTensionNpm:we(s.surfaceTensionNpm),damage:we(s.damage)}),electromagnetics:ki({chargeDensityCm3:we(a.chargeDensityCm3),conductivitySm:we(a.conductivitySm),dielectricConstant:we(a.dielectricConstant),magneticSusceptibility:we(a.magneticSusceptibility),permittivity:we(a.permittivity),permeability:we(a.permeability)}),statistical:ki({schema:o.schema,ensembleSchema:o.ensembleSchema,modelId:o.modelId,status:o.status,backend:o.backend,calibrated:o.calibrated,firstPrinciplesUniversal:o.firstPrinciplesUniversal,acceptableClosureIfLabeled:o.acceptableClosureIfLabeled,recordCount:we(o.recordCount),temperatureK:we(o.temperatureK),pressurePa:we(o.pressurePa),ensemblePressurePa:we(o.ensemblePressurePa),pressureRatio:we(o.pressureRatio),betaEv:we(o.betaEv),partitionFunction:we(o.partitionFunction),partitionFunctionLog:we(o.partitionFunctionLog),groundStatePopulation:we(o.groundStatePopulation),excitedStatePopulation:we(o.excitedStatePopulation),continuumPopulation:we(o.continuumPopulation),ionizationFraction:we(o.ionizationFraction),meanExcitationEnergyEv:we(o.meanExcitationEnergyEv),heatCapacityProxy:we(o.heatCapacityProxy),opacityProxy:we(o.opacityProxy),degeneracyParameter:we(o.degeneracyParameter),degeneracyRegime:o.degeneracyRegime,distribution:o.distribution,hamiltonian:o.hamiltonian,sourceEquation:o.sourceEquation,sourceTerms:o.sourceTerms,closureOutputs:o.closureOutputs,populations:o.populations,validity:o.validity}),chemistry:Ft(c),phase:Ft(l),diagnostics:Ft(u),validity:{status:d.status||"interactive-proxy",regimes:Array.isArray(d.regimes)?[...d.regimes]:[],bounds:Ft(d.bounds||{}),warnings:Array.isArray(d.warnings)?[...d.warnings]:[]},uncertainty:{mode:f.mode||"unvalidated-proxy",confidence:we(f.confidence,0),value:we(f.value,null)},conservation:Ft(p),provenance:{source:_.source||"runtime-reduced-model",references:Array.isArray(_.references)?[..._.references]:[],codeHash:_.codeHash||null,inputHash:_.inputHash||null}}}function Eu(n={},{layerId:e="molecular",solverId:t="schrodinger-materials",stateKey:i=null,environment:r={},conservation:s={}}={}){var u,d,f,p,_,v,m,h,E,T,y,w,A,R,O,x;const a=n.state||{},o=n.validation||{},c=(u=n.electromagnetic)==null?void 0:u.electricalConductivitySpm,l=Su({layerId:e,materialId:n.materialId||"unknown-material",solverId:t,stateKey:i||`material:${n.sampleId||n.materialId||"unknown"}`,sequence:n.timestamp||0,environment:r,primitive:{temperatureK:a.temperatureK,pressurePa:a.pressurePa,phase:a.phase,densityKgM3:a.densityKgM3},species:a.composition||{},phaseFractions:a.phase?{[a.phase]:1}:{},validity:{modelTier:n.modelTier,status:o.status,referenceSet:o.referenceSet}});return yu({modelId:n.modelTier||"schrodinger-material-packet-v0",source:{solverId:t,stateKey:l.stateKey,backend:"schrodinger-material-packet",sequence:n.timestamp||0,materialId:n.materialId||null,sampleId:n.sampleId||null},state:l,thermodynamics:{temperatureK:a.temperatureK,pressurePa:a.pressurePa,densityKgM3:a.densityKgM3,heatCapacityJkgK:(d=n.thermal)==null?void 0:d.heatCapacityJkgK,latentHeatJkg:(f=n.thermal)==null?void 0:f.latentHeatJkg},transport:{thermalConductivityWmK:(p=n.thermal)==null?void 0:p.thermalConductivityWmK,electricalConductivitySm:c,viscosityPaS:(_=n.mechanics)==null?void 0:_.viscosityPaS},mechanics:{bulkModulusPa:(v=n.mechanics)==null?void 0:v.bulkModulusPa,youngsModulusPa:(m=n.mechanics)==null?void 0:m.youngsModulusPa,shearModulusPa:(h=n.mechanics)==null?void 0:h.shearModulusPa,surfaceTensionNpm:(E=n.mechanics)==null?void 0:E.surfaceTensionNpm},electromagnetics:{conductivitySm:c,dielectricConstant:(T=n.electromagnetic)==null?void 0:T.dielectricConstant,magneticSusceptibility:(y=n.electromagnetic)==null?void 0:y.magneticSusceptibility},chemistry:{reactionRates:((w=n.chemical)==null?void 0:w.reactionRates)||{},bondEvents:((A=n.chemical)==null?void 0:A.bondEvents)||[],ph:((R=n.chemical)==null?void 0:R.ph)??null,ionFractions:((O=n.chemical)==null?void 0:O.ionFractions)||{}},phase:{phase:a.phase,phaseFractions:a.phase?{[a.phase]:1}:{},eosParams:((x=n.thermal)==null?void 0:x.eosParams)||{}},diagnostics:{optical:n.optical||{},nuclear:n.nuclear||{},timestamp:n.timestamp,validUntil:n.validUntil},validity:{status:o.status||"approximate",regimes:[e],bounds:o.tolerances||{},warnings:o.warnings||[]},uncertainty:{mode:o.status==="validated"?"reference-data":"reference-fit-or-table",confidence:o.status==="validated"?.85:.42},conservation:s,provenance:{source:"demos/schrodinger/src/materials/propertyPacket.js",references:o.referenceSet?[o.referenceSet]:[]}})}const Hi=async n=>{try{const e=await fetch(n,{cache:"no-store"});if(e.ok)return await e.json()}catch{}return null},Tu=async()=>{const n=new URLSearchParams(window.location.search),e=n.get("relayConfigUrl")||n.get("relayConfig")||"";if(e){const r=await Hi(e);if(r)return r}const t=await Hi("./relay-config-source.json")||await Hi("./.relay-config-source.json"),i=typeof(t==null?void 0:t.relayConfigUrl)=="string"?t.relayConfigUrl.trim():"";if(i){const r=await Hi(i);if(r)return r}return await Hi("./relay-config.json")||{bootstrapPeers:[]}},Au=async({onStatus:n}={})=>{const{NodeKernel:e}=await xu(async()=>{const{NodeKernel:a}=await import("./index-Cl44_Tou.js");return{NodeKernel:a}},[],import.meta.url),t=await Tu(),i=new e({bootstrapPeers:Array.isArray(t.bootstrapPeers)?t.bootstrapPeers:[],enablePersistence:!1,enableWebGPU:!0,enableWorkers:!0,gameId:"schrodinger",roomId:"materials",topologyId:"schrodinger-materials",topology:"distributed",stateTopic:"pc.schrodinger.materials.state",...t.pubsubType?{pubsubType:t.pubsubType}:{},...t.gossipsub?{gossipsub:t.gossipsub}:{},...t.webrtc?{webrtc:t.webrtc}:{}});n==null||n("initializing"),await i.initialize(),n==null||n("starting"),await i.start();const r=i.getStateManager(),s=a=>{r.commitDelta({taskId:`schrodinger:${a.sampleId}`,scope:"materials",version:a.timestamp,payload:a,timestamp:Date.now()}),r.commitDelta({taskId:`closure:${a.sampleId}`,scope:"multiscale-closures",version:a.timestamp,payload:Eu(a,{layerId:"molecular",solverId:"schrodinger-materials",stateKey:`schrodinger:${a.sampleId}`}),timestamp:Date.now()})};return n==null||n("attached"),{node:i,stateManager:r,publishPacket:s,getStatus:()=>i.getStatus(),stop:()=>i.stop()}};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ja="182",Di={ROTATE:0,DOLLY:1,PAN:2},Ri={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},wu=0,Eo=1,Cu=2,kr=1,Ru=2,Qi=3,Hn=0,kt=1,yn=2,Tn=0,Li=1,To=2,Ao=3,wo=4,Pu=5,Jn=100,Du=101,Lu=102,Iu=103,Uu=104,Nu=200,Fu=201,Ou=202,Bu=203,$s=204,Zs=205,zu=206,Gu=207,ku=208,Hu=209,Vu=210,Wu=211,Xu=212,qu=213,Ku=214,js=0,Js=1,Qs=2,Ui=3,ea=4,ta=5,na=6,ia=7,Hl=0,Yu=1,$u=2,hn=0,Vl=1,Wl=2,Xl=3,ql=4,Kl=5,Yl=6,$l=7,Zl=300,oi=301,Ni=302,ra=303,sa=304,ts=306,aa=1e3,En=1001,oa=1002,At=1003,Zu=1004,gr=1005,Rt=1006,hs=1007,ii=1008,Kt=1009,jl=1010,Jl=1011,ir=1012,Qa=1013,pn=1014,un=1015,wn=1016,eo=1017,to=1018,rr=1020,Ql=35902,ec=35899,tc=1021,nc=1022,an=1023,Cn=1026,ri=1027,ic=1028,no=1029,Fi=1030,io=1031,ro=1033,Hr=33776,Vr=33777,Wr=33778,Xr=33779,la=35840,ca=35841,ua=35842,da=35843,ha=36196,fa=37492,pa=37496,ma=37488,ga=37489,_a=37490,va=37491,xa=37808,Ma=37809,ba=37810,Sa=37811,ya=37812,Ea=37813,Ta=37814,Aa=37815,wa=37816,Ca=37817,Ra=37818,Pa=37819,Da=37820,La=37821,Ia=36492,Ua=36494,Na=36495,Fa=36283,Oa=36284,Ba=36285,za=36286,ju=3200,rc=0,Ju=1,On="",Zt="srgb",Oi="srgb-linear",$r="linear",it="srgb",pi=7680,Co=519,Qu=512,ed=513,td=514,so=515,nd=516,id=517,ao=518,rd=519,Ro=35044,Po="300 es",dn=2e3,Zr=2001;function sc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function jr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sd(){const n=jr("canvas");return n.style.display="block",n}const Do={};function Lo(...n){const e="THREE."+n.shift();console.log(e,...n)}function Le(...n){const e="THREE."+n.shift();console.warn(e,...n)}function Je(...n){const e="THREE."+n.shift();console.error(e,...n)}function sr(...n){const e=n.join(" ");e in Do||(Do[e]=!0,Le(...n))}function ad(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}class ci{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],qr=Math.PI/180,Ga=180/Math.PI;function or(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(wt[n&255]+wt[n>>8&255]+wt[n>>16&255]+wt[n>>24&255]+"-"+wt[e&255]+wt[e>>8&255]+"-"+wt[e>>16&15|64]+wt[e>>24&255]+"-"+wt[t&63|128]+wt[t>>8&255]+"-"+wt[t>>16&255]+wt[t>>24&255]+wt[i&255]+wt[i>>8&255]+wt[i>>16&255]+wt[i>>24&255]).toLowerCase()}function Ve(n,e,t){return Math.max(e,Math.min(t,n))}function od(n,e){return(n%e+e)%e}function fs(n,e,t){return(1-t)*n+t*e}function Vi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function zt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ld={DEG2RAD:qr};class Ne{constructor(e=0,t=0){Ne.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class li{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let c=i[r+0],l=i[r+1],u=i[r+2],d=i[r+3],f=s[a+0],p=s[a+1],_=s[a+2],v=s[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d;return}if(o>=1){e[t+0]=f,e[t+1]=p,e[t+2]=_,e[t+3]=v;return}if(d!==v||c!==f||l!==p||u!==_){let m=c*f+l*p+u*_+d*v;m<0&&(f=-f,p=-p,_=-_,v=-v,m=-m);let h=1-o;if(m<.9995){const E=Math.acos(m),T=Math.sin(E);h=Math.sin(h*E)/T,o=Math.sin(o*E)/T,c=c*h+f*o,l=l*h+p*o,u=u*h+_*o,d=d*h+v*o}else{c=c*h+f*o,l=l*h+p*o,u=u*h+_*o,d=d*h+v*o;const E=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=E,l*=E,u*=E,d*=E}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],c=i[r+1],l=i[r+2],u=i[r+3],d=s[a],f=s[a+1],p=s[a+2],_=s[a+3];return e[t]=o*_+u*d+c*p-l*f,e[t+1]=c*_+u*f+l*d-o*p,e[t+2]=l*_+u*p+o*f-c*d,e[t+3]=u*_-o*d-c*f-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(i/2),u=o(r/2),d=o(s/2),f=c(i/2),p=c(r/2),_=c(s/2);switch(a){case"XYZ":this._x=f*u*d+l*p*_,this._y=l*p*d-f*u*_,this._z=l*u*_+f*p*d,this._w=l*u*d-f*p*_;break;case"YXZ":this._x=f*u*d+l*p*_,this._y=l*p*d-f*u*_,this._z=l*u*_-f*p*d,this._w=l*u*d+f*p*_;break;case"ZXY":this._x=f*u*d-l*p*_,this._y=l*p*d+f*u*_,this._z=l*u*_+f*p*d,this._w=l*u*d-f*p*_;break;case"ZYX":this._x=f*u*d-l*p*_,this._y=l*p*d+f*u*_,this._z=l*u*_-f*p*d,this._w=l*u*d+f*p*_;break;case"YZX":this._x=f*u*d+l*p*_,this._y=l*p*d+f*u*_,this._z=l*u*_-f*p*d,this._w=l*u*d-f*p*_;break;case"XZY":this._x=f*u*d-l*p*_,this._y=l*p*d-f*u*_,this._z=l*u*_+f*p*d,this._w=l*u*d+f*p*_;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],f=i+o+d;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-c)*p,this._y=(s-l)*p,this._z=(a-r)*p}else if(i>o&&i>d){const p=2*Math.sqrt(1+i-o-d);this._w=(u-c)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+l)/p}else if(o>d){const p=2*Math.sqrt(1+o-i-d);this._w=(s-l)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(c+u)/p}else{const p=2*Math.sqrt(1+d-i-o);this._w=(a-r)/p,this._x=(s+l)/p,this._y=(c+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=i*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-i*l,this._z=s*u+a*l+i*c-r*o,this._w=a*u-i*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),u=Math.sin(l);c=Math.sin(c*l)/u,t=Math.sin(t*l)/u,this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+i*t,this._y=this._y*c+r*t,this._z=this._z*c+s*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,i=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Io.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Io.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*i),u=2*(o*t-s*r),d=2*(s*i-a*t);return this.x=t+c*l+a*d-o*u,this.y=i+c*u+o*l-s*d,this.z=r+c*d+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ps.copy(this).projectOnVector(e),this.sub(ps)}reflect(e){return this.sub(ps.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ps=new N,Io=new li;class Be{constructor(e,t,i,r,s,a,o,c,l){Be.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l)}set(e,t,i,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=i,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],c=i[6],l=i[1],u=i[4],d=i[7],f=i[2],p=i[5],_=i[8],v=r[0],m=r[3],h=r[6],E=r[1],T=r[4],y=r[7],w=r[2],A=r[5],R=r[8];return s[0]=a*v+o*E+c*w,s[3]=a*m+o*T+c*A,s[6]=a*h+o*y+c*R,s[1]=l*v+u*E+d*w,s[4]=l*m+u*T+d*A,s[7]=l*h+u*y+d*R,s[2]=f*v+p*E+_*w,s[5]=f*m+p*T+_*A,s[8]=f*h+p*y+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-i*s*u+i*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,f=o*c-u*s,p=l*s-a*c,_=t*d+i*f+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=d*v,e[1]=(r*l-u*i)*v,e[2]=(o*i-r*a)*v,e[3]=f*v,e[4]=(u*t-r*c)*v,e[5]=(r*s-o*t)*v,e[6]=p*v,e[7]=(i*c-l*t)*v,e[8]=(a*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ms.makeScale(e,t)),this}rotate(e){return this.premultiply(ms.makeRotation(-e)),this}translate(e,t){return this.premultiply(ms.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ms=new Be,Uo=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),No=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function cd(){const n={enabled:!0,workingColorSpace:Oi,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===it&&(r.r=An(r.r),r.g=An(r.g),r.b=An(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===it&&(r.r=Ii(r.r),r.g=Ii(r.g),r.b=Ii(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===On?$r:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return sr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return sr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Oi]:{primaries:e,whitePoint:i,transfer:$r,toXYZ:Uo,fromXYZ:No,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Zt},outputColorSpaceConfig:{drawingBufferColorSpace:Zt}},[Zt]:{primaries:e,whitePoint:i,transfer:it,toXYZ:Uo,fromXYZ:No,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Zt}}}),n}const Ze=cd();function An(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ii(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let mi;class ud{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{mi===void 0&&(mi=jr("canvas")),mi.width=e.width,mi.height=e.height;const r=mi.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=mi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=jr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=An(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(An(t[i]/255)*255):t[i]=An(t[i]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let dd=0;class oo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=or(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(gs(r[a].image)):s.push(gs(r[a]))}else s=gs(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function gs(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ud.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let hd=0;const _s=new N;class Pt extends ci{constructor(e=Pt.DEFAULT_IMAGE,t=Pt.DEFAULT_MAPPING,i=En,r=En,s=Rt,a=ii,o=an,c=Kt,l=Pt.DEFAULT_ANISOTROPY,u=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=or(),this.name="",this.source=new oo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(_s).x}get height(){return this.source.getSize(_s).y}get depth(){return this.source.getSize(_s).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case aa:e.x=e.x-Math.floor(e.x);break;case En:e.x=e.x<0?0:1;break;case oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case aa:e.y=e.y-Math.floor(e.y);break;case En:e.y=e.y<0?0:1;break;case oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=Zl;Pt.DEFAULT_ANISOTROPY=1;class mt{constructor(e=0,t=0,i=0,r=1){mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const c=e.elements,l=c[0],u=c[4],d=c[8],f=c[1],p=c[5],_=c[9],v=c[2],m=c[6],h=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+v)<.1&&Math.abs(_+m)<.1&&Math.abs(l+p+h-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(l+1)/2,y=(p+1)/2,w=(h+1)/2,A=(u+f)/4,R=(d+v)/4,O=(_+m)/4;return T>y&&T>w?T<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(T),r=A/i,s=R/i):y>w?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=A/r,s=O/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=R/s,r=O/s),this.set(i,r,s,t),this}let E=Math.sqrt((m-_)*(m-_)+(d-v)*(d-v)+(f-u)*(f-u));return Math.abs(E)<.001&&(E=1),this.x=(m-_)/E,this.y=(d-v)/E,this.z=(f-u)/E,this.w=Math.acos((l+p+h-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class fd extends ci{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Pt(r);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Rt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new oo(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fn extends fd{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class ac extends Pt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=At,this.minFilter=At,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class pd extends Pt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=At,this.minFilter=At,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lr{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Qt):Qt.fromBufferAttribute(s,a),Qt.applyMatrix4(e.matrixWorld),this.expandByPoint(Qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_r.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),_r.copy(i.boundingBox)),_r.applyMatrix4(e.matrixWorld),this.union(_r)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Qt),Qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wi),vr.subVectors(this.max,Wi),gi.subVectors(e.a,Wi),_i.subVectors(e.b,Wi),vi.subVectors(e.c,Wi),Pn.subVectors(_i,gi),Dn.subVectors(vi,_i),qn.subVectors(gi,vi);let t=[0,-Pn.z,Pn.y,0,-Dn.z,Dn.y,0,-qn.z,qn.y,Pn.z,0,-Pn.x,Dn.z,0,-Dn.x,qn.z,0,-qn.x,-Pn.y,Pn.x,0,-Dn.y,Dn.x,0,-qn.y,qn.x,0];return!vs(t,gi,_i,vi,vr)||(t=[1,0,0,0,1,0,0,0,1],!vs(t,gi,_i,vi,vr))?!1:(xr.crossVectors(Pn,Dn),t=[xr.x,xr.y,xr.z],vs(t,gi,_i,vi,vr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const vn=[new N,new N,new N,new N,new N,new N,new N,new N],Qt=new N,_r=new lr,gi=new N,_i=new N,vi=new N,Pn=new N,Dn=new N,qn=new N,Wi=new N,vr=new N,xr=new N,Kn=new N;function vs(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Kn.fromArray(n,s);const o=r.x*Math.abs(Kn.x)+r.y*Math.abs(Kn.y)+r.z*Math.abs(Kn.z),c=e.dot(Kn),l=t.dot(Kn),u=i.dot(Kn);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const md=new lr,Xi=new N,xs=new N;class cr{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):md.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Xi.subVectors(e,this.center);const t=Xi.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Xi,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Xi.copy(e.center).add(xs)),this.expandByPoint(Xi.copy(e.center).sub(xs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const xn=new N,Ms=new N,Mr=new N,Ln=new N,bs=new N,br=new N,Ss=new N;class ns{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=xn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xn.copy(this.origin).addScaledVector(this.direction,t),xn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Ms.copy(e).add(t).multiplyScalar(.5),Mr.copy(t).sub(e).normalize(),Ln.copy(this.origin).sub(Ms);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Mr),o=Ln.dot(this.direction),c=-Ln.dot(Mr),l=Ln.lengthSq(),u=Math.abs(1-a*a);let d,f,p,_;if(u>0)if(d=a*c-o,f=a*o-c,_=s*u,d>=0)if(f>=-_)if(f<=_){const v=1/u;d*=v,f*=v,p=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=s,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*c)+l;else f<=-_?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-c),s),p=-d*d+f*(f+2*c)+l):f<=_?(d=0,f=Math.min(Math.max(-s,-c),s),p=f*(f+2*c)+l):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-c),s),p=-d*d+f*(f+2*c)+l);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),p=-d*d+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Ms).addScaledVector(Mr,f),p}intersectSphere(e,t){xn.subVectors(e.center,this.origin);const i=xn.dot(this.direction),r=xn.dot(xn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(i=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(i=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,xn)!==null}intersectTriangle(e,t,i,r,s){bs.subVectors(t,e),br.subVectors(i,e),Ss.crossVectors(bs,br);let a=this.direction.dot(Ss),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ln.subVectors(this.origin,e);const c=o*this.direction.dot(br.crossVectors(Ln,br));if(c<0)return null;const l=o*this.direction.dot(bs.cross(Ln));if(l<0||c+l>a)return null;const u=-o*Ln.dot(Ss);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,t,i,r,s,a,o,c,l,u,d,f,p,_,v,m){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,c,l,u,d,f,p,_,v,m)}set(e,t,i,r,s,a,o,c,l,u,d,f,p,_,v,m){const h=this.elements;return h[0]=e,h[4]=t,h[8]=i,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=c,h[2]=l,h[6]=u,h[10]=d,h[14]=f,h[3]=p,h[7]=_,h[11]=v,h[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,r=1/xi.setFromMatrixColumn(e,0).length(),s=1/xi.setFromMatrixColumn(e,1).length(),a=1/xi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,p=a*d,_=o*u,v=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=p+_*l,t[5]=f-v*l,t[9]=-o*c,t[2]=v-f*l,t[6]=_+p*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*u,p=c*d,_=l*u,v=l*d;t[0]=f+v*o,t[4]=_*o-p,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=p*o-_,t[6]=v+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*u,p=c*d,_=l*u,v=l*d;t[0]=f-v*o,t[4]=-a*d,t[8]=_+p*o,t[1]=p+_*o,t[5]=a*u,t[9]=v-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*u,p=a*d,_=o*u,v=o*d;t[0]=c*u,t[4]=_*l-p,t[8]=f*l+v,t[1]=c*d,t[5]=v*l+f,t[9]=p*l-_,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,p=a*l,_=o*c,v=o*l;t[0]=c*u,t[4]=v-f*d,t[8]=_*d+p,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=p*d+_,t[10]=f-v*d}else if(e.order==="XZY"){const f=a*c,p=a*l,_=o*c,v=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=f*d+v,t[5]=a*u,t[9]=p*d-_,t[2]=_*d-p,t[6]=o*u,t[10]=v*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(gd,e,_d)}lookAt(e,t,i){const r=this.elements;return Wt.subVectors(e,t),Wt.lengthSq()===0&&(Wt.z=1),Wt.normalize(),In.crossVectors(i,Wt),In.lengthSq()===0&&(Math.abs(i.z)===1?Wt.x+=1e-4:Wt.z+=1e-4,Wt.normalize(),In.crossVectors(i,Wt)),In.normalize(),Sr.crossVectors(Wt,In),r[0]=In.x,r[4]=Sr.x,r[8]=Wt.x,r[1]=In.y,r[5]=Sr.y,r[9]=Wt.y,r[2]=In.z,r[6]=Sr.z,r[10]=Wt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],c=i[8],l=i[12],u=i[1],d=i[5],f=i[9],p=i[13],_=i[2],v=i[6],m=i[10],h=i[14],E=i[3],T=i[7],y=i[11],w=i[15],A=r[0],R=r[4],O=r[8],x=r[12],b=r[1],P=r[5],F=r[9],U=r[13],V=r[2],q=r[6],k=r[10],W=r[14],$=r[3],ie=r[7],ee=r[11],he=r[15];return s[0]=a*A+o*b+c*V+l*$,s[4]=a*R+o*P+c*q+l*ie,s[8]=a*O+o*F+c*k+l*ee,s[12]=a*x+o*U+c*W+l*he,s[1]=u*A+d*b+f*V+p*$,s[5]=u*R+d*P+f*q+p*ie,s[9]=u*O+d*F+f*k+p*ee,s[13]=u*x+d*U+f*W+p*he,s[2]=_*A+v*b+m*V+h*$,s[6]=_*R+v*P+m*q+h*ie,s[10]=_*O+v*F+m*k+h*ee,s[14]=_*x+v*U+m*W+h*he,s[3]=E*A+T*b+y*V+w*$,s[7]=E*R+T*P+y*q+w*ie,s[11]=E*O+T*F+y*k+w*ee,s[15]=E*x+T*U+y*W+w*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],f=e[10],p=e[14],_=e[3],v=e[7],m=e[11],h=e[15],E=c*p-l*f,T=o*p-l*d,y=o*f-c*d,w=a*p-l*u,A=a*f-c*u,R=a*d-o*u;return t*(v*E-m*T+h*y)-i*(_*E-m*w+h*A)+r*(_*T-v*w+h*R)-s*(_*y-v*A+m*R)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],p=e[11],_=e[12],v=e[13],m=e[14],h=e[15],E=d*m*l-v*f*l+v*c*p-o*m*p-d*c*h+o*f*h,T=_*f*l-u*m*l-_*c*p+a*m*p+u*c*h-a*f*h,y=u*v*l-_*d*l+_*o*p-a*v*p-u*o*h+a*d*h,w=_*d*c-u*v*c-_*o*f+a*v*f+u*o*m-a*d*m,A=t*E+i*T+r*y+s*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return e[0]=E*R,e[1]=(v*f*s-d*m*s-v*r*p+i*m*p+d*r*h-i*f*h)*R,e[2]=(o*m*s-v*c*s+v*r*l-i*m*l-o*r*h+i*c*h)*R,e[3]=(d*c*s-o*f*s-d*r*l+i*f*l+o*r*p-i*c*p)*R,e[4]=T*R,e[5]=(u*m*s-_*f*s+_*r*p-t*m*p-u*r*h+t*f*h)*R,e[6]=(_*c*s-a*m*s-_*r*l+t*m*l+a*r*h-t*c*h)*R,e[7]=(a*f*s-u*c*s+u*r*l-t*f*l-a*r*p+t*c*p)*R,e[8]=y*R,e[9]=(_*d*s-u*v*s-_*i*p+t*v*p+u*i*h-t*d*h)*R,e[10]=(a*v*s-_*o*s+_*i*l-t*v*l-a*i*h+t*o*h)*R,e[11]=(u*o*s-a*d*s-u*i*l+t*d*l+a*i*p-t*o*p)*R,e[12]=w*R,e[13]=(u*v*r-_*d*r+_*i*f-t*v*f-u*i*m+t*d*m)*R,e[14]=(_*o*r-a*v*r-_*i*c+t*v*c+a*i*m-t*o*m)*R,e[15]=(a*d*r-u*o*r+u*i*c-t*d*c-a*i*f+t*o*f)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+i,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+i,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,d=o+o,f=s*l,p=s*u,_=s*d,v=a*u,m=a*d,h=o*d,E=c*l,T=c*u,y=c*d,w=i.x,A=i.y,R=i.z;return r[0]=(1-(v+h))*w,r[1]=(p+y)*w,r[2]=(_-T)*w,r[3]=0,r[4]=(p-y)*A,r[5]=(1-(f+h))*A,r[6]=(m+E)*A,r[7]=0,r[8]=(_+T)*R,r[9]=(m-E)*R,r[10]=(1-(f+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;if(e.x=r[12],e.y=r[13],e.z=r[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let s=xi.set(r[0],r[1],r[2]).length();const a=xi.set(r[4],r[5],r[6]).length(),o=xi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),en.copy(this);const l=1/s,u=1/a,d=1/o;return en.elements[0]*=l,en.elements[1]*=l,en.elements[2]*=l,en.elements[4]*=u,en.elements[5]*=u,en.elements[6]*=u,en.elements[8]*=d,en.elements[9]*=d,en.elements[10]*=d,t.setFromRotationMatrix(en),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=dn,c=!1){const l=this.elements,u=2*s/(t-e),d=2*s/(i-r),f=(t+e)/(t-e),p=(i+r)/(i-r);let _,v;if(c)_=s/(a-s),v=a*s/(a-s);else if(o===dn)_=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===Zr)_=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=dn,c=!1){const l=this.elements,u=2/(t-e),d=2/(i-r),f=-(t+e)/(t-e),p=-(i+r)/(i-r);let _,v;if(c)_=1/(a-s),v=a/(a-s);else if(o===dn)_=-2/(a-s),v=-(a+s)/(a-s);else if(o===Zr)_=-1/(a-s),v=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=u,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=_,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const xi=new N,en=new ht,gd=new N(0,0,0),_d=new N(1,1,1),In=new N,Sr=new N,Wt=new N,Fo=new ht,Oo=new li;class mn{constructor(e=0,t=0,i=0,r=mn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],d=r[2],f=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ve(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ve(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Fo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fo,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Oo.setFromEuler(this),this.setFromQuaternion(Oo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}mn.DEFAULT_ORDER="XYZ";class oc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let vd=0;const Bo=new N,Mi=new li,Mn=new ht,yr=new N,qi=new N,xd=new N,Md=new li,zo=new N(1,0,0),Go=new N(0,1,0),ko=new N(0,0,1),Ho={type:"added"},bd={type:"removed"},bi={type:"childadded",child:null},ys={type:"childremoved",child:null};class Tt extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=or(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new N,t=new mn,i=new li,r=new N(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ht},normalMatrix:{value:new Be}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new oc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(zo,e)}rotateY(e){return this.rotateOnAxis(Go,e)}rotateZ(e){return this.rotateOnAxis(ko,e)}translateOnAxis(e,t){return Bo.copy(e).applyQuaternion(this.quaternion),this.position.add(Bo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(zo,e)}translateY(e){return this.translateOnAxis(Go,e)}translateZ(e){return this.translateOnAxis(ko,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?yr.copy(e):yr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(qi,yr,this.up):Mn.lookAt(yr,qi,this.up),this.quaternion.setFromRotationMatrix(Mn),r&&(Mn.extractRotation(r.matrixWorld),Mi.setFromRotationMatrix(Mn),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ho),bi.child=e,this.dispatchEvent(bi),bi.child=null):Je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bd),ys.child=e,this.dispatchEvent(ys),ys.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ho),bi.child=e,this.dispatchEvent(bi),bi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,e,xd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,Md,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),p=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Tt.DEFAULT_UP=new N(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new N,bn=new N,Es=new N,Sn=new N,Si=new N,yi=new N,Vo=new N,Ts=new N,As=new N,ws=new N,Cs=new mt,Rs=new mt,Ps=new mt;class sn{constructor(e=new N,t=new N,i=new N){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),tn.subVectors(e,t),r.cross(tn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){tn.subVectors(r,t),bn.subVectors(i,t),Es.subVectors(e,t);const a=tn.dot(tn),o=tn.dot(bn),c=tn.dot(Es),l=bn.dot(bn),u=bn.dot(Es),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,p=(l*c-o*u)*f,_=(a*u-o*c)*f;return s.set(1-p-_,_,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getInterpolation(e,t,i,r,s,a,o,c){return this.getBarycoord(e,t,i,r,Sn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Sn.x),c.addScaledVector(a,Sn.y),c.addScaledVector(o,Sn.z),c)}static getInterpolatedAttribute(e,t,i,r,s,a){return Cs.setScalar(0),Rs.setScalar(0),Ps.setScalar(0),Cs.fromBufferAttribute(e,t),Rs.fromBufferAttribute(e,i),Ps.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Cs,s.x),a.addScaledVector(Rs,s.y),a.addScaledVector(Ps,s.z),a}static isFrontFacing(e,t,i,r){return tn.subVectors(i,t),bn.subVectors(e,t),tn.cross(bn).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return tn.subVectors(this.c,this.b),bn.subVectors(this.a,this.b),tn.cross(bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return sn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return sn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return sn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return sn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return sn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Si.subVectors(r,i),yi.subVectors(s,i),Ts.subVectors(e,i);const c=Si.dot(Ts),l=yi.dot(Ts);if(c<=0&&l<=0)return t.copy(i);As.subVectors(e,r);const u=Si.dot(As),d=yi.dot(As);if(u>=0&&d<=u)return t.copy(r);const f=c*d-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(i).addScaledVector(Si,a);ws.subVectors(e,s);const p=Si.dot(ws),_=yi.dot(ws);if(_>=0&&p<=_)return t.copy(s);const v=p*l-c*_;if(v<=0&&l>=0&&_<=0)return o=l/(l-_),t.copy(i).addScaledVector(yi,o);const m=u*_-p*d;if(m<=0&&d-u>=0&&p-_>=0)return Vo.subVectors(s,r),o=(d-u)/(d-u+(p-_)),t.copy(r).addScaledVector(Vo,o);const h=1/(m+v+f);return a=v*h,o=f*h,t.copy(i).addScaledVector(Si,a).addScaledVector(yi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const lc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Er={h:0,s:0,l:0};function Ds(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Xe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ze.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Ze.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ze.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Ze.workingColorSpace){if(e=od(e,1),t=Ve(t,0,1),i=Ve(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Ds(a,s,e+1/3),this.g=Ds(a,s,e),this.b=Ds(a,s,e-1/3)}return Ze.colorSpaceToWorking(this,r),this}setStyle(e,t=Zt){function i(s){s!==void 0&&parseFloat(s)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Zt){const i=lc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=An(e.r),this.g=An(e.g),this.b=An(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Zt){return Ze.workingToColorSpace(Ct.copy(this),e),Math.round(Ve(Ct.r*255,0,255))*65536+Math.round(Ve(Ct.g*255,0,255))*256+Math.round(Ve(Ct.b*255,0,255))}getHexString(e=Zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ze.workingColorSpace){Ze.workingToColorSpace(Ct.copy(this),t);const i=Ct.r,r=Ct.g,s=Ct.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case i:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-i)/d+2;break;case s:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=Ze.workingColorSpace){return Ze.workingToColorSpace(Ct.copy(this),t),e.r=Ct.r,e.g=Ct.g,e.b=Ct.b,e}getStyle(e=Zt){Ze.workingToColorSpace(Ct.copy(this),e);const t=Ct.r,i=Ct.g,r=Ct.b;return e!==Zt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Un),this.setHSL(Un.h+e,Un.s+t,Un.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Un),e.getHSL(Er);const i=fs(Un.h,Er.h,t),r=fs(Un.s,Er.s,t),s=fs(Un.l,Er.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ct=new Xe;Xe.NAMES=lc;let Sd=0;class ui extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sd++}),this.uuid=or(),this.name="",this.type="Material",this.blending=Li,this.side=Hn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$s,this.blendDst=Zs,this.blendEquation=Jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=Ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Co,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(i.blending=this.blending),this.side!==Hn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==$s&&(i.blendSrc=this.blendSrc),this.blendDst!==Zs&&(i.blendDst=this.blendDst),this.blendEquation!==Jn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ui&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Co&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class is extends ui{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.combine=Hl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const vt=new N,Tr=new Ne;let yd=0;class Jt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ro,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Tr.fromBufferAttribute(this,t),Tr.applyMatrix3(e),this.setXY(t,Tr.x,Tr.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix3(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix4(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyNormalMatrix(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.transformDirection(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Vi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=zt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vi(t,this.array)),t}setX(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vi(t,this.array)),t}setY(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vi(t,this.array)),t}setW(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=zt(t,this.array),i=zt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=zt(t,this.array),i=zt(i,this.array),r=zt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=zt(t,this.array),i=zt(i,this.array),r=zt(r,this.array),s=zt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ro&&(e.usage=this.usage),e}}class cc extends Jt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class uc extends Jt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class _t extends Jt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Ed=0;const $t=new ht,Ls=new Tt,Ei=new N,Xt=new lr,Ki=new lr,Et=new N;class Lt extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ed++}),this.uuid=or(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sc(e)?uc:cc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Be().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,i){return $t.makeTranslation(e,t,i),this.applyMatrix4($t),this}scale(e,t,i){return $t.makeScale(e,t,i),this.applyMatrix4($t),this}lookAt(e){return Ls.lookAt(e),Ls.updateMatrix(),this.applyMatrix4(Ls.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ei).negate(),this.translate(Ei.x,Ei.y,Ei.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new _t(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new lr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Xt.setFromBufferAttribute(s),this.morphTargetsRelative?(Et.addVectors(this.boundingBox.min,Xt.min),this.boundingBox.expandByPoint(Et),Et.addVectors(this.boundingBox.max,Xt.max),this.boundingBox.expandByPoint(Et)):(this.boundingBox.expandByPoint(Xt.min),this.boundingBox.expandByPoint(Xt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const i=this.boundingSphere.center;if(Xt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];Ki.setFromBufferAttribute(o),this.morphTargetsRelative?(Et.addVectors(Xt.min,Ki.min),Xt.expandByPoint(Et),Et.addVectors(Xt.max,Ki.max),Xt.expandByPoint(Et)):(Xt.expandByPoint(Ki.min),Xt.expandByPoint(Ki.max))}Xt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Et.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Et));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)Et.fromBufferAttribute(o,l),c&&(Ei.fromBufferAttribute(e,l),Et.add(Ei)),r=Math.max(r,i.distanceToSquared(Et))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Jt(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let O=0;O<i.count;O++)o[O]=new N,c[O]=new N;const l=new N,u=new N,d=new N,f=new Ne,p=new Ne,_=new Ne,v=new N,m=new N;function h(O,x,b){l.fromBufferAttribute(i,O),u.fromBufferAttribute(i,x),d.fromBufferAttribute(i,b),f.fromBufferAttribute(s,O),p.fromBufferAttribute(s,x),_.fromBufferAttribute(s,b),u.sub(l),d.sub(l),p.sub(f),_.sub(f);const P=1/(p.x*_.y-_.x*p.y);isFinite(P)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(d,-p.y).multiplyScalar(P),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(P),o[O].add(v),o[x].add(v),o[b].add(v),c[O].add(m),c[x].add(m),c[b].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let O=0,x=E.length;O<x;++O){const b=E[O],P=b.start,F=b.count;for(let U=P,V=P+F;U<V;U+=3)h(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const T=new N,y=new N,w=new N,A=new N;function R(O){w.fromBufferAttribute(r,O),A.copy(w);const x=o[O];T.copy(x),T.sub(w.multiplyScalar(w.dot(x))).normalize(),y.crossVectors(A,x);const P=y.dot(c[O])<0?-1:1;a.setXYZW(O,T.x,T.y,T.z,P)}for(let O=0,x=E.length;O<x;++O){const b=E[O],P=b.start,F=b.count;for(let U=P,V=P+F;U<V;U+=3)R(e.getX(U+0)),R(e.getX(U+1)),R(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Jt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new N,s=new N,a=new N,o=new N,c=new N,l=new N,u=new N,d=new N;if(e)for(let f=0,p=e.count;f<p;f+=3){const _=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(i,_),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),o.add(u),c.add(u),l.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=t.count;f<p;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Et.fromBufferAttribute(e,t),Et.normalize(),e.setXYZ(t,Et.x,Et.y,Et.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,d=o.normalized,f=new l.constructor(c.length*u);let p=0,_=0;for(let v=0,m=c.length;v<m;v++){o.isInterleavedBufferAttribute?p=c[v]*o.data.stride+o.offset:p=c[v]*u;for(let h=0;h<u;h++)f[_++]=l[p++]}return new Jt(f,u,d)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Lt,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,i);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,d=l.length;u<d;u++){const f=l[u],p=e(f,i);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const l=i[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,f=l.length;d<f;d++){const p=l[d];u.push(p.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],d=s[l];for(let f=0,p=d.length;f<p;f++)u.push(d[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Wo=new ht,Yn=new ns,Ar=new cr,Xo=new N,wr=new N,Cr=new N,Rr=new N,Is=new N,Pr=new N,qo=new N,Dr=new N;class Dt extends Tt{constructor(e=new Lt,t=new is){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Pr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],d=s[c];u!==0&&(Is.fromBufferAttribute(d,e),a?Pr.addScaledVector(Is,u):Pr.addScaledVector(Is.sub(t),u))}t.add(Pr)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ar.copy(i.boundingSphere),Ar.applyMatrix4(s),Yn.copy(e.ray).recast(e.near),!(Ar.containsPoint(Yn.origin)===!1&&(Yn.intersectSphere(Ar,Xo)===null||Yn.origin.distanceToSquared(Xo)>(e.far-e.near)**2))&&(Wo.copy(s).invert(),Yn.copy(e.ray).applyMatrix4(Wo),!(i.boundingBox!==null&&Yn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Yn)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const m=f[_],h=a[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=E,w=T;y<w;y+=3){const A=o.getX(y),R=o.getX(y+1),O=o.getX(y+2);r=Lr(this,h,e,i,l,u,d,A,R,O),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let m=_,h=v;m<h;m+=3){const E=o.getX(m),T=o.getX(m+1),y=o.getX(m+2);r=Lr(this,a,e,i,l,u,d,E,T,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const m=f[_],h=a[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let y=E,w=T;y<w;y+=3){const A=y,R=y+1,O=y+2;r=Lr(this,h,e,i,l,u,d,A,R,O),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=_,h=v;m<h;m+=3){const E=m,T=m+1,y=m+2;r=Lr(this,a,e,i,l,u,d,E,T,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Td(n,e,t,i,r,s,a,o){let c;if(e.side===kt?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===Hn,o),c===null)return null;Dr.copy(o),Dr.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Dr);return l<t.near||l>t.far?null:{distance:l,point:Dr.clone(),object:n}}function Lr(n,e,t,i,r,s,a,o,c,l){n.getVertexPosition(o,wr),n.getVertexPosition(c,Cr),n.getVertexPosition(l,Rr);const u=Td(n,e,t,i,wr,Cr,Rr,qo);if(u){const d=new N;sn.getBarycoord(qo,wr,Cr,Rr,d),r&&(u.uv=sn.getInterpolatedAttribute(r,o,c,l,d,new Ne)),s&&(u.uv1=sn.getInterpolatedAttribute(s,o,c,l,d,new Ne)),a&&(u.normal=sn.getInterpolatedAttribute(a,o,c,l,d,new N),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new N,materialIndex:0};sn.getNormal(wr,Cr,Rr,f.normal),u.face=f,u.barycoord=d}return u}class di extends Lt{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],d=[];let f=0,p=0;_("z","y","x",-1,-1,i,t,e,a,s,0),_("z","y","x",1,-1,i,t,-e,a,s,1),_("x","z","y",1,1,e,i,t,r,a,2),_("x","z","y",1,-1,e,i,-t,r,a,3),_("x","y","z",1,-1,e,t,i,r,s,4),_("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new _t(l,3)),this.setAttribute("normal",new _t(u,3)),this.setAttribute("uv",new _t(d,2));function _(v,m,h,E,T,y,w,A,R,O,x){const b=y/R,P=w/O,F=y/2,U=w/2,V=A/2,q=R+1,k=O+1;let W=0,$=0;const ie=new N;for(let ee=0;ee<k;ee++){const he=ee*P-U;for(let Ue=0;Ue<q;Ue++){const Fe=Ue*b-F;ie[v]=Fe*E,ie[m]=he*T,ie[h]=V,l.push(ie.x,ie.y,ie.z),ie[v]=0,ie[m]=0,ie[h]=A>0?1:-1,u.push(ie.x,ie.y,ie.z),d.push(Ue/R),d.push(1-ee/O),W+=1}}for(let ee=0;ee<O;ee++)for(let he=0;he<R;he++){const Ue=f+he+q*ee,Fe=f+he+q*(ee+1),at=f+(he+1)+q*(ee+1),Qe=f+(he+1)+q*ee;c.push(Ue,Fe,Qe),c.push(Fe,at,Qe),$+=6}o.addGroup(p,$,x),p+=$,f+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new di(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Ut(n){const e={};for(let t=0;t<n.length;t++){const i=Bi(n[t]);for(const r in i)e[r]=i[r]}return e}function Ad(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function dc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ze.workingColorSpace}const wd={clone:Bi,merge:Ut};var Cd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gn extends ui{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cd,this.fragmentShader=Rd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bi(e.uniforms),this.uniformsGroups=Ad(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class hc extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nn=new N,Ko=new Ne,Yo=new Ne;class jt extends hc{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ga*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(qr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ga*2*Math.atan(Math.tan(qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Nn.x,Nn.y).multiplyScalar(-e/Nn.z)}getViewSize(e,t){return this.getViewBounds(e,Ko,Yo),t.subVectors(Yo,Ko)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(qr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*i/l,r*=a.width/c,i*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ti=-90,Ai=1;class Pd extends Tt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new jt(Ti,Ai,e,t);r.layers=this.layers,this.add(r);const s=new jt(Ti,Ai,e,t);s.layers=this.layers,this.add(s);const a=new jt(Ti,Ai,e,t);a.layers=this.layers,this.add(a);const o=new jt(Ti,Ai,e,t);o.layers=this.layers,this.add(o);const c=new jt(Ti,Ai,e,t);c.layers=this.layers,this.add(c);const l=new jt(Ti,Ai,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===dn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Zr)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,l),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(d,f,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class fc extends Pt{constructor(e=[],t=oi,i,r,s,a,o,c,l,u){super(e,t,i,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class pc extends fn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new fc(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new di(5,5,5),s=new gn({name:"CubemapFromEquirect",uniforms:Bi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:kt,blending:Tn});s.uniforms.tEquirect.value=t;const a=new Dt(r,s),o=t.minFilter;return t.minFilter===ii&&(t.minFilter=Rt),new Pd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}class si extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Dd={type:"move"};class Us{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new si,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new si,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new si,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),h=this._getHandJoint(l,v);m!==null&&(h.matrix.fromArray(m.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=m.radius),h.visible=m!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=u.position.distanceTo(d.position),p=.02,_=.005;l.inputState.pinching&&f>p+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=p-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Dd)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new si;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Ld extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new mn,this.environmentIntensity=1,this.environmentRotation=new mn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Id extends Pt{constructor(e=null,t=1,i=1,r,s,a,o,c,l=At,u=At,d,f){super(null,a,o,c,l,u,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ns=new N,Ud=new N,Nd=new Be;class Fn{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ns.subVectors(i,t).cross(Ud.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ns),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Nd.getNormalMatrix(e),r=this.coplanarPoint(Ns).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $n=new cr,Fd=new Ne(.5,.5),Ir=new N;class lo{constructor(e=new Fn,t=new Fn,i=new Fn,r=new Fn,s=new Fn,a=new Fn){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=dn,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],c=s[2],l=s[3],u=s[4],d=s[5],f=s[6],p=s[7],_=s[8],v=s[9],m=s[10],h=s[11],E=s[12],T=s[13],y=s[14],w=s[15];if(r[0].setComponents(l-a,p-u,h-_,w-E).normalize(),r[1].setComponents(l+a,p+u,h+_,w+E).normalize(),r[2].setComponents(l+o,p+d,h+v,w+T).normalize(),r[3].setComponents(l-o,p-d,h-v,w-T).normalize(),i)r[4].setComponents(c,f,m,y).normalize(),r[5].setComponents(l-c,p-f,h-m,w-y).normalize();else if(r[4].setComponents(l-c,p-f,h-m,w-y).normalize(),t===dn)r[5].setComponents(l+c,p+f,h+m,w+y).normalize();else if(t===Zr)r[5].setComponents(c,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(e){$n.center.set(0,0,0);const t=Fd.distanceTo(e.center);return $n.radius=.7071067811865476+t,$n.applyMatrix4(e.matrixWorld),this.intersectsSphere($n)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Ir.x=r.normal.x>0?e.max.x:e.min.x,Ir.y=r.normal.y>0?e.max.y:e.min.y,Ir.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ir)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class co extends ui{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Jr=new N,Qr=new N,$o=new ht,Yi=new ns,Ur=new cr,Fs=new N,Zo=new N;class Od extends Tt{constructor(e=new Lt,t=new co){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Jr.fromBufferAttribute(t,r-1),Qr.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Jr.distanceTo(Qr);e.setAttribute("lineDistance",new _t(i,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ur.copy(i.boundingSphere),Ur.applyMatrix4(r),Ur.radius+=s,e.ray.intersectsSphere(Ur)===!1)return;$o.copy(r).invert(),Yi.copy(e.ray).applyMatrix4($o);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let v=p,m=_-1;v<m;v+=l){const h=u.getX(v),E=u.getX(v+1),T=Nr(this,e,Yi,c,h,E,v);T&&t.push(T)}if(this.isLineLoop){const v=u.getX(_-1),m=u.getX(p),h=Nr(this,e,Yi,c,v,m,_-1);h&&t.push(h)}}else{const p=Math.max(0,a.start),_=Math.min(f.count,a.start+a.count);for(let v=p,m=_-1;v<m;v+=l){const h=Nr(this,e,Yi,c,v,v+1,v);h&&t.push(h)}if(this.isLineLoop){const v=Nr(this,e,Yi,c,_-1,p,_-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Nr(n,e,t,i,r,s,a){const o=n.geometry.attributes.position;if(Jr.fromBufferAttribute(o,r),Qr.fromBufferAttribute(o,s),t.distanceSqToSegment(Jr,Qr,Fs,Zo)>i)return;Fs.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Fs);if(!(l<e.near||l>e.far))return{distance:l,point:Zo.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const jo=new N,Jo=new N;class mc extends Od{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)jo.fromBufferAttribute(t,r),Jo.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+jo.distanceTo(Jo);e.setAttribute("lineDistance",new _t(i,1))}else Le("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class gc extends ui{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Qo=new ht,ka=new ns,Fr=new cr,Or=new N;class Bd extends Tt{constructor(e=new Lt,t=new gc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fr.copy(i.boundingSphere),Fr.applyMatrix4(r),Fr.radius+=s,e.ray.intersectsSphere(Fr)===!1)return;Qo.copy(r).invert(),ka.copy(e.ray).applyMatrix4(Qo);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=i.index,d=i.attributes.position;if(l!==null){const f=Math.max(0,a.start),p=Math.min(l.count,a.start+a.count);for(let _=f,v=p;_<v;_++){const m=l.getX(_);Or.fromBufferAttribute(d,m),el(Or,m,c,r,e,t,this)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let _=f,v=p;_<v;_++)Or.fromBufferAttribute(d,_),el(Or,_,c,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function el(n,e,t,i,r,s,a){const o=ka.distanceSqToPoint(n);if(o<t){const c=new N;ka.closestPointToPoint(n,c),c.applyMatrix4(i);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class zd extends Pt{constructor(e,t,i,r,s,a,o,c,l){super(e,t,i,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ar extends Pt{constructor(e,t,i=pn,r,s,a,o=At,c=At,l,u=Cn,d=1){if(u!==Cn&&u!==ri)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,r,s,a,o,c,u,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new oo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Gd extends ar{constructor(e,t=pn,i=oi,r,s,a=At,o=At,c,l=Cn){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,r,s,a,o,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _c extends Pt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class rs extends Lt{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],d=[],f=[],p=[];let _=0;const v=[],m=i/2;let h=0;E(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new _t(d,3)),this.setAttribute("normal",new _t(f,3)),this.setAttribute("uv",new _t(p,2));function E(){const y=new N,w=new N;let A=0;const R=(t-e)/i;for(let O=0;O<=s;O++){const x=[],b=O/s,P=b*(t-e)+e;for(let F=0;F<=r;F++){const U=F/r,V=U*c+o,q=Math.sin(V),k=Math.cos(V);w.x=P*q,w.y=-b*i+m,w.z=P*k,d.push(w.x,w.y,w.z),y.set(q,R,k).normalize(),f.push(y.x,y.y,y.z),p.push(U,1-b),x.push(_++)}v.push(x)}for(let O=0;O<r;O++)for(let x=0;x<s;x++){const b=v[x][O],P=v[x+1][O],F=v[x+1][O+1],U=v[x][O+1];(e>0||x!==0)&&(u.push(b,P,U),A+=3),(t>0||x!==s-1)&&(u.push(P,F,U),A+=3)}l.addGroup(h,A,0),h+=A}function T(y){const w=_,A=new Ne,R=new N;let O=0;const x=y===!0?e:t,b=y===!0?1:-1;for(let F=1;F<=r;F++)d.push(0,m*b,0),f.push(0,b,0),p.push(.5,.5),_++;const P=_;for(let F=0;F<=r;F++){const V=F/r*c+o,q=Math.cos(V),k=Math.sin(V);R.x=x*k,R.y=m*b,R.z=x*q,d.push(R.x,R.y,R.z),f.push(0,b,0),A.x=q*.5+.5,A.y=k*.5*b+.5,p.push(A.x,A.y),_++}for(let F=0;F<r;F++){const U=w+F,V=P+F;y===!0?u.push(V,V+1,U):u.push(V+1,V,U),O+=3}l.addGroup(h,O,y===!0?1:2),h+=O}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rs(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ss extends Lt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),c=Math.floor(r),l=o+1,u=c+1,d=e/o,f=t/c,p=[],_=[],v=[],m=[];for(let h=0;h<u;h++){const E=h*f-a;for(let T=0;T<l;T++){const y=T*d-s;_.push(y,-E,0),v.push(0,0,1),m.push(T/o),m.push(1-h/c)}}for(let h=0;h<c;h++)for(let E=0;E<o;E++){const T=E+l*h,y=E+l*(h+1),w=E+1+l*(h+1),A=E+1+l*h;p.push(T,y,A),p.push(y,w,A)}this.setIndex(p),this.setAttribute("position",new _t(_,3)),this.setAttribute("normal",new _t(v,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ss(e.width,e.height,e.widthSegments,e.heightSegments)}}class ur extends Lt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const c=Math.min(a+o,Math.PI);let l=0;const u=[],d=new N,f=new N,p=[],_=[],v=[],m=[];for(let h=0;h<=i;h++){const E=[],T=h/i;let y=0;h===0&&a===0?y=.5/t:h===i&&c===Math.PI&&(y=-.5/t);for(let w=0;w<=t;w++){const A=w/t;d.x=-e*Math.cos(r+A*s)*Math.sin(a+T*o),d.y=e*Math.cos(a+T*o),d.z=e*Math.sin(r+A*s)*Math.sin(a+T*o),_.push(d.x,d.y,d.z),f.copy(d).normalize(),v.push(f.x,f.y,f.z),m.push(A+y,1-T),E.push(l++)}u.push(E)}for(let h=0;h<i;h++)for(let E=0;E<t;E++){const T=u[h][E+1],y=u[h][E],w=u[h+1][E],A=u[h+1][E+1];(h!==0||a>0)&&p.push(T,y,A),(h!==i-1||c<Math.PI)&&p.push(y,w,A)}this.setIndex(p),this.setAttribute("position",new _t(_,3)),this.setAttribute("normal",new _t(v,3)),this.setAttribute("uv",new _t(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ur(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class kd extends gn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class dr extends ui{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=rc,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new mn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hd extends ui{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ju,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Vd extends ui{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class vc extends Tt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}const Os=new ht,tl=new N,nl=new N;class Wd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ne(512,512),this.mapType=Kt,this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lo,this._frameExtents=new Ne(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;tl.setFromMatrixPosition(e.matrixWorld),t.position.copy(tl),nl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(nl),t.updateMatrixWorld(),Os.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Os,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Os)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class uo extends hc{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Xd extends Wd{constructor(){super(new uo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class il extends vc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new Xd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class qd extends vc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Kd extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Yd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class rl{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ve(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ve(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class $d extends mc{constructor(e=10,t=10,i=4473924,r=8947848){i=new Xe(i),r=new Xe(r);const s=t/2,a=e/t,o=e/2,c=[],l=[];for(let f=0,p=0,_=-o;f<=t;f++,_+=a){c.push(-o,0,_,o,0,_),c.push(_,0,-o,_,0,o);const v=f===s?i:r;v.toArray(l,p),p+=3,v.toArray(l,p),p+=3,v.toArray(l,p),p+=3,v.toArray(l,p),p+=3}const u=new Lt;u.setAttribute("position",new _t(c,3)),u.setAttribute("color",new _t(l,3));const d=new co({vertexColors:!0,toneMapped:!1});super(u,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class Zd extends mc{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new Lt;r.setAttribute("position",new _t(t,3)),r.setAttribute("color",new _t(i,3));const s=new co({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,t,i){const r=new Xe,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(t),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class jd extends ci{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function sl(n,e,t,i){const r=Jd(i);switch(t){case tc:return n*e;case ic:return n*e/r.components*r.byteLength;case no:return n*e/r.components*r.byteLength;case Fi:return n*e*2/r.components*r.byteLength;case io:return n*e*2/r.components*r.byteLength;case nc:return n*e*3/r.components*r.byteLength;case an:return n*e*4/r.components*r.byteLength;case ro:return n*e*4/r.components*r.byteLength;case Hr:case Vr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wr:case Xr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ca:case da:return Math.max(n,16)*Math.max(e,8)/4;case la:case ua:return Math.max(n,8)*Math.max(e,8)/2;case ha:case fa:case ma:case ga:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case pa:case _a:case va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ma:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ba:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ya:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ta:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Aa:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case wa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Ra:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Pa:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Da:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case La:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Ia:case Ua:case Na:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Fa:case Oa:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ba:case za:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Jd(n){switch(n){case Kt:case jl:return{byteLength:1,components:1};case ir:case Jl:case wn:return{byteLength:2,components:1};case eo:case to:return{byteLength:2,components:4};case pn:case Qa:case un:return{byteLength:4,components:1};case Ql:case ec:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ja}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ja);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function xc(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Qd(n){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,d=l.byteLength,f=n.createBuffer();n.bindBuffer(c,f),n.bufferData(c,l,u),o.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,c,l){const u=c.array,d=c.updateRanges;if(n.bindBuffer(l,o),d.length===0)n.bufferSubData(l,0,u);else{d.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<d.length;p++){const _=d[f],v=d[p];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++f,d[f]=v)}d.length=f+1;for(let p=0,_=d.length;p<_;p++){const v=d[p];n.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(n.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}var eh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,th=`#ifdef USE_ALPHAHASH
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
#endif`,nh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ih=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ah=`#ifdef USE_AOMAP
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
#endif`,oh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lh=`#ifdef USE_BATCHING
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
#endif`,ch=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,uh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fh=`#ifdef USE_IRIDESCENCE
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
#endif`,ph=`#ifdef USE_BUMPMAP
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
#endif`,mh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,_h=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,xh=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Sh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,yh=`#define PI 3.141592653589793
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
} // validated`,Eh=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Th=`vec3 transformedNormal = objectNormal;
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
#endif`,Ah=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ch=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Rh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ph="gl_FragColor = linearToOutputTexel( gl_FragColor );",Dh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Lh=`#ifdef USE_ENVMAP
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
#endif`,Ih=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Uh=`#ifdef USE_ENVMAP
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
#endif`,Nh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fh=`#ifdef USE_ENVMAP
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
#endif`,Oh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Bh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,kh=`#ifdef USE_GRADIENTMAP
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
}`,Hh=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xh=`uniform bool receiveShadow;
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
#endif`,qh=`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
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
#endif`,Kh=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Yh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$h=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zh=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jh=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,Jh=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
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
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
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
		return v;
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
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
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Qh=`
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
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
#endif`,ef=`#if defined( RE_IndirectDiffuse )
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
#endif`,tf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,af=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,of=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,uf=`#if defined( USE_POINTS_UV )
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
#endif`,df=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ff=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,pf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gf=`#ifdef USE_MORPHTARGETS
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
#endif`,_f=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,xf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Mf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Sf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,yf=`#ifdef USE_NORMALMAP
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
#endif`,Ef=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Tf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Af=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Pf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Df=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,If=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Uf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ff=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
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
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
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
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Of=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Bf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,zf=`float getShadowMask() {
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
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
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
}`,Gf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kf=`#ifdef USE_SKINNING
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
#endif`,Hf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Vf=`#ifdef USE_SKINNING
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
#endif`,Wf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Yf=`#ifdef USE_TRANSMISSION
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
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$f=`#ifdef USE_TRANSMISSION
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
#endif`,Zf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ep=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,tp=`uniform sampler2D t2D;
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
}`,np=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ip=`#ifdef ENVMAP_TYPE_CUBE
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
}`,rp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ap=`#include <common>
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
}`,op=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,lp=`#define DISTANCE
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
}`,cp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
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
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,up=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hp=`uniform float scale;
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
}`,fp=`uniform vec3 diffuse;
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
}`,pp=`#include <common>
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
}`,mp=`uniform vec3 diffuse;
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
}`,gp=`#define LAMBERT
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
}`,_p=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,vp=`#define MATCAP
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
}`,xp=`#define MATCAP
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
}`,Mp=`#define NORMAL
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
}`,bp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Sp=`#define PHONG
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
}`,yp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
}`,Ep=`#define STANDARD
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
}`,Tp=`#define STANDARD
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,Ap=`#define TOON
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
}`,wp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,Cp=`uniform float size;
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
}`,Rp=`uniform vec3 diffuse;
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
}`,Pp=`#include <common>
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
}`,Dp=`uniform vec3 color;
uniform float opacity;
#include <common>
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
}`,Lp=`uniform float rotation;
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
}`,Ip=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:eh,alphahash_pars_fragment:th,alphamap_fragment:nh,alphamap_pars_fragment:ih,alphatest_fragment:rh,alphatest_pars_fragment:sh,aomap_fragment:ah,aomap_pars_fragment:oh,batching_pars_vertex:lh,batching_vertex:ch,begin_vertex:uh,beginnormal_vertex:dh,bsdfs:hh,iridescence_fragment:fh,bumpmap_pars_fragment:ph,clipping_planes_fragment:mh,clipping_planes_pars_fragment:gh,clipping_planes_pars_vertex:_h,clipping_planes_vertex:vh,color_fragment:xh,color_pars_fragment:Mh,color_pars_vertex:bh,color_vertex:Sh,common:yh,cube_uv_reflection_fragment:Eh,defaultnormal_vertex:Th,displacementmap_pars_vertex:Ah,displacementmap_vertex:wh,emissivemap_fragment:Ch,emissivemap_pars_fragment:Rh,colorspace_fragment:Ph,colorspace_pars_fragment:Dh,envmap_fragment:Lh,envmap_common_pars_fragment:Ih,envmap_pars_fragment:Uh,envmap_pars_vertex:Nh,envmap_physical_pars_fragment:qh,envmap_vertex:Fh,fog_vertex:Oh,fog_pars_vertex:Bh,fog_fragment:zh,fog_pars_fragment:Gh,gradientmap_pars_fragment:kh,lightmap_pars_fragment:Hh,lights_lambert_fragment:Vh,lights_lambert_pars_fragment:Wh,lights_pars_begin:Xh,lights_toon_fragment:Kh,lights_toon_pars_fragment:Yh,lights_phong_fragment:$h,lights_phong_pars_fragment:Zh,lights_physical_fragment:jh,lights_physical_pars_fragment:Jh,lights_fragment_begin:Qh,lights_fragment_maps:ef,lights_fragment_end:tf,logdepthbuf_fragment:nf,logdepthbuf_pars_fragment:rf,logdepthbuf_pars_vertex:sf,logdepthbuf_vertex:af,map_fragment:of,map_pars_fragment:lf,map_particle_fragment:cf,map_particle_pars_fragment:uf,metalnessmap_fragment:df,metalnessmap_pars_fragment:hf,morphinstance_vertex:ff,morphcolor_vertex:pf,morphnormal_vertex:mf,morphtarget_pars_vertex:gf,morphtarget_vertex:_f,normal_fragment_begin:vf,normal_fragment_maps:xf,normal_pars_fragment:Mf,normal_pars_vertex:bf,normal_vertex:Sf,normalmap_pars_fragment:yf,clearcoat_normal_fragment_begin:Ef,clearcoat_normal_fragment_maps:Tf,clearcoat_pars_fragment:Af,iridescence_pars_fragment:wf,opaque_fragment:Cf,packing:Rf,premultiplied_alpha_fragment:Pf,project_vertex:Df,dithering_fragment:Lf,dithering_pars_fragment:If,roughnessmap_fragment:Uf,roughnessmap_pars_fragment:Nf,shadowmap_pars_fragment:Ff,shadowmap_pars_vertex:Of,shadowmap_vertex:Bf,shadowmask_pars_fragment:zf,skinbase_vertex:Gf,skinning_pars_vertex:kf,skinning_vertex:Hf,skinnormal_vertex:Vf,specularmap_fragment:Wf,specularmap_pars_fragment:Xf,tonemapping_fragment:qf,tonemapping_pars_fragment:Kf,transmission_fragment:Yf,transmission_pars_fragment:$f,uv_pars_fragment:Zf,uv_pars_vertex:jf,uv_vertex:Jf,worldpos_vertex:Qf,background_vert:ep,background_frag:tp,backgroundCube_vert:np,backgroundCube_frag:ip,cube_vert:rp,cube_frag:sp,depth_vert:ap,depth_frag:op,distance_vert:lp,distance_frag:cp,equirect_vert:up,equirect_frag:dp,linedashed_vert:hp,linedashed_frag:fp,meshbasic_vert:pp,meshbasic_frag:mp,meshlambert_vert:gp,meshlambert_frag:_p,meshmatcap_vert:vp,meshmatcap_frag:xp,meshnormal_vert:Mp,meshnormal_frag:bp,meshphong_vert:Sp,meshphong_frag:yp,meshphysical_vert:Ep,meshphysical_frag:Tp,meshtoon_vert:Ap,meshtoon_frag:wp,points_vert:Cp,points_frag:Rp,shadow_vert:Pp,shadow_frag:Dp,sprite_vert:Lp,sprite_frag:Ip},ue={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},cn={basic:{uniforms:Ut([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Ut([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Ut([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Ut([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Ut([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Ut([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Ut([ue.points,ue.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Ut([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Ut([ue.common,ue.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Ut([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Ut([ue.sprite,ue.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distance:{uniforms:Ut([ue.common,ue.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distance_vert,fragmentShader:ze.distance_frag},shadow:{uniforms:Ut([ue.lights,ue.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};cn.physical={uniforms:Ut([cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const Br={r:0,b:0,g:0},Zn=new mn,Up=new ht;function Np(n,e,t,i,r,s,a){const o=new Xe(0);let c=s===!0?0:1,l,u,d=null,f=0,p=null;function _(T){let y=T.isScene===!0?T.background:null;return y&&y.isTexture&&(y=(T.backgroundBlurriness>0?t:e).get(y)),y}function v(T){let y=!1;const w=_(T);w===null?h(o,c):w&&w.isColor&&(h(w,1),y=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(T,y){const w=_(y);w&&(w.isCubeTexture||w.mapping===ts)?(u===void 0&&(u=new Dt(new di(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:Bi(cn.backgroundCube.uniforms),vertexShader:cn.backgroundCube.vertexShader,fragmentShader:cn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,R,O){this.matrixWorld.copyPosition(O.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Zn.copy(y.backgroundRotation),Zn.x*=-1,Zn.y*=-1,Zn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(Zn.y*=-1,Zn.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Up.makeRotationFromEuler(Zn)),u.material.toneMapped=Ze.getTransfer(w.colorSpace)!==it,(d!==w||f!==w.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,d=w,f=w.version,p=n.toneMapping),u.layers.enableAll(),T.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new Dt(new ss(2,2),new gn({name:"BackgroundMaterial",uniforms:Bi(cn.background.uniforms),vertexShader:cn.background.vertexShader,fragmentShader:cn.background.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=Ze.getTransfer(w.colorSpace)!==it,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||f!==w.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,d=w,f=w.version,p=n.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function h(T,y){T.getRGB(Br,dc(n)),i.buffers.color.setClear(Br.r,Br.g,Br.b,y,a)}function E(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,y=1){o.set(T),c=y,h(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,h(o,c)},render:v,addToRenderList:m,dispose:E}}function Fp(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(b,P,F,U,V){let q=!1;const k=d(U,F,P);s!==k&&(s=k,l(s.object)),q=p(b,U,F,V),q&&_(b,U,F,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(b,P,F,U),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function c(){return n.createVertexArray()}function l(b){return n.bindVertexArray(b)}function u(b){return n.deleteVertexArray(b)}function d(b,P,F){const U=F.wireframe===!0;let V=i[b.id];V===void 0&&(V={},i[b.id]=V);let q=V[P.id];q===void 0&&(q={},V[P.id]=q);let k=q[U];return k===void 0&&(k=f(c()),q[U]=k),k}function f(b){const P=[],F=[],U=[];for(let V=0;V<t;V++)P[V]=0,F[V]=0,U[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:F,attributeDivisors:U,object:b,attributes:{},index:null}}function p(b,P,F,U){const V=s.attributes,q=P.attributes;let k=0;const W=F.getAttributes();for(const $ in W)if(W[$].location>=0){const ee=V[$];let he=q[$];if(he===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(he=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(he=b.instanceColor)),ee===void 0||ee.attribute!==he||he&&ee.data!==he.data)return!0;k++}return s.attributesNum!==k||s.index!==U}function _(b,P,F,U){const V={},q=P.attributes;let k=0;const W=F.getAttributes();for(const $ in W)if(W[$].location>=0){let ee=q[$];ee===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(ee=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(ee=b.instanceColor));const he={};he.attribute=ee,ee&&ee.data&&(he.data=ee.data),V[$]=he,k++}s.attributes=V,s.attributesNum=k,s.index=U}function v(){const b=s.newAttributes;for(let P=0,F=b.length;P<F;P++)b[P]=0}function m(b){h(b,0)}function h(b,P){const F=s.newAttributes,U=s.enabledAttributes,V=s.attributeDivisors;F[b]=1,U[b]===0&&(n.enableVertexAttribArray(b),U[b]=1),V[b]!==P&&(n.vertexAttribDivisor(b,P),V[b]=P)}function E(){const b=s.newAttributes,P=s.enabledAttributes;for(let F=0,U=P.length;F<U;F++)P[F]!==b[F]&&(n.disableVertexAttribArray(F),P[F]=0)}function T(b,P,F,U,V,q,k){k===!0?n.vertexAttribIPointer(b,P,F,V,q):n.vertexAttribPointer(b,P,F,U,V,q)}function y(b,P,F,U){v();const V=U.attributes,q=F.getAttributes(),k=P.defaultAttributeValues;for(const W in q){const $=q[W];if($.location>=0){let ie=V[W];if(ie===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor)),ie!==void 0){const ee=ie.normalized,he=ie.itemSize,Ue=e.get(ie);if(Ue===void 0)continue;const Fe=Ue.buffer,at=Ue.type,Qe=Ue.bytesPerElement,K=at===n.INT||at===n.UNSIGNED_INT||ie.gpuType===Qa;if(ie.isInterleavedBufferAttribute){const j=ie.data,pe=j.stride,Te=ie.offset;if(j.isInstancedInterleavedBuffer){for(let ge=0;ge<$.locationSize;ge++)h($.location+ge,j.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ge=0;ge<$.locationSize;ge++)m($.location+ge);n.bindBuffer(n.ARRAY_BUFFER,Fe);for(let ge=0;ge<$.locationSize;ge++)T($.location+ge,he/$.locationSize,at,ee,pe*Qe,(Te+he/$.locationSize*ge)*Qe,K)}else{if(ie.isInstancedBufferAttribute){for(let j=0;j<$.locationSize;j++)h($.location+j,ie.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let j=0;j<$.locationSize;j++)m($.location+j);n.bindBuffer(n.ARRAY_BUFFER,Fe);for(let j=0;j<$.locationSize;j++)T($.location+j,he/$.locationSize,at,ee,he*Qe,he/$.locationSize*j*Qe,K)}}else if(k!==void 0){const ee=k[W];if(ee!==void 0)switch(ee.length){case 2:n.vertexAttrib2fv($.location,ee);break;case 3:n.vertexAttrib3fv($.location,ee);break;case 4:n.vertexAttrib4fv($.location,ee);break;default:n.vertexAttrib1fv($.location,ee)}}}}E()}function w(){O();for(const b in i){const P=i[b];for(const F in P){const U=P[F];for(const V in U)u(U[V].object),delete U[V];delete P[F]}delete i[b]}}function A(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const F in P){const U=P[F];for(const V in U)u(U[V].object),delete U[V];delete P[F]}delete i[b.id]}function R(b){for(const P in i){const F=i[P];if(F[b.id]===void 0)continue;const U=F[b.id];for(const V in U)u(U[V].object),delete U[V];delete F[b.id]}}function O(){x(),a=!0,s!==r&&(s=r,l(s.object))}function x(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:O,resetDefaultState:x,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:E}}function Op(n,e,t){let i;function r(l){i=l}function s(l,u){n.drawArrays(i,l,u),t.update(u,i,1)}function a(l,u,d){d!==0&&(n.drawArraysInstanced(i,l,u,d),t.update(u,i,d))}function o(l,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,d);let p=0;for(let _=0;_<d;_++)p+=u[_];t.update(p,i,1)}function c(l,u,d,f){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<l.length;_++)a(l[_],u[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,u,0,f,0,d);let _=0;for(let v=0;v<d;v++)_+=u[v]*f[v];t.update(_,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Bp(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(R){return!(R!==an&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const O=R===wn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Kt&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==un&&!O)}function c(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(Le("WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),h=n.getParameter(n.MAX_VERTEX_ATTRIBS),E=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=n.getParameter(n.MAX_SAMPLES),A=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:h,maxVertexUniforms:E,maxVaryings:T,maxFragmentUniforms:y,maxSamples:w,samples:A}}function zp(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new Fn,o=new Be,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const p=d.length!==0||f||i!==0||r;return r=f,i=d.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,p){const _=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,h=n.get(d);if(!r||_===null||_.length===0||s&&!m)s?u(null):l();else{const E=s?0:i,T=E*4;let y=h.clippingState||null;c.value=y,y=u(_,f,T,p);for(let w=0;w!==T;++w)y[w]=t[w];h.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,p,_){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=c.value,_!==!0||m===null){const h=p+v*4,E=f.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<h)&&(m=new Float32Array(h));for(let T=0,y=p;T!==v;++T,y+=4)a.copy(d[T]).applyMatrix4(E,o),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function Gp(n){let e=new WeakMap;function t(a,o){return o===ra?a.mapping=oi:o===sa&&(a.mapping=Ni),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ra||o===sa)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new pc(c.height);return l.fromEquirectangularTexture(n,a),e.set(a,l),a.addEventListener("dispose",r),t(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const Bn=4,al=[.125,.215,.35,.446,.526,.582],Qn=20,kp=256,$i=new uo,ol=new Xe;let Bs=null,zs=0,Gs=0,ks=!1;const Hp=new N;class ll{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){const{size:a=256,position:o=Hp}=s;Bs=this._renderer.getRenderTarget(),zs=this._renderer.getActiveCubeFace(),Gs=this._renderer.getActiveMipmapLevel(),ks=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ul(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Bs,zs,Gs),this._renderer.xr.enabled=ks,e.scissorTest=!1,wi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===oi||e.mapping===Ni?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bs=this._renderer.getRenderTarget(),zs=this._renderer.getActiveCubeFace(),Gs=this._renderer.getActiveMipmapLevel(),ks=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Rt,minFilter:Rt,generateMipmaps:!1,type:wn,format:an,colorSpace:Oi,depthBuffer:!1},r=cl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cl(e,t,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Vp(s)),this._blurMaterial=Xp(s,e,t),this._ggxMaterial=Wp(s,e,t)}return r}_compileMaterial(e){const t=new Dt(new Lt,e);this._renderer.compile(t,$i)}_sceneToCubeUV(e,t,i,r,s){const c=new jt(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,p=d.toneMapping;d.getClearColor(ol),d.toneMapping=hn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new di,new is({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let h=!1;const E=e.background;E?E.isColor&&(m.color.copy(E),e.background=null,h=!0):(m.color.copy(ol),h=!0);for(let T=0;T<6;T++){const y=T%3;y===0?(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[T],s.y,s.z)):y===1?(c.up.set(0,0,l[T]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[T],s.z)):(c.up.set(0,l[T],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[T]));const w=this._cubeSize;wi(r,y*w,T>2?w:0,w,w),d.setRenderTarget(r),h&&d.render(v,c),d.render(e,c)}d.toneMapping=p,d.autoClear=f,e.background=E}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===oi||e.mapping===Ni;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=dl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ul());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;wi(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(a,$i)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const c=a.uniforms,l=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(l*l-u*u),f=0+l*1.25,p=d*f,{_lodMax:_}=this,v=this._sizeLods[i],m=3*v*(i>_-Bn?i-_+Bn:0),h=4*(this._cubeSize-v);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=_-t,wi(s,m,h,3*v,2*v),r.setRenderTarget(s),r.render(o,$i),c.envMap.value=s.texture,c.roughness.value=0,c.mipInt.value=_-i,wi(e,m,h,3*v,2*v),r.setRenderTarget(e),r.render(o,$i)}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Je("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[r];d.material=l;const f=l.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Qn-1),v=s/_,m=isFinite(s)?1+Math.floor(u*v):Qn;m>Qn&&Le(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Qn}`);const h=[];let E=0;for(let R=0;R<Qn;++R){const O=R/v,x=Math.exp(-O*O/2);h.push(x),R===0?E+=x:R<m&&(E+=2*x)}for(let R=0;R<h.length;R++)h[R]=h[R]/E;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=h,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:T}=this;f.dTheta.value=_,f.mipInt.value=T-i;const y=this._sizeLods[r],w=3*y*(r>T-Bn?r-T+Bn:0),A=4*(this._cubeSize-y);wi(t,w,A,3*y,2*y),c.setRenderTarget(t),c.render(d,$i)}}function Vp(n){const e=[],t=[],i=[];let r=n;const s=n-Bn+1+al.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>n-Bn?c=al[a-n+Bn-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),u=-l,d=1+l,f=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,_=6,v=3,m=2,h=1,E=new Float32Array(v*_*p),T=new Float32Array(m*_*p),y=new Float32Array(h*_*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,O=A>2?0:-1,x=[R,O,0,R+2/3,O,0,R+2/3,O+1,0,R,O,0,R+2/3,O+1,0,R,O+1,0];E.set(x,v*_*A),T.set(f,m*_*A);const b=[A,A,A,A,A,A];y.set(b,h*_*A)}const w=new Lt;w.setAttribute("position",new Jt(E,v)),w.setAttribute("uv",new Jt(T,m)),w.setAttribute("faceIndex",new Jt(y,h)),i.push(new Dt(w,null)),r>Bn&&r--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function cl(n,e,t){const i=new fn(n,e,t);return i.texture.mapping=ts,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wi(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Wp(n,e,t){return new gn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:kp,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:as(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Xp(n,e,t){const i=new Float32Array(Qn),r=new N(0,1,0);return new gn({name:"SphericalGaussianBlur",defines:{n:Qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:as(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function ul(){return new gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:as(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function dl(){return new gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:as(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function as(){return`

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
	`}function qp(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const c=o.mapping,l=c===ra||c===sa,u=c===oi||c===Ni;if(l||u){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new ll(n)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const p=o.image;return l&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new ll(n)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Kp(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&sr("WebGLRenderer: "+i+" extension not supported."),r}}}function Yp(n,e,t,i){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function c(d){const f=d.attributes;for(const p in f)e.update(f[p],n.ARRAY_BUFFER)}function l(d){const f=[],p=d.index,_=d.attributes.position;let v=0;if(p!==null){const E=p.array;v=p.version;for(let T=0,y=E.length;T<y;T+=3){const w=E[T+0],A=E[T+1],R=E[T+2];f.push(w,A,A,R,R,w)}}else if(_!==void 0){const E=_.array;v=_.version;for(let T=0,y=E.length/3-1;T<y;T+=3){const w=T+0,A=T+1,R=T+2;f.push(w,A,A,R,R,w)}}else return;const m=new(sc(f)?uc:cc)(f,1);m.version=v;const h=s.get(d);h&&e.remove(h),s.set(d,m)}function u(d){const f=s.get(d);if(f){const p=d.index;p!==null&&f.version<p.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function $p(n,e,t){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function c(f,p){n.drawElements(i,p,s,f*a),t.update(p,i,1)}function l(f,p,_){_!==0&&(n.drawElementsInstanced(i,p,s,f*a,_),t.update(p,i,_))}function u(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,_);let m=0;for(let h=0;h<_;h++)m+=p[h];t.update(m,i,1)}function d(f,p,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let h=0;h<f.length;h++)l(f[h]/a,p[h],v[h]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,v,0,_);let h=0;for(let E=0;E<_;E++)h+=p[E]*v[E];t.update(h,i,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Zp(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:Je("WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function jp(n,e,t){const i=new WeakMap,r=new mt;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==d){let x=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",x)};f!==void 0&&f.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],h=o.morphAttributes.normal||[],E=o.morphAttributes.color||[];let T=0;p===!0&&(T=1),_===!0&&(T=2),v===!0&&(T=3);let y=o.attributes.position.count*T,w=1;y>e.maxTextureSize&&(w=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const A=new Float32Array(y*w*4*d),R=new ac(A,y,w,d);R.type=un,R.needsUpdate=!0;const O=T*4;for(let b=0;b<d;b++){const P=m[b],F=h[b],U=E[b],V=y*w*4*b;for(let q=0;q<P.count;q++){const k=q*O;p===!0&&(r.fromBufferAttribute(P,q),A[V+k+0]=r.x,A[V+k+1]=r.y,A[V+k+2]=r.z,A[V+k+3]=0),_===!0&&(r.fromBufferAttribute(F,q),A[V+k+4]=r.x,A[V+k+5]=r.y,A[V+k+6]=r.z,A[V+k+7]=0),v===!0&&(r.fromBufferAttribute(U,q),A[V+k+8]=r.x,A[V+k+9]=r.y,A[V+k+10]=r.z,A[V+k+11]=U.itemSize===4?r.w:1)}}f={count:d,texture:R,size:new Ne(y,w)},i.set(o,f),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let p=0;for(let v=0;v<l.length;v++)p+=l[v];const _=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function Jp(n,e,t,i){let r=new WeakMap;function s(c){const l=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return d}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:a}}const Qp={[Vl]:"LINEAR_TONE_MAPPING",[Wl]:"REINHARD_TONE_MAPPING",[Xl]:"CINEON_TONE_MAPPING",[ql]:"ACES_FILMIC_TONE_MAPPING",[Yl]:"AGX_TONE_MAPPING",[$l]:"NEUTRAL_TONE_MAPPING",[Kl]:"CUSTOM_TONE_MAPPING"};function em(n,e,t,i,r){const s=new fn(e,t,{type:n,depthBuffer:i,stencilBuffer:r}),a=new fn(e,t,{type:wn,depthBuffer:!1,stencilBuffer:!1}),o=new Lt;o.setAttribute("position",new _t([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new _t([0,2,0,0,2,0],2));const c=new kd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new Dt(o,c),u=new uo(-1,1,1,-1,0,1);let d=null,f=null,p=!1,_,v=null,m=[],h=!1;this.setSize=function(E,T){s.setSize(E,T),a.setSize(E,T);for(let y=0;y<m.length;y++){const w=m[y];w.setSize&&w.setSize(E,T)}},this.setEffects=function(E){m=E,h=m.length>0&&m[0].isRenderPass===!0;const T=s.width,y=s.height;for(let w=0;w<m.length;w++){const A=m[w];A.setSize&&A.setSize(T,y)}},this.begin=function(E,T){if(p||E.toneMapping===hn&&m.length===0)return!1;if(v=T,T!==null){const y=T.width,w=T.height;(s.width!==y||s.height!==w)&&this.setSize(y,w)}return h===!1&&E.setRenderTarget(s),_=E.toneMapping,E.toneMapping=hn,!0},this.hasRenderPass=function(){return h},this.end=function(E,T){E.toneMapping=_,p=!0;let y=s,w=a;for(let A=0;A<m.length;A++){const R=m[A];if(R.enabled!==!1&&(R.render(E,w,y,T),R.needsSwap!==!1)){const O=y;y=w,w=O}}if(d!==E.outputColorSpace||f!==E.toneMapping){d=E.outputColorSpace,f=E.toneMapping,c.defines={},Ze.getTransfer(d)===it&&(c.defines.SRGB_TRANSFER="");const A=Qp[f];A&&(c.defines[A]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=y.texture,E.setRenderTarget(v),E.render(l,u),v=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){s.dispose(),a.dispose(),o.dispose(),c.dispose()}}const Mc=new Pt,Ha=new ar(1,1),bc=new ac,Sc=new pd,yc=new fc,hl=[],fl=[],pl=new Float32Array(16),ml=new Float32Array(9),gl=new Float32Array(4);function zi(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=hl[r];if(s===void 0&&(s=new Float32Array(r),hl[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function St(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function yt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function os(n,e){let t=fl[e];t===void 0&&(t=new Int32Array(e),fl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function tm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function nm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2fv(this.addr,e),yt(t,e)}}function im(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;n.uniform3fv(this.addr,e),yt(t,e)}}function rm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4fv(this.addr,e),yt(t,e)}}function sm(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(St(t,i))return;gl.set(i),n.uniformMatrix2fv(this.addr,!1,gl),yt(t,i)}}function am(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(St(t,i))return;ml.set(i),n.uniformMatrix3fv(this.addr,!1,ml),yt(t,i)}}function om(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(St(t,i))return;pl.set(i),n.uniformMatrix4fv(this.addr,!1,pl),yt(t,i)}}function lm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function cm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2iv(this.addr,e),yt(t,e)}}function um(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;n.uniform3iv(this.addr,e),yt(t,e)}}function dm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4iv(this.addr,e),yt(t,e)}}function hm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function fm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2uiv(this.addr,e),yt(t,e)}}function pm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;n.uniform3uiv(this.addr,e),yt(t,e)}}function mm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4uiv(this.addr,e),yt(t,e)}}function gm(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Ha.compareFunction=t.isReversedDepthBuffer()?ao:so,s=Ha):s=Mc,t.setTexture2D(e||s,r)}function _m(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Sc,r)}function vm(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||yc,r)}function xm(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||bc,r)}function Mm(n){switch(n){case 5126:return tm;case 35664:return nm;case 35665:return im;case 35666:return rm;case 35674:return sm;case 35675:return am;case 35676:return om;case 5124:case 35670:return lm;case 35667:case 35671:return cm;case 35668:case 35672:return um;case 35669:case 35673:return dm;case 5125:return hm;case 36294:return fm;case 36295:return pm;case 36296:return mm;case 35678:case 36198:case 36298:case 36306:case 35682:return gm;case 35679:case 36299:case 36307:return _m;case 35680:case 36300:case 36308:case 36293:return vm;case 36289:case 36303:case 36311:case 36292:return xm}}function bm(n,e){n.uniform1fv(this.addr,e)}function Sm(n,e){const t=zi(e,this.size,2);n.uniform2fv(this.addr,t)}function ym(n,e){const t=zi(e,this.size,3);n.uniform3fv(this.addr,t)}function Em(n,e){const t=zi(e,this.size,4);n.uniform4fv(this.addr,t)}function Tm(n,e){const t=zi(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Am(n,e){const t=zi(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function wm(n,e){const t=zi(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Cm(n,e){n.uniform1iv(this.addr,e)}function Rm(n,e){n.uniform2iv(this.addr,e)}function Pm(n,e){n.uniform3iv(this.addr,e)}function Dm(n,e){n.uniform4iv(this.addr,e)}function Lm(n,e){n.uniform1uiv(this.addr,e)}function Im(n,e){n.uniform2uiv(this.addr,e)}function Um(n,e){n.uniform3uiv(this.addr,e)}function Nm(n,e){n.uniform4uiv(this.addr,e)}function Fm(n,e,t){const i=this.cache,r=e.length,s=os(t,r);St(i,s)||(n.uniform1iv(this.addr,s),yt(i,s));let a;this.type===n.SAMPLER_2D_SHADOW?a=Ha:a=Mc;for(let o=0;o!==r;++o)t.setTexture2D(e[o]||a,s[o])}function Om(n,e,t){const i=this.cache,r=e.length,s=os(t,r);St(i,s)||(n.uniform1iv(this.addr,s),yt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Sc,s[a])}function Bm(n,e,t){const i=this.cache,r=e.length,s=os(t,r);St(i,s)||(n.uniform1iv(this.addr,s),yt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||yc,s[a])}function zm(n,e,t){const i=this.cache,r=e.length,s=os(t,r);St(i,s)||(n.uniform1iv(this.addr,s),yt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||bc,s[a])}function Gm(n){switch(n){case 5126:return bm;case 35664:return Sm;case 35665:return ym;case 35666:return Em;case 35674:return Tm;case 35675:return Am;case 35676:return wm;case 5124:case 35670:return Cm;case 35667:case 35671:return Rm;case 35668:case 35672:return Pm;case 35669:case 35673:return Dm;case 5125:return Lm;case 36294:return Im;case 36295:return Um;case 36296:return Nm;case 35678:case 36198:case 36298:case 36306:case 35682:return Fm;case 35679:case 36299:case 36307:return Om;case 35680:case 36300:case 36308:case 36293:return Bm;case 36289:case 36303:case 36311:case 36292:return zm}}class km{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Mm(t.type)}}class Hm{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gm(t.type)}}class Vm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Hs=/(\w+)(\])?(\[|\.)?/g;function _l(n,e){n.seq.push(e),n.map[e.id]=e}function Wm(n,e,t){const i=n.name,r=i.length;for(Hs.lastIndex=0;;){const s=Hs.exec(i),a=Hs.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){_l(t,l===void 0?new km(o,n,e):new Hm(o,n,e));break}else{let d=t.map[o];d===void 0&&(d=new Vm(o),_l(t,d)),t=d}}}class Kr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);Wm(o,c,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function vl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Xm=37297;let qm=0;function Km(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const xl=new Be;function Ym(n){Ze._getMatrix(xl,Ze.workingColorSpace,n);const e=`mat3( ${xl.elements.map(t=>t.toFixed(4))} )`;switch(Ze.getTransfer(n)){case $r:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Ml(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+Km(n.getShaderSource(e),o)}else return s}function $m(n,e){const t=Ym(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Zm={[Vl]:"Linear",[Wl]:"Reinhard",[Xl]:"Cineon",[ql]:"ACESFilmic",[Yl]:"AgX",[$l]:"Neutral",[Kl]:"Custom"};function jm(n,e){const t=Zm[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const zr=new N;function Jm(){Ze.getLuminanceCoefficients(zr);const n=zr.x.toFixed(4),e=zr.y.toFixed(4),t=zr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Qm(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(er).join(`
`)}function eg(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function tg(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function er(n){return n!==""}function bl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ng=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(n){return n.replace(ng,rg)}const ig=new Map;function rg(n,e){let t=ze[e];if(t===void 0){const i=ig.get(e);if(i!==void 0)t=ze[i],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Va(t)}const sg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yl(n){return n.replace(sg,ag)}function ag(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function El(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}const og={[kr]:"SHADOWMAP_TYPE_PCF",[Qi]:"SHADOWMAP_TYPE_VSM"};function lg(n){return og[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const cg={[oi]:"ENVMAP_TYPE_CUBE",[Ni]:"ENVMAP_TYPE_CUBE",[ts]:"ENVMAP_TYPE_CUBE_UV"};function ug(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":cg[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const dg={[Ni]:"ENVMAP_MODE_REFRACTION"};function hg(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":dg[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const fg={[Hl]:"ENVMAP_BLENDING_MULTIPLY",[Yu]:"ENVMAP_BLENDING_MIX",[$u]:"ENVMAP_BLENDING_ADD"};function pg(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":fg[n.combine]||"ENVMAP_BLENDING_NONE"}function mg(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function gg(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=lg(t),l=ug(t),u=hg(t),d=pg(t),f=mg(t),p=Qm(t),_=eg(s),v=r.createProgram();let m,h,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(er).join(`
`),m.length>0&&(m+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(er).join(`
`),h.length>0&&(h+=`
`)):(m=[El(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(er).join(`
`),h=[El(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==hn?"#define TONE_MAPPING":"",t.toneMapping!==hn?ze.tonemapping_pars_fragment:"",t.toneMapping!==hn?jm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,$m("linearToOutputTexel",t.outputColorSpace),Jm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(er).join(`
`)),a=Va(a),a=bl(a,t),a=Sl(a,t),o=Va(o),o=bl(o,t),o=Sl(o,t),a=yl(a),o=yl(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,h=["#define varying in",t.glslVersion===Po?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Po?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const T=E+m+a,y=E+h+o,w=vl(r,r.VERTEX_SHADER,T),A=vl(r,r.FRAGMENT_SHADER,y);r.attachShader(v,w),r.attachShader(v,A),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(P){if(n.debug.checkShaderErrors){const F=r.getProgramInfoLog(v)||"",U=r.getShaderInfoLog(w)||"",V=r.getShaderInfoLog(A)||"",q=F.trim(),k=U.trim(),W=V.trim();let $=!0,ie=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,w,A);else{const ee=Ml(r,w,"vertex"),he=Ml(r,A,"fragment");Je("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+q+`
`+ee+`
`+he)}else q!==""?Le("WebGLProgram: Program Info Log:",q):(k===""||W==="")&&(ie=!1);ie&&(P.diagnostics={runnable:$,programLog:q,vertexShader:{log:k,prefix:m},fragmentShader:{log:W,prefix:h}})}r.deleteShader(w),r.deleteShader(A),O=new Kr(r,v),x=tg(r,v)}let O;this.getUniforms=function(){return O===void 0&&R(this),O};let x;this.getAttributes=function(){return x===void 0&&R(this),x};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(v,Xm)),b},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qm++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=A,this}let _g=0;class vg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new xg(e),t.set(e,i)),i}}class xg{constructor(e){this.id=_g++,this.code=e,this.usedTimes=0}}function Mg(n,e,t,i,r,s,a){const o=new oc,c=new vg,l=new Set,u=[],d=new Map,f=r.logarithmicDepthBuffer;let p=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,b,P,F,U){const V=F.fog,q=U.geometry,k=x.isMeshStandardMaterial?F.environment:null,W=(x.isMeshStandardMaterial?t:e).get(x.envMap||k),$=W&&W.mapping===ts?W.image.height:null,ie=_[x.type];x.precision!==null&&(p=r.getMaxPrecision(x.precision),p!==x.precision&&Le("WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const ee=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,he=ee!==void 0?ee.length:0;let Ue=0;q.morphAttributes.position!==void 0&&(Ue=1),q.morphAttributes.normal!==void 0&&(Ue=2),q.morphAttributes.color!==void 0&&(Ue=3);let Fe,at,Qe,K;if(ie){const tt=cn[ie];Fe=tt.vertexShader,at=tt.fragmentShader}else Fe=x.vertexShader,at=x.fragmentShader,c.update(x),Qe=c.getVertexShaderID(x),K=c.getFragmentShaderID(x);const j=n.getRenderTarget(),pe=n.state.buffers.depth.getReversed(),Te=U.isInstancedMesh===!0,ge=U.isBatchedMesh===!0,Oe=!!x.map,ut=!!x.matcap,ke=!!W,We=!!x.aoMap,Ke=!!x.lightMap,Ae=!!x.bumpMap,Ye=!!x.normalMap,C=!!x.displacementMap,$e=!!x.emissiveMap,qe=!!x.metalnessMap,et=!!x.roughnessMap,xe=x.anisotropy>0,S=x.clearcoat>0,g=x.dispersion>0,L=x.iridescence>0,Y=x.sheen>0,J=x.transmission>0,X=xe&&!!x.anisotropyMap,ye=S&&!!x.clearcoatMap,ae=S&&!!x.clearcoatNormalMap,be=S&&!!x.clearcoatRoughnessMap,De=L&&!!x.iridescenceMap,te=L&&!!x.iridescenceThicknessMap,le=Y&&!!x.sheenColorMap,Me=Y&&!!x.sheenRoughnessMap,Se=!!x.specularMap,oe=!!x.specularColorMap,Ge=!!x.specularIntensityMap,D=J&&!!x.transmissionMap,fe=J&&!!x.thicknessMap,re=!!x.gradientMap,me=!!x.alphaMap,Q=x.alphaTest>0,Z=!!x.alphaHash,se=!!x.extensions;let Ie=hn;x.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ie=n.toneMapping);const lt={shaderID:ie,shaderType:x.type,shaderName:x.name,vertexShader:Fe,fragmentShader:at,defines:x.defines,customVertexShaderID:Qe,customFragmentShaderID:K,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:ge,batchingColor:ge&&U._colorsTexture!==null,instancing:Te,instancingColor:Te&&U.instanceColor!==null,instancingMorph:Te&&U.morphTexture!==null,outputColorSpace:j===null?n.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Oi,alphaToCoverage:!!x.alphaToCoverage,map:Oe,matcap:ut,envMap:ke,envMapMode:ke&&W.mapping,envMapCubeUVHeight:$,aoMap:We,lightMap:Ke,bumpMap:Ae,normalMap:Ye,displacementMap:C,emissiveMap:$e,normalMapObjectSpace:Ye&&x.normalMapType===Ju,normalMapTangentSpace:Ye&&x.normalMapType===rc,metalnessMap:qe,roughnessMap:et,anisotropy:xe,anisotropyMap:X,clearcoat:S,clearcoatMap:ye,clearcoatNormalMap:ae,clearcoatRoughnessMap:be,dispersion:g,iridescence:L,iridescenceMap:De,iridescenceThicknessMap:te,sheen:Y,sheenColorMap:le,sheenRoughnessMap:Me,specularMap:Se,specularColorMap:oe,specularIntensityMap:Ge,transmission:J,transmissionMap:D,thicknessMap:fe,gradientMap:re,opaque:x.transparent===!1&&x.blending===Li&&x.alphaToCoverage===!1,alphaMap:me,alphaTest:Q,alphaHash:Z,combine:x.combine,mapUv:Oe&&v(x.map.channel),aoMapUv:We&&v(x.aoMap.channel),lightMapUv:Ke&&v(x.lightMap.channel),bumpMapUv:Ae&&v(x.bumpMap.channel),normalMapUv:Ye&&v(x.normalMap.channel),displacementMapUv:C&&v(x.displacementMap.channel),emissiveMapUv:$e&&v(x.emissiveMap.channel),metalnessMapUv:qe&&v(x.metalnessMap.channel),roughnessMapUv:et&&v(x.roughnessMap.channel),anisotropyMapUv:X&&v(x.anisotropyMap.channel),clearcoatMapUv:ye&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:ae&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:De&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:te&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:le&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Me&&v(x.sheenRoughnessMap.channel),specularMapUv:Se&&v(x.specularMap.channel),specularColorMapUv:oe&&v(x.specularColorMap.channel),specularIntensityMapUv:Ge&&v(x.specularIntensityMap.channel),transmissionMapUv:D&&v(x.transmissionMap.channel),thicknessMapUv:fe&&v(x.thicknessMap.channel),alphaMapUv:me&&v(x.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ye||xe),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!q.attributes.uv&&(Oe||me),fog:!!V,useFog:x.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:pe,skinning:U.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:Ue,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ie,decodeVideoTexture:Oe&&x.map.isVideoTexture===!0&&Ze.getTransfer(x.map.colorSpace)===it,decodeVideoTextureEmissive:$e&&x.emissiveMap.isVideoTexture===!0&&Ze.getTransfer(x.emissiveMap.colorSpace)===it,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===yn,flipSided:x.side===kt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:se&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(se&&x.extensions.multiDraw===!0||ge)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return lt.vertexUv1s=l.has(1),lt.vertexUv2s=l.has(2),lt.vertexUv3s=l.has(3),l.clear(),lt}function h(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const P in x.defines)b.push(P),b.push(x.defines[P]);return x.isRawShaderMaterial===!1&&(E(b,x),T(b,x),b.push(n.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function E(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function T(x,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),x.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),x.push(o.mask)}function y(x){const b=_[x.type];let P;if(b){const F=cn[b];P=wd.clone(F.uniforms)}else P=x.uniforms;return P}function w(x,b){let P=d.get(b);return P!==void 0?++P.usedTimes:(P=new gg(n,b,x,s),u.push(P),d.set(b,P)),P}function A(x){if(--x.usedTimes===0){const b=u.indexOf(x);u[b]=u[u.length-1],u.pop(),d.delete(x.cacheKey),x.destroy()}}function R(x){c.remove(x)}function O(){c.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:y,acquireProgram:w,releaseProgram:A,releaseShaderCache:R,programs:u,dispose:O}}function bg(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,c){n.get(a)[o]=c}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function Sg(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Tl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Al(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(d,f,p,_,v,m){let h=n[e];return h===void 0?(h={id:d.id,object:d,geometry:f,material:p,groupOrder:_,renderOrder:d.renderOrder,z:v,group:m},n[e]=h):(h.id=d.id,h.object=d,h.geometry=f,h.material=p,h.groupOrder=_,h.renderOrder=d.renderOrder,h.z=v,h.group=m),e++,h}function o(d,f,p,_,v,m){const h=a(d,f,p,_,v,m);p.transmission>0?i.push(h):p.transparent===!0?r.push(h):t.push(h)}function c(d,f,p,_,v,m){const h=a(d,f,p,_,v,m);p.transmission>0?i.unshift(h):p.transparent===!0?r.unshift(h):t.unshift(h)}function l(d,f){t.length>1&&t.sort(d||Sg),i.length>1&&i.sort(f||Tl),r.length>1&&r.sort(f||Tl)}function u(){for(let d=e,f=n.length;d<f;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:c,finish:u,sort:l}}function yg(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new Al,n.set(i,[a])):r>=s.length?(a=new Al,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Eg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Xe};break;case"SpotLight":t={position:new N,direction:new N,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new N,halfWidth:new N,halfHeight:new N};break}return n[e.id]=t,t}}}function Tg(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Ag=0;function wg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Cg(n){const e=new Eg,t=Tg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);const r=new N,s=new ht,a=new ht;function o(l){let u=0,d=0,f=0;for(let x=0;x<9;x++)i.probe[x].set(0,0,0);let p=0,_=0,v=0,m=0,h=0,E=0,T=0,y=0,w=0,A=0,R=0;l.sort(wg);for(let x=0,b=l.length;x<b;x++){const P=l[x],F=P.color,U=P.intensity,V=P.distance;let q=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Fi?q=P.shadow.map.texture:q=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=F.r*U,d+=F.g*U,f+=F.b*U;else if(P.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(P.sh.coefficients[k],U);R++}else if(P.isDirectionalLight){const k=e.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const W=P.shadow,$=t.get(P);$.shadowIntensity=W.intensity,$.shadowBias=W.bias,$.shadowNormalBias=W.normalBias,$.shadowRadius=W.radius,$.shadowMapSize=W.mapSize,i.directionalShadow[p]=$,i.directionalShadowMap[p]=q,i.directionalShadowMatrix[p]=P.shadow.matrix,E++}i.directional[p]=k,p++}else if(P.isSpotLight){const k=e.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(F).multiplyScalar(U),k.distance=V,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,i.spot[v]=k;const W=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,W.updateMatrices(P),P.castShadow&&A++),i.spotLightMatrix[v]=W.matrix,P.castShadow){const $=t.get(P);$.shadowIntensity=W.intensity,$.shadowBias=W.bias,$.shadowNormalBias=W.normalBias,$.shadowRadius=W.radius,$.shadowMapSize=W.mapSize,i.spotShadow[v]=$,i.spotShadowMap[v]=q,y++}v++}else if(P.isRectAreaLight){const k=e.get(P);k.color.copy(F).multiplyScalar(U),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=k,m++}else if(P.isPointLight){const k=e.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const W=P.shadow,$=t.get(P);$.shadowIntensity=W.intensity,$.shadowBias=W.bias,$.shadowNormalBias=W.normalBias,$.shadowRadius=W.radius,$.shadowMapSize=W.mapSize,$.shadowCameraNear=W.camera.near,$.shadowCameraFar=W.camera.far,i.pointShadow[_]=$,i.pointShadowMap[_]=q,i.pointShadowMatrix[_]=P.shadow.matrix,T++}i.point[_]=k,_++}else if(P.isHemisphereLight){const k=e.get(P);k.skyColor.copy(P.color).multiplyScalar(U),k.groundColor.copy(P.groundColor).multiplyScalar(U),i.hemi[h]=k,h++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const O=i.hash;(O.directionalLength!==p||O.pointLength!==_||O.spotLength!==v||O.rectAreaLength!==m||O.hemiLength!==h||O.numDirectionalShadows!==E||O.numPointShadows!==T||O.numSpotShadows!==y||O.numSpotMaps!==w||O.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=h,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=y+w-A,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,O.directionalLength=p,O.pointLength=_,O.spotLength=v,O.rectAreaLength=m,O.hemiLength=h,O.numDirectionalShadows=E,O.numPointShadows=T,O.numSpotShadows=y,O.numSpotMaps=w,O.numLightProbes=R,i.version=Ag++)}function c(l,u){let d=0,f=0,p=0,_=0,v=0;const m=u.matrixWorldInverse;for(let h=0,E=l.length;h<E;h++){const T=l[h];if(T.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),d++}else if(T.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),p++}else if(T.isRectAreaLight){const y=i.rectArea[_];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),a.identity(),s.copy(T.matrixWorld),s.premultiply(m),a.extractRotation(s),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),_++}else if(T.isPointLight){const y=i.point[f];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),f++}else if(T.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:o,setupView:c,state:i}}function wl(n){const e=new Cg(n),t=[],i=[];function r(u){l.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function Rg(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new wl(n),e.set(r,[o])):s>=a.length?(o=new wl(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const Pg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Lg=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],Ig=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],Cl=new ht,Zi=new N,Vs=new N;function Ug(n,e,t){let i=new lo;const r=new Ne,s=new Ne,a=new mt,o=new Hd,c=new Vd,l={},u=t.maxTextureSize,d={[Hn]:kt,[kt]:Hn,[yn]:yn},f=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:Pg,fragmentShader:Dg}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Lt;_.setAttribute("position",new Jt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Dt(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kr;let h=this.type;this.render=function(A,R,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;A.type===Ru&&(Le("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),A.type=kr);const x=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Tn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const U=h!==this.type;U&&R.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(q=>q.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,q=A.length;V<q;V++){const k=A[V],W=k.shadow;if(W===void 0){Le("WebGLShadowMap:",k,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const $=W.getFrameExtents();if(r.multiply($),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/$.x),r.x=s.x*$.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/$.y),r.y=s.y*$.y,W.mapSize.y=s.y)),W.map===null||U===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===Qi){if(k.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new fn(r.x,r.y,{format:Fi,type:wn,minFilter:Rt,magFilter:Rt,generateMipmaps:!1}),W.map.texture.name=k.name+".shadowMap",W.map.depthTexture=new ar(r.x,r.y,un),W.map.depthTexture.name=k.name+".shadowMapDepth",W.map.depthTexture.format=Cn,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=At,W.map.depthTexture.magFilter=At}else{k.isPointLight?(W.map=new pc(r.x),W.map.depthTexture=new Gd(r.x,pn)):(W.map=new fn(r.x,r.y),W.map.depthTexture=new ar(r.x,r.y,pn)),W.map.depthTexture.name=k.name+".shadowMap",W.map.depthTexture.format=Cn;const ee=n.state.buffers.depth.getReversed();this.type===kr?(W.map.depthTexture.compareFunction=ee?ao:so,W.map.depthTexture.minFilter=Rt,W.map.depthTexture.magFilter=Rt):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=At,W.map.depthTexture.magFilter=At)}W.camera.updateProjectionMatrix()}const ie=W.map.isWebGLCubeRenderTarget?6:1;for(let ee=0;ee<ie;ee++){if(W.map.isWebGLCubeRenderTarget)n.setRenderTarget(W.map,ee),n.clear();else{ee===0&&(n.setRenderTarget(W.map),n.clear());const he=W.getViewport(ee);a.set(s.x*he.x,s.y*he.y,s.x*he.z,s.y*he.w),F.viewport(a)}if(k.isPointLight){const he=W.camera,Ue=W.matrix,Fe=k.distance||he.far;Fe!==he.far&&(he.far=Fe,he.updateProjectionMatrix()),Zi.setFromMatrixPosition(k.matrixWorld),he.position.copy(Zi),Vs.copy(he.position),Vs.add(Lg[ee]),he.up.copy(Ig[ee]),he.lookAt(Vs),he.updateMatrixWorld(),Ue.makeTranslation(-Zi.x,-Zi.y,-Zi.z),Cl.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),W._frustum.setFromProjectionMatrix(Cl,he.coordinateSystem,he.reversedDepth)}else W.updateMatrices(k);i=W.getFrustum(),y(R,O,W.camera,k,this.type)}W.isPointLightShadow!==!0&&this.type===Qi&&E(W,O),W.needsUpdate=!1}h=this.type,m.needsUpdate=!1,n.setRenderTarget(x,b,P)};function E(A,R){const O=e.update(v);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new fn(r.x,r.y,{format:Fi,type:wn})),f.uniforms.shadow_pass.value=A.map.depthTexture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(R,null,O,f,v,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(R,null,O,p,v,null)}function T(A,R,O,x){let b=null;const P=O.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)b=P;else if(b=O.isPointLight===!0?c:o,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=b.uuid,U=R.uuid;let V=l[F];V===void 0&&(V={},l[F]=V);let q=V[U];q===void 0&&(q=b.clone(),V[U]=q,R.addEventListener("dispose",w)),b=q}if(b.visible=R.visible,b.wireframe=R.wireframe,x===Qi?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:d[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,O.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const F=n.properties.get(b);F.light=O}return b}function y(A,R,O,x,b){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===Qi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,A.matrixWorld);const U=e.update(A),V=A.material;if(Array.isArray(V)){const q=U.groups;for(let k=0,W=q.length;k<W;k++){const $=q[k],ie=V[$.materialIndex];if(ie&&ie.visible){const ee=T(A,ie,x,b);A.onBeforeShadow(n,A,R,O,U,ee,$),n.renderBufferDirect(O,null,U,ee,A,$),A.onAfterShadow(n,A,R,O,U,ee,$)}}}else if(V.visible){const q=T(A,V,x,b);A.onBeforeShadow(n,A,R,O,U,q,null),n.renderBufferDirect(O,null,U,q,A,null),A.onAfterShadow(n,A,R,O,U,q,null)}}const F=A.children;for(let U=0,V=F.length;U<V;U++)y(F[U],R,O,x,b)}function w(A){A.target.removeEventListener("dispose",w);for(const O in l){const x=l[O],b=A.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const Ng={[js]:Js,[Qs]:na,[ea]:ia,[Ui]:ta,[Js]:js,[na]:Qs,[ia]:ea,[ta]:Ui};function Fg(n,e){function t(){let D=!1;const fe=new mt;let re=null;const me=new mt(0,0,0,0);return{setMask:function(Q){re!==Q&&!D&&(n.colorMask(Q,Q,Q,Q),re=Q)},setLocked:function(Q){D=Q},setClear:function(Q,Z,se,Ie,lt){lt===!0&&(Q*=Ie,Z*=Ie,se*=Ie),fe.set(Q,Z,se,Ie),me.equals(fe)===!1&&(n.clearColor(Q,Z,se,Ie),me.copy(fe))},reset:function(){D=!1,re=null,me.set(-1,0,0,0)}}}function i(){let D=!1,fe=!1,re=null,me=null,Q=null;return{setReversed:function(Z){if(fe!==Z){const se=e.get("EXT_clip_control");Z?se.clipControlEXT(se.LOWER_LEFT_EXT,se.ZERO_TO_ONE_EXT):se.clipControlEXT(se.LOWER_LEFT_EXT,se.NEGATIVE_ONE_TO_ONE_EXT),fe=Z;const Ie=Q;Q=null,this.setClear(Ie)}},getReversed:function(){return fe},setTest:function(Z){Z?j(n.DEPTH_TEST):pe(n.DEPTH_TEST)},setMask:function(Z){re!==Z&&!D&&(n.depthMask(Z),re=Z)},setFunc:function(Z){if(fe&&(Z=Ng[Z]),me!==Z){switch(Z){case js:n.depthFunc(n.NEVER);break;case Js:n.depthFunc(n.ALWAYS);break;case Qs:n.depthFunc(n.LESS);break;case Ui:n.depthFunc(n.LEQUAL);break;case ea:n.depthFunc(n.EQUAL);break;case ta:n.depthFunc(n.GEQUAL);break;case na:n.depthFunc(n.GREATER);break;case ia:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}me=Z}},setLocked:function(Z){D=Z},setClear:function(Z){Q!==Z&&(fe&&(Z=1-Z),n.clearDepth(Z),Q=Z)},reset:function(){D=!1,re=null,me=null,Q=null,fe=!1}}}function r(){let D=!1,fe=null,re=null,me=null,Q=null,Z=null,se=null,Ie=null,lt=null;return{setTest:function(tt){D||(tt?j(n.STENCIL_TEST):pe(n.STENCIL_TEST))},setMask:function(tt){fe!==tt&&!D&&(n.stencilMask(tt),fe=tt)},setFunc:function(tt,on,_n){(re!==tt||me!==on||Q!==_n)&&(n.stencilFunc(tt,on,_n),re=tt,me=on,Q=_n)},setOp:function(tt,on,_n){(Z!==tt||se!==on||Ie!==_n)&&(n.stencilOp(tt,on,_n),Z=tt,se=on,Ie=_n)},setLocked:function(tt){D=tt},setClear:function(tt){lt!==tt&&(n.clearStencil(tt),lt=tt)},reset:function(){D=!1,fe=null,re=null,me=null,Q=null,Z=null,se=null,Ie=null,lt=null}}}const s=new t,a=new i,o=new r,c=new WeakMap,l=new WeakMap;let u={},d={},f=new WeakMap,p=[],_=null,v=!1,m=null,h=null,E=null,T=null,y=null,w=null,A=null,R=new Xe(0,0,0),O=0,x=!1,b=null,P=null,F=null,U=null,V=null;const q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,W=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec($)[1]),k=W>=1):$.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),k=W>=2);let ie=null,ee={};const he=n.getParameter(n.SCISSOR_BOX),Ue=n.getParameter(n.VIEWPORT),Fe=new mt().fromArray(he),at=new mt().fromArray(Ue);function Qe(D,fe,re,me){const Q=new Uint8Array(4),Z=n.createTexture();n.bindTexture(D,Z),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let se=0;se<re;se++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(fe,0,n.RGBA,1,1,me,0,n.RGBA,n.UNSIGNED_BYTE,Q):n.texImage2D(fe+se,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Q);return Z}const K={};K[n.TEXTURE_2D]=Qe(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=Qe(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=Qe(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=Qe(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),j(n.DEPTH_TEST),a.setFunc(Ui),Ae(!1),Ye(Eo),j(n.CULL_FACE),We(Tn);function j(D){u[D]!==!0&&(n.enable(D),u[D]=!0)}function pe(D){u[D]!==!1&&(n.disable(D),u[D]=!1)}function Te(D,fe){return d[D]!==fe?(n.bindFramebuffer(D,fe),d[D]=fe,D===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=fe),D===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=fe),!0):!1}function ge(D,fe){let re=p,me=!1;if(D){re=f.get(fe),re===void 0&&(re=[],f.set(fe,re));const Q=D.textures;if(re.length!==Q.length||re[0]!==n.COLOR_ATTACHMENT0){for(let Z=0,se=Q.length;Z<se;Z++)re[Z]=n.COLOR_ATTACHMENT0+Z;re.length=Q.length,me=!0}}else re[0]!==n.BACK&&(re[0]=n.BACK,me=!0);me&&n.drawBuffers(re)}function Oe(D){return _!==D?(n.useProgram(D),_=D,!0):!1}const ut={[Jn]:n.FUNC_ADD,[Du]:n.FUNC_SUBTRACT,[Lu]:n.FUNC_REVERSE_SUBTRACT};ut[Iu]=n.MIN,ut[Uu]=n.MAX;const ke={[Nu]:n.ZERO,[Fu]:n.ONE,[Ou]:n.SRC_COLOR,[$s]:n.SRC_ALPHA,[Vu]:n.SRC_ALPHA_SATURATE,[ku]:n.DST_COLOR,[zu]:n.DST_ALPHA,[Bu]:n.ONE_MINUS_SRC_COLOR,[Zs]:n.ONE_MINUS_SRC_ALPHA,[Hu]:n.ONE_MINUS_DST_COLOR,[Gu]:n.ONE_MINUS_DST_ALPHA,[Wu]:n.CONSTANT_COLOR,[Xu]:n.ONE_MINUS_CONSTANT_COLOR,[qu]:n.CONSTANT_ALPHA,[Ku]:n.ONE_MINUS_CONSTANT_ALPHA};function We(D,fe,re,me,Q,Z,se,Ie,lt,tt){if(D===Tn){v===!0&&(pe(n.BLEND),v=!1);return}if(v===!1&&(j(n.BLEND),v=!0),D!==Pu){if(D!==m||tt!==x){if((h!==Jn||y!==Jn)&&(n.blendEquation(n.FUNC_ADD),h=Jn,y=Jn),tt)switch(D){case Li:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case To:n.blendFunc(n.ONE,n.ONE);break;case Ao:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case wo:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:Je("WebGLState: Invalid blending: ",D);break}else switch(D){case Li:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case To:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ao:Je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wo:Je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Je("WebGLState: Invalid blending: ",D);break}E=null,T=null,w=null,A=null,R.set(0,0,0),O=0,m=D,x=tt}return}Q=Q||fe,Z=Z||re,se=se||me,(fe!==h||Q!==y)&&(n.blendEquationSeparate(ut[fe],ut[Q]),h=fe,y=Q),(re!==E||me!==T||Z!==w||se!==A)&&(n.blendFuncSeparate(ke[re],ke[me],ke[Z],ke[se]),E=re,T=me,w=Z,A=se),(Ie.equals(R)===!1||lt!==O)&&(n.blendColor(Ie.r,Ie.g,Ie.b,lt),R.copy(Ie),O=lt),m=D,x=!1}function Ke(D,fe){D.side===yn?pe(n.CULL_FACE):j(n.CULL_FACE);let re=D.side===kt;fe&&(re=!re),Ae(re),D.blending===Li&&D.transparent===!1?We(Tn):We(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const me=D.stencilWrite;o.setTest(me),me&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),$e(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?j(n.SAMPLE_ALPHA_TO_COVERAGE):pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ae(D){b!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),b=D)}function Ye(D){D!==wu?(j(n.CULL_FACE),D!==P&&(D===Eo?n.cullFace(n.BACK):D===Cu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):pe(n.CULL_FACE),P=D}function C(D){D!==F&&(k&&n.lineWidth(D),F=D)}function $e(D,fe,re){D?(j(n.POLYGON_OFFSET_FILL),(U!==fe||V!==re)&&(n.polygonOffset(fe,re),U=fe,V=re)):pe(n.POLYGON_OFFSET_FILL)}function qe(D){D?j(n.SCISSOR_TEST):pe(n.SCISSOR_TEST)}function et(D){D===void 0&&(D=n.TEXTURE0+q-1),ie!==D&&(n.activeTexture(D),ie=D)}function xe(D,fe,re){re===void 0&&(ie===null?re=n.TEXTURE0+q-1:re=ie);let me=ee[re];me===void 0&&(me={type:void 0,texture:void 0},ee[re]=me),(me.type!==D||me.texture!==fe)&&(ie!==re&&(n.activeTexture(re),ie=re),n.bindTexture(D,fe||K[D]),me.type=D,me.texture=fe)}function S(){const D=ee[ie];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function g(){try{n.compressedTexImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function L(){try{n.compressedTexImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function Y(){try{n.texSubImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function J(){try{n.texSubImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function X(){try{n.compressedTexSubImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function ye(){try{n.compressedTexSubImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function ae(){try{n.texStorage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function be(){try{n.texStorage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function De(){try{n.texImage2D(...arguments)}catch(D){Je("WebGLState:",D)}}function te(){try{n.texImage3D(...arguments)}catch(D){Je("WebGLState:",D)}}function le(D){Fe.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),Fe.copy(D))}function Me(D){at.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),at.copy(D))}function Se(D,fe){let re=l.get(fe);re===void 0&&(re=new WeakMap,l.set(fe,re));let me=re.get(D);me===void 0&&(me=n.getUniformBlockIndex(fe,D.name),re.set(D,me))}function oe(D,fe){const me=l.get(fe).get(D);c.get(fe)!==me&&(n.uniformBlockBinding(fe,me,D.__bindingPointIndex),c.set(fe,me))}function Ge(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ie=null,ee={},d={},f=new WeakMap,p=[],_=null,v=!1,m=null,h=null,E=null,T=null,y=null,w=null,A=null,R=new Xe(0,0,0),O=0,x=!1,b=null,P=null,F=null,U=null,V=null,Fe.set(0,0,n.canvas.width,n.canvas.height),at.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:j,disable:pe,bindFramebuffer:Te,drawBuffers:ge,useProgram:Oe,setBlending:We,setMaterial:Ke,setFlipSided:Ae,setCullFace:Ye,setLineWidth:C,setPolygonOffset:$e,setScissorTest:qe,activeTexture:et,bindTexture:xe,unbindTexture:S,compressedTexImage2D:g,compressedTexImage3D:L,texImage2D:De,texImage3D:te,updateUBOMapping:Se,uniformBlockBinding:oe,texStorage2D:ae,texStorage3D:be,texSubImage2D:Y,texSubImage3D:J,compressedTexSubImage2D:X,compressedTexSubImage3D:ye,scissor:le,viewport:Me,reset:Ge}}function Og(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ne,u=new WeakMap;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(S,g){return p?new OffscreenCanvas(S,g):jr("canvas")}function v(S,g,L){let Y=1;const J=xe(S);if((J.width>L||J.height>L)&&(Y=L/Math.max(J.width,J.height)),Y<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){const X=Math.floor(Y*J.width),ye=Math.floor(Y*J.height);d===void 0&&(d=_(X,ye));const ae=g?_(X,ye):d;return ae.width=X,ae.height=ye,ae.getContext("2d").drawImage(S,0,0,X,ye),Le("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+X+"x"+ye+")."),ae}else return"data"in S&&Le("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),S;return S}function m(S){return S.generateMipmaps}function h(S){n.generateMipmap(S)}function E(S){return S.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?n.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function T(S,g,L,Y,J=!1){if(S!==null){if(n[S]!==void 0)return n[S];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let X=g;if(g===n.RED&&(L===n.FLOAT&&(X=n.R32F),L===n.HALF_FLOAT&&(X=n.R16F),L===n.UNSIGNED_BYTE&&(X=n.R8)),g===n.RED_INTEGER&&(L===n.UNSIGNED_BYTE&&(X=n.R8UI),L===n.UNSIGNED_SHORT&&(X=n.R16UI),L===n.UNSIGNED_INT&&(X=n.R32UI),L===n.BYTE&&(X=n.R8I),L===n.SHORT&&(X=n.R16I),L===n.INT&&(X=n.R32I)),g===n.RG&&(L===n.FLOAT&&(X=n.RG32F),L===n.HALF_FLOAT&&(X=n.RG16F),L===n.UNSIGNED_BYTE&&(X=n.RG8)),g===n.RG_INTEGER&&(L===n.UNSIGNED_BYTE&&(X=n.RG8UI),L===n.UNSIGNED_SHORT&&(X=n.RG16UI),L===n.UNSIGNED_INT&&(X=n.RG32UI),L===n.BYTE&&(X=n.RG8I),L===n.SHORT&&(X=n.RG16I),L===n.INT&&(X=n.RG32I)),g===n.RGB_INTEGER&&(L===n.UNSIGNED_BYTE&&(X=n.RGB8UI),L===n.UNSIGNED_SHORT&&(X=n.RGB16UI),L===n.UNSIGNED_INT&&(X=n.RGB32UI),L===n.BYTE&&(X=n.RGB8I),L===n.SHORT&&(X=n.RGB16I),L===n.INT&&(X=n.RGB32I)),g===n.RGBA_INTEGER&&(L===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),L===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),L===n.UNSIGNED_INT&&(X=n.RGBA32UI),L===n.BYTE&&(X=n.RGBA8I),L===n.SHORT&&(X=n.RGBA16I),L===n.INT&&(X=n.RGBA32I)),g===n.RGB&&(L===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),L===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),g===n.RGBA){const ye=J?$r:Ze.getTransfer(Y);L===n.FLOAT&&(X=n.RGBA32F),L===n.HALF_FLOAT&&(X=n.RGBA16F),L===n.UNSIGNED_BYTE&&(X=ye===it?n.SRGB8_ALPHA8:n.RGBA8),L===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),L===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function y(S,g){let L;return S?g===null||g===pn||g===rr?L=n.DEPTH24_STENCIL8:g===un?L=n.DEPTH32F_STENCIL8:g===ir&&(L=n.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===pn||g===rr?L=n.DEPTH_COMPONENT24:g===un?L=n.DEPTH_COMPONENT32F:g===ir&&(L=n.DEPTH_COMPONENT16),L}function w(S,g){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==At&&S.minFilter!==Rt?Math.log2(Math.max(g.width,g.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?g.mipmaps.length:1}function A(S){const g=S.target;g.removeEventListener("dispose",A),O(g),g.isVideoTexture&&u.delete(g)}function R(S){const g=S.target;g.removeEventListener("dispose",R),b(g)}function O(S){const g=i.get(S);if(g.__webglInit===void 0)return;const L=S.source,Y=f.get(L);if(Y){const J=Y[g.__cacheKey];J.usedTimes--,J.usedTimes===0&&x(S),Object.keys(Y).length===0&&f.delete(L)}i.remove(S)}function x(S){const g=i.get(S);n.deleteTexture(g.__webglTexture);const L=S.source,Y=f.get(L);delete Y[g.__cacheKey],a.memory.textures--}function b(S){const g=i.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),i.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(g.__webglFramebuffer[Y]))for(let J=0;J<g.__webglFramebuffer[Y].length;J++)n.deleteFramebuffer(g.__webglFramebuffer[Y][J]);else n.deleteFramebuffer(g.__webglFramebuffer[Y]);g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer[Y])}else{if(Array.isArray(g.__webglFramebuffer))for(let Y=0;Y<g.__webglFramebuffer.length;Y++)n.deleteFramebuffer(g.__webglFramebuffer[Y]);else n.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&n.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&n.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let Y=0;Y<g.__webglColorRenderbuffer.length;Y++)g.__webglColorRenderbuffer[Y]&&n.deleteRenderbuffer(g.__webglColorRenderbuffer[Y]);g.__webglDepthRenderbuffer&&n.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const L=S.textures;for(let Y=0,J=L.length;Y<J;Y++){const X=i.get(L[Y]);X.__webglTexture&&(n.deleteTexture(X.__webglTexture),a.memory.textures--),i.remove(L[Y])}i.remove(S)}let P=0;function F(){P=0}function U(){const S=P;return S>=r.maxTextures&&Le("WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+r.maxTextures),P+=1,S}function V(S){const g=[];return g.push(S.wrapS),g.push(S.wrapT),g.push(S.wrapR||0),g.push(S.magFilter),g.push(S.minFilter),g.push(S.anisotropy),g.push(S.internalFormat),g.push(S.format),g.push(S.type),g.push(S.generateMipmaps),g.push(S.premultiplyAlpha),g.push(S.flipY),g.push(S.unpackAlignment),g.push(S.colorSpace),g.join()}function q(S,g){const L=i.get(S);if(S.isVideoTexture&&qe(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&L.__version!==S.version){const Y=S.image;if(Y===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{K(L,S,g);return}}else S.isExternalTexture&&(L.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,L.__webglTexture,n.TEXTURE0+g)}function k(S,g){const L=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&L.__version!==S.version){K(L,S,g);return}else S.isExternalTexture&&(L.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,L.__webglTexture,n.TEXTURE0+g)}function W(S,g){const L=i.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&L.__version!==S.version){K(L,S,g);return}t.bindTexture(n.TEXTURE_3D,L.__webglTexture,n.TEXTURE0+g)}function $(S,g){const L=i.get(S);if(S.isCubeDepthTexture!==!0&&S.version>0&&L.__version!==S.version){j(L,S,g);return}t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+g)}const ie={[aa]:n.REPEAT,[En]:n.CLAMP_TO_EDGE,[oa]:n.MIRRORED_REPEAT},ee={[At]:n.NEAREST,[Zu]:n.NEAREST_MIPMAP_NEAREST,[gr]:n.NEAREST_MIPMAP_LINEAR,[Rt]:n.LINEAR,[hs]:n.LINEAR_MIPMAP_NEAREST,[ii]:n.LINEAR_MIPMAP_LINEAR},he={[Qu]:n.NEVER,[rd]:n.ALWAYS,[ed]:n.LESS,[so]:n.LEQUAL,[td]:n.EQUAL,[ao]:n.GEQUAL,[nd]:n.GREATER,[id]:n.NOTEQUAL};function Ue(S,g){if(g.type===un&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Rt||g.magFilter===hs||g.magFilter===gr||g.magFilter===ii||g.minFilter===Rt||g.minFilter===hs||g.minFilter===gr||g.minFilter===ii)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(S,n.TEXTURE_WRAP_S,ie[g.wrapS]),n.texParameteri(S,n.TEXTURE_WRAP_T,ie[g.wrapT]),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,ie[g.wrapR]),n.texParameteri(S,n.TEXTURE_MAG_FILTER,ee[g.magFilter]),n.texParameteri(S,n.TEXTURE_MIN_FILTER,ee[g.minFilter]),g.compareFunction&&(n.texParameteri(S,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(S,n.TEXTURE_COMPARE_FUNC,he[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===At||g.minFilter!==gr&&g.minFilter!==ii||g.type===un&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){const L=e.get("EXT_texture_filter_anisotropic");n.texParameterf(S,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function Fe(S,g){let L=!1;S.__webglInit===void 0&&(S.__webglInit=!0,g.addEventListener("dispose",A));const Y=g.source;let J=f.get(Y);J===void 0&&(J={},f.set(Y,J));const X=V(g);if(X!==S.__cacheKey){J[X]===void 0&&(J[X]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,L=!0),J[X].usedTimes++;const ye=J[S.__cacheKey];ye!==void 0&&(J[S.__cacheKey].usedTimes--,ye.usedTimes===0&&x(g)),S.__cacheKey=X,S.__webglTexture=J[X].texture}return L}function at(S,g,L){return Math.floor(Math.floor(S/L)/g)}function Qe(S,g,L,Y){const X=S.updateRanges;if(X.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,g.width,g.height,L,Y,g.data);else{X.sort((te,le)=>te.start-le.start);let ye=0;for(let te=1;te<X.length;te++){const le=X[ye],Me=X[te],Se=le.start+le.count,oe=at(Me.start,g.width,4),Ge=at(le.start,g.width,4);Me.start<=Se+1&&oe===Ge&&at(Me.start+Me.count-1,g.width,4)===oe?le.count=Math.max(le.count,Me.start+Me.count-le.start):(++ye,X[ye]=Me)}X.length=ye+1;const ae=n.getParameter(n.UNPACK_ROW_LENGTH),be=n.getParameter(n.UNPACK_SKIP_PIXELS),De=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,g.width);for(let te=0,le=X.length;te<le;te++){const Me=X[te],Se=Math.floor(Me.start/4),oe=Math.ceil(Me.count/4),Ge=Se%g.width,D=Math.floor(Se/g.width),fe=oe,re=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,D),t.texSubImage2D(n.TEXTURE_2D,0,Ge,D,fe,re,L,Y,g.data)}S.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ae),n.pixelStorei(n.UNPACK_SKIP_PIXELS,be),n.pixelStorei(n.UNPACK_SKIP_ROWS,De)}}function K(S,g,L){let Y=n.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(Y=n.TEXTURE_2D_ARRAY),g.isData3DTexture&&(Y=n.TEXTURE_3D);const J=Fe(S,g),X=g.source;t.bindTexture(Y,S.__webglTexture,n.TEXTURE0+L);const ye=i.get(X);if(X.version!==ye.__version||J===!0){t.activeTexture(n.TEXTURE0+L);const ae=Ze.getPrimaries(Ze.workingColorSpace),be=g.colorSpace===On?null:Ze.getPrimaries(g.colorSpace),De=g.colorSpace===On||ae===be?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,De);let te=v(g.image,!1,r.maxTextureSize);te=et(g,te);const le=s.convert(g.format,g.colorSpace),Me=s.convert(g.type);let Se=T(g.internalFormat,le,Me,g.colorSpace,g.isVideoTexture);Ue(Y,g);let oe;const Ge=g.mipmaps,D=g.isVideoTexture!==!0,fe=ye.__version===void 0||J===!0,re=X.dataReady,me=w(g,te);if(g.isDepthTexture)Se=y(g.format===ri,g.type),fe&&(D?t.texStorage2D(n.TEXTURE_2D,1,Se,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,Se,te.width,te.height,0,le,Me,null));else if(g.isDataTexture)if(Ge.length>0){D&&fe&&t.texStorage2D(n.TEXTURE_2D,me,Se,Ge[0].width,Ge[0].height);for(let Q=0,Z=Ge.length;Q<Z;Q++)oe=Ge[Q],D?re&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,oe.width,oe.height,le,Me,oe.data):t.texImage2D(n.TEXTURE_2D,Q,Se,oe.width,oe.height,0,le,Me,oe.data);g.generateMipmaps=!1}else D?(fe&&t.texStorage2D(n.TEXTURE_2D,me,Se,te.width,te.height),re&&Qe(g,te,le,Me)):t.texImage2D(n.TEXTURE_2D,0,Se,te.width,te.height,0,le,Me,te.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){D&&fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,Se,Ge[0].width,Ge[0].height,te.depth);for(let Q=0,Z=Ge.length;Q<Z;Q++)if(oe=Ge[Q],g.format!==an)if(le!==null)if(D){if(re)if(g.layerUpdates.size>0){const se=sl(oe.width,oe.height,g.format,g.type);for(const Ie of g.layerUpdates){const lt=oe.data.subarray(Ie*se/oe.data.BYTES_PER_ELEMENT,(Ie+1)*se/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,Ie,oe.width,oe.height,1,le,lt)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,oe.width,oe.height,te.depth,le,oe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Q,Se,oe.width,oe.height,te.depth,0,oe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?re&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Q,0,0,0,oe.width,oe.height,te.depth,le,Me,oe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Q,Se,oe.width,oe.height,te.depth,0,le,Me,oe.data)}else{D&&fe&&t.texStorage2D(n.TEXTURE_2D,me,Se,Ge[0].width,Ge[0].height);for(let Q=0,Z=Ge.length;Q<Z;Q++)oe=Ge[Q],g.format!==an?le!==null?D?re&&t.compressedTexSubImage2D(n.TEXTURE_2D,Q,0,0,oe.width,oe.height,le,oe.data):t.compressedTexImage2D(n.TEXTURE_2D,Q,Se,oe.width,oe.height,0,oe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?re&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,oe.width,oe.height,le,Me,oe.data):t.texImage2D(n.TEXTURE_2D,Q,Se,oe.width,oe.height,0,le,Me,oe.data)}else if(g.isDataArrayTexture)if(D){if(fe&&t.texStorage3D(n.TEXTURE_2D_ARRAY,me,Se,te.width,te.height,te.depth),re)if(g.layerUpdates.size>0){const Q=sl(te.width,te.height,g.format,g.type);for(const Z of g.layerUpdates){const se=te.data.subarray(Z*Q/te.data.BYTES_PER_ELEMENT,(Z+1)*Q/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Z,te.width,te.height,1,le,Me,se)}g.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,le,Me,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Se,te.width,te.height,te.depth,0,le,Me,te.data);else if(g.isData3DTexture)D?(fe&&t.texStorage3D(n.TEXTURE_3D,me,Se,te.width,te.height,te.depth),re&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,le,Me,te.data)):t.texImage3D(n.TEXTURE_3D,0,Se,te.width,te.height,te.depth,0,le,Me,te.data);else if(g.isFramebufferTexture){if(fe)if(D)t.texStorage2D(n.TEXTURE_2D,me,Se,te.width,te.height);else{let Q=te.width,Z=te.height;for(let se=0;se<me;se++)t.texImage2D(n.TEXTURE_2D,se,Se,Q,Z,0,le,Me,null),Q>>=1,Z>>=1}}else if(Ge.length>0){if(D&&fe){const Q=xe(Ge[0]);t.texStorage2D(n.TEXTURE_2D,me,Se,Q.width,Q.height)}for(let Q=0,Z=Ge.length;Q<Z;Q++)oe=Ge[Q],D?re&&t.texSubImage2D(n.TEXTURE_2D,Q,0,0,le,Me,oe):t.texImage2D(n.TEXTURE_2D,Q,Se,le,Me,oe);g.generateMipmaps=!1}else if(D){if(fe){const Q=xe(te);t.texStorage2D(n.TEXTURE_2D,me,Se,Q.width,Q.height)}re&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,le,Me,te)}else t.texImage2D(n.TEXTURE_2D,0,Se,le,Me,te);m(g)&&h(Y),ye.__version=X.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function j(S,g,L){if(g.image.length!==6)return;const Y=Fe(S,g),J=g.source;t.bindTexture(n.TEXTURE_CUBE_MAP,S.__webglTexture,n.TEXTURE0+L);const X=i.get(J);if(J.version!==X.__version||Y===!0){t.activeTexture(n.TEXTURE0+L);const ye=Ze.getPrimaries(Ze.workingColorSpace),ae=g.colorSpace===On?null:Ze.getPrimaries(g.colorSpace),be=g.colorSpace===On||ye===ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,g.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,g.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const De=g.isCompressedTexture||g.image[0].isCompressedTexture,te=g.image[0]&&g.image[0].isDataTexture,le=[];for(let Z=0;Z<6;Z++)!De&&!te?le[Z]=v(g.image[Z],!0,r.maxCubemapSize):le[Z]=te?g.image[Z].image:g.image[Z],le[Z]=et(g,le[Z]);const Me=le[0],Se=s.convert(g.format,g.colorSpace),oe=s.convert(g.type),Ge=T(g.internalFormat,Se,oe,g.colorSpace),D=g.isVideoTexture!==!0,fe=X.__version===void 0||Y===!0,re=J.dataReady;let me=w(g,Me);Ue(n.TEXTURE_CUBE_MAP,g);let Q;if(De){D&&fe&&t.texStorage2D(n.TEXTURE_CUBE_MAP,me,Ge,Me.width,Me.height);for(let Z=0;Z<6;Z++){Q=le[Z].mipmaps;for(let se=0;se<Q.length;se++){const Ie=Q[se];g.format!==an?Se!==null?D?re&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,0,0,Ie.width,Ie.height,Se,Ie.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,Ge,Ie.width,Ie.height,0,Ie.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,0,0,Ie.width,Ie.height,Se,oe,Ie.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se,Ge,Ie.width,Ie.height,0,Se,oe,Ie.data)}}}else{if(Q=g.mipmaps,D&&fe){Q.length>0&&me++;const Z=xe(le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,me,Ge,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(te){D?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,le[Z].width,le[Z].height,Se,oe,le[Z].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ge,le[Z].width,le[Z].height,0,Se,oe,le[Z].data);for(let se=0;se<Q.length;se++){const lt=Q[se].image[Z].image;D?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,0,0,lt.width,lt.height,Se,oe,lt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,Ge,lt.width,lt.height,0,Se,oe,lt.data)}}else{D?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Se,oe,le[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Ge,Se,oe,le[Z]);for(let se=0;se<Q.length;se++){const Ie=Q[se];D?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,0,0,Se,oe,Ie.image[Z]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Z,se+1,Ge,Se,oe,Ie.image[Z])}}}m(g)&&h(n.TEXTURE_CUBE_MAP),X.__version=J.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function pe(S,g,L,Y,J,X){const ye=s.convert(L.format,L.colorSpace),ae=s.convert(L.type),be=T(L.internalFormat,ye,ae,L.colorSpace),De=i.get(g),te=i.get(L);if(te.__renderTarget=g,!De.__hasExternalTextures){const le=Math.max(1,g.width>>X),Me=Math.max(1,g.height>>X);J===n.TEXTURE_3D||J===n.TEXTURE_2D_ARRAY?t.texImage3D(J,X,be,le,Me,g.depth,0,ye,ae,null):t.texImage2D(J,X,be,le,Me,0,ye,ae,null)}t.bindFramebuffer(n.FRAMEBUFFER,S),$e(g)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,J,te.__webglTexture,0,C(g)):(J===n.TEXTURE_2D||J>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Y,J,te.__webglTexture,X),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Te(S,g,L){if(n.bindRenderbuffer(n.RENDERBUFFER,S),g.depthBuffer){const Y=g.depthTexture,J=Y&&Y.isDepthTexture?Y.type:null,X=y(g.stencilBuffer,J),ye=g.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;$e(g)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,C(g),X,g.width,g.height):L?n.renderbufferStorageMultisample(n.RENDERBUFFER,C(g),X,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,X,g.width,g.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ye,n.RENDERBUFFER,S)}else{const Y=g.textures;for(let J=0;J<Y.length;J++){const X=Y[J],ye=s.convert(X.format,X.colorSpace),ae=s.convert(X.type),be=T(X.internalFormat,ye,ae,X.colorSpace);$e(g)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,C(g),be,g.width,g.height):L?n.renderbufferStorageMultisample(n.RENDERBUFFER,C(g),be,g.width,g.height):n.renderbufferStorage(n.RENDERBUFFER,be,g.width,g.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ge(S,g,L){const Y=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,S),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=i.get(g.depthTexture);if(J.__renderTarget=g,(!J.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),Y){if(J.__webglInit===void 0&&(J.__webglInit=!0,g.depthTexture.addEventListener("dispose",A)),J.__webglTexture===void 0){J.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),Ue(n.TEXTURE_CUBE_MAP,g.depthTexture);const De=s.convert(g.depthTexture.format),te=s.convert(g.depthTexture.type);let le;g.depthTexture.format===Cn?le=n.DEPTH_COMPONENT24:g.depthTexture.format===ri&&(le=n.DEPTH24_STENCIL8);for(let Me=0;Me<6;Me++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0,le,g.width,g.height,0,De,te,null)}}else q(g.depthTexture,0);const X=J.__webglTexture,ye=C(g),ae=Y?n.TEXTURE_CUBE_MAP_POSITIVE_X+L:n.TEXTURE_2D,be=g.depthTexture.format===ri?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(g.depthTexture.format===Cn)$e(g)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,be,ae,X,0,ye):n.framebufferTexture2D(n.FRAMEBUFFER,be,ae,X,0);else if(g.depthTexture.format===ri)$e(g)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,be,ae,X,0,ye):n.framebufferTexture2D(n.FRAMEBUFFER,be,ae,X,0);else throw new Error("Unknown depthTexture format")}function Oe(S){const g=i.get(S),L=S.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==S.depthTexture){const Y=S.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),Y){const J=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,Y.removeEventListener("dispose",J)};Y.addEventListener("dispose",J),g.__depthDisposeCallback=J}g.__boundDepthTexture=Y}if(S.depthTexture&&!g.__autoAllocateDepthBuffer)if(L)for(let Y=0;Y<6;Y++)ge(g.__webglFramebuffer[Y],S,Y);else{const Y=S.texture.mipmaps;Y&&Y.length>0?ge(g.__webglFramebuffer[0],S,0):ge(g.__webglFramebuffer,S,0)}else if(L){g.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[Y]),g.__webglDepthbuffer[Y]===void 0)g.__webglDepthbuffer[Y]=n.createRenderbuffer(),Te(g.__webglDepthbuffer[Y],S,!1);else{const J=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=g.__webglDepthbuffer[Y];n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,X)}}else{const Y=S.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=n.createRenderbuffer(),Te(g.__webglDepthbuffer,S,!1);else{const J=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=g.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,X)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(S,g,L){const Y=i.get(S);g!==void 0&&pe(Y.__webglFramebuffer,S,S.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),L!==void 0&&Oe(S)}function ke(S){const g=S.texture,L=i.get(S),Y=i.get(g);S.addEventListener("dispose",R);const J=S.textures,X=S.isWebGLCubeRenderTarget===!0,ye=J.length>1;if(ye||(Y.__webglTexture===void 0&&(Y.__webglTexture=n.createTexture()),Y.__version=g.version,a.memory.textures++),X){L.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(g.mipmaps&&g.mipmaps.length>0){L.__webglFramebuffer[ae]=[];for(let be=0;be<g.mipmaps.length;be++)L.__webglFramebuffer[ae][be]=n.createFramebuffer()}else L.__webglFramebuffer[ae]=n.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){L.__webglFramebuffer=[];for(let ae=0;ae<g.mipmaps.length;ae++)L.__webglFramebuffer[ae]=n.createFramebuffer()}else L.__webglFramebuffer=n.createFramebuffer();if(ye)for(let ae=0,be=J.length;ae<be;ae++){const De=i.get(J[ae]);De.__webglTexture===void 0&&(De.__webglTexture=n.createTexture(),a.memory.textures++)}if(S.samples>0&&$e(S)===!1){L.__webglMultisampledFramebuffer=n.createFramebuffer(),L.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let ae=0;ae<J.length;ae++){const be=J[ae];L.__webglColorRenderbuffer[ae]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,L.__webglColorRenderbuffer[ae]);const De=s.convert(be.format,be.colorSpace),te=s.convert(be.type),le=T(be.internalFormat,De,te,be.colorSpace,S.isXRRenderTarget===!0),Me=C(S);n.renderbufferStorageMultisample(n.RENDERBUFFER,Me,le,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ae,n.RENDERBUFFER,L.__webglColorRenderbuffer[ae])}n.bindRenderbuffer(n.RENDERBUFFER,null),S.depthBuffer&&(L.__webglDepthRenderbuffer=n.createRenderbuffer(),Te(L.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(X){t.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture),Ue(n.TEXTURE_CUBE_MAP,g);for(let ae=0;ae<6;ae++)if(g.mipmaps&&g.mipmaps.length>0)for(let be=0;be<g.mipmaps.length;be++)pe(L.__webglFramebuffer[ae][be],S,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,be);else pe(L.__webglFramebuffer[ae],S,g,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(g)&&h(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let ae=0,be=J.length;ae<be;ae++){const De=J[ae],te=i.get(De);let le=n.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(le=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(le,te.__webglTexture),Ue(le,De),pe(L.__webglFramebuffer,S,De,n.COLOR_ATTACHMENT0+ae,le,0),m(De)&&h(le)}t.unbindTexture()}else{let ae=n.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(ae=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ae,Y.__webglTexture),Ue(ae,g),g.mipmaps&&g.mipmaps.length>0)for(let be=0;be<g.mipmaps.length;be++)pe(L.__webglFramebuffer[be],S,g,n.COLOR_ATTACHMENT0,ae,be);else pe(L.__webglFramebuffer,S,g,n.COLOR_ATTACHMENT0,ae,0);m(g)&&h(ae),t.unbindTexture()}S.depthBuffer&&Oe(S)}function We(S){const g=S.textures;for(let L=0,Y=g.length;L<Y;L++){const J=g[L];if(m(J)){const X=E(S),ye=i.get(J).__webglTexture;t.bindTexture(X,ye),h(X),t.unbindTexture()}}}const Ke=[],Ae=[];function Ye(S){if(S.samples>0){if($e(S)===!1){const g=S.textures,L=S.width,Y=S.height;let J=n.COLOR_BUFFER_BIT;const X=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ye=i.get(S),ae=g.length>1;if(ae)for(let De=0;De<g.length;De++)t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+De,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+De,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const be=S.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let De=0;De<g.length;De++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(J|=n.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(J|=n.STENCIL_BUFFER_BIT)),ae){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ye.__webglColorRenderbuffer[De]);const te=i.get(g[De]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,te,0)}n.blitFramebuffer(0,0,L,Y,0,0,L,Y,J,n.NEAREST),c===!0&&(Ke.length=0,Ae.length=0,Ke.push(n.COLOR_ATTACHMENT0+De),S.depthBuffer&&S.resolveDepthBuffer===!1&&(Ke.push(X),Ae.push(X),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ae)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Ke))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ae)for(let De=0;De<g.length;De++){t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+De,n.RENDERBUFFER,ye.__webglColorRenderbuffer[De]);const te=i.get(g[De]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ye.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+De,n.TEXTURE_2D,te,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&c){const g=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[g])}}}function C(S){return Math.min(r.maxSamples,S.samples)}function $e(S){const g=i.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function qe(S){const g=a.render.frame;u.get(S)!==g&&(u.set(S,g),S.update())}function et(S,g){const L=S.colorSpace,Y=S.format,J=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||L!==Oi&&L!==On&&(Ze.getTransfer(L)===it?(Y!==an||J!==Kt)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Je("WebGLTextures: Unsupported texture color space:",L)),g}function xe(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(l.width=S.naturalWidth||S.width,l.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(l.width=S.displayWidth,l.height=S.displayHeight):(l.width=S.width,l.height=S.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=k,this.setTexture3D=W,this.setTextureCube=$,this.rebindTextures=ut,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=$e,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Bg(n,e){function t(i,r=On){let s;const a=Ze.getTransfer(r);if(i===Kt)return n.UNSIGNED_BYTE;if(i===eo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===to)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ql)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===ec)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===jl)return n.BYTE;if(i===Jl)return n.SHORT;if(i===ir)return n.UNSIGNED_SHORT;if(i===Qa)return n.INT;if(i===pn)return n.UNSIGNED_INT;if(i===un)return n.FLOAT;if(i===wn)return n.HALF_FLOAT;if(i===tc)return n.ALPHA;if(i===nc)return n.RGB;if(i===an)return n.RGBA;if(i===Cn)return n.DEPTH_COMPONENT;if(i===ri)return n.DEPTH_STENCIL;if(i===ic)return n.RED;if(i===no)return n.RED_INTEGER;if(i===Fi)return n.RG;if(i===io)return n.RG_INTEGER;if(i===ro)return n.RGBA_INTEGER;if(i===Hr||i===Vr||i===Wr||i===Xr)if(a===it)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Hr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Vr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Wr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Hr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Vr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Wr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Xr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===la||i===ca||i===ua||i===da)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===la)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ca)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ua)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===da)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ha||i===fa||i===pa||i===ma||i===ga||i===_a||i===va)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===ha||i===fa)return a===it?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===pa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===ma)return s.COMPRESSED_R11_EAC;if(i===ga)return s.COMPRESSED_SIGNED_R11_EAC;if(i===_a)return s.COMPRESSED_RG11_EAC;if(i===va)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===xa||i===Ma||i===ba||i===Sa||i===ya||i===Ea||i===Ta||i===Aa||i===wa||i===Ca||i===Ra||i===Pa||i===Da||i===La)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===xa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ma)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ba)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Sa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ya)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ea)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ta)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Aa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ca)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ra)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Pa)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Da)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===La)return a===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ia||i===Ua||i===Na)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Ia)return a===it?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ua)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Na)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fa||i===Oa||i===Ba||i===za)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Fa)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Oa)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ba)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===za)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===rr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const zg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gg=`
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

}`;class kg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new _c(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new gn({vertexShader:zg,fragmentShader:Gg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Dt(new ss(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hg extends ci{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,f=null,p=null,_=null;const v=typeof XRWebGLBinding<"u",m=new kg,h={},E=t.getContextAttributes();let T=null,y=null;const w=[],A=[],R=new Ne;let O=null;const x=new jt;x.viewport=new mt;const b=new jt;b.viewport=new mt;const P=[x,b],F=new Kd;let U=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let j=w[K];return j===void 0&&(j=new Us,w[K]=j),j.getTargetRaySpace()},this.getControllerGrip=function(K){let j=w[K];return j===void 0&&(j=new Us,w[K]=j),j.getGripSpace()},this.getHand=function(K){let j=w[K];return j===void 0&&(j=new Us,w[K]=j),j.getHandSpace()};function q(K){const j=A.indexOf(K.inputSource);if(j===-1)return;const pe=w[j];pe!==void 0&&(pe.update(K.inputSource,K.frame,l||a),pe.dispatchEvent({type:K.type,data:K.inputSource}))}function k(){r.removeEventListener("select",q),r.removeEventListener("selectstart",q),r.removeEventListener("selectend",q),r.removeEventListener("squeeze",q),r.removeEventListener("squeezestart",q),r.removeEventListener("squeezeend",q),r.removeEventListener("end",k),r.removeEventListener("inputsourceschange",W);for(let K=0;K<w.length;K++){const j=A[K];j!==null&&(A[K]=null,w[K].disconnect(j))}U=null,V=null,m.reset();for(const K in h)delete h[K];e.setRenderTarget(T),p=null,f=null,d=null,r=null,y=null,Qe.stop(),i.isPresenting=!1,e.setPixelRatio(O),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",q),r.addEventListener("selectstart",q),r.addEventListener("selectend",q),r.addEventListener("squeeze",q),r.addEventListener("squeezestart",q),r.addEventListener("squeezeend",q),r.addEventListener("end",k),r.addEventListener("inputsourceschange",W),E.xrCompatible!==!0&&await t.makeXRCompatible(),O=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Te=null,ge=null;E.depth&&(ge=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=E.stencil?ri:Cn,Te=E.stencil?rr:pn);const Oe={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(Oe),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),y=new fn(f.textureWidth,f.textureHeight,{format:an,type:Kt,depthTexture:new ar(f.textureWidth,f.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const pe={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,pe),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new fn(p.framebufferWidth,p.framebufferHeight,{format:an,type:Kt,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Qe.setContext(r),Qe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(K){for(let j=0;j<K.removed.length;j++){const pe=K.removed[j],Te=A.indexOf(pe);Te>=0&&(A[Te]=null,w[Te].disconnect(pe))}for(let j=0;j<K.added.length;j++){const pe=K.added[j];let Te=A.indexOf(pe);if(Te===-1){for(let Oe=0;Oe<w.length;Oe++)if(Oe>=A.length){A.push(pe),Te=Oe;break}else if(A[Oe]===null){A[Oe]=pe,Te=Oe;break}if(Te===-1)break}const ge=w[Te];ge&&ge.connect(pe)}}const $=new N,ie=new N;function ee(K,j,pe){$.setFromMatrixPosition(j.matrixWorld),ie.setFromMatrixPosition(pe.matrixWorld);const Te=$.distanceTo(ie),ge=j.projectionMatrix.elements,Oe=pe.projectionMatrix.elements,ut=ge[14]/(ge[10]-1),ke=ge[14]/(ge[10]+1),We=(ge[9]+1)/ge[5],Ke=(ge[9]-1)/ge[5],Ae=(ge[8]-1)/ge[0],Ye=(Oe[8]+1)/Oe[0],C=ut*Ae,$e=ut*Ye,qe=Te/(-Ae+Ye),et=qe*-Ae;if(j.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(et),K.translateZ(qe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),ge[10]===-1)K.projectionMatrix.copy(j.projectionMatrix),K.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{const xe=ut+qe,S=ke+qe,g=C-et,L=$e+(Te-et),Y=We*ke/S*xe,J=Ke*ke/S*xe;K.projectionMatrix.makePerspective(g,L,Y,J,xe,S),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function he(K,j){j===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(j.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let j=K.near,pe=K.far;m.texture!==null&&(m.depthNear>0&&(j=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),F.near=b.near=x.near=j,F.far=b.far=x.far=pe,(U!==F.near||V!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),U=F.near,V=F.far),F.layers.mask=K.layers.mask|6,x.layers.mask=F.layers.mask&3,b.layers.mask=F.layers.mask&5;const Te=K.parent,ge=F.cameras;he(F,Te);for(let Oe=0;Oe<ge.length;Oe++)he(ge[Oe],Te);ge.length===2?ee(F,x,b):F.projectionMatrix.copy(x.projectionMatrix),Ue(K,F,Te)};function Ue(K,j,pe){pe===null?K.matrix.copy(j.matrixWorld):(K.matrix.copy(pe.matrixWorld),K.matrix.invert(),K.matrix.multiply(j.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(j.projectionMatrix),K.projectionMatrixInverse.copy(j.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ga*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(K){c=K,f!==null&&(f.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(K){return h[K]};let Fe=null;function at(K,j){if(u=j.getViewerPose(l||a),_=j,u!==null){const pe=u.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let Te=!1;pe.length!==F.cameras.length&&(F.cameras.length=0,Te=!0);for(let ke=0;ke<pe.length;ke++){const We=pe[ke];let Ke=null;if(p!==null)Ke=p.getViewport(We);else{const Ye=d.getViewSubImage(f,We);Ke=Ye.viewport,ke===0&&(e.setRenderTargetTextures(y,Ye.colorTexture,Ye.depthStencilTexture),e.setRenderTarget(y))}let Ae=P[ke];Ae===void 0&&(Ae=new jt,Ae.layers.enable(ke),Ae.viewport=new mt,P[ke]=Ae),Ae.matrix.fromArray(We.transform.matrix),Ae.matrix.decompose(Ae.position,Ae.quaternion,Ae.scale),Ae.projectionMatrix.fromArray(We.projectionMatrix),Ae.projectionMatrixInverse.copy(Ae.projectionMatrix).invert(),Ae.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),ke===0&&(F.matrix.copy(Ae.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Te===!0&&F.cameras.push(Ae)}const ge=r.enabledFeatures;if(ge&&ge.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){d=i.getBinding();const ke=d.getDepthInformation(pe[0]);ke&&ke.isValid&&ke.texture&&m.init(ke,r.renderState)}if(ge&&ge.includes("camera-access")&&v){e.state.unbindTexture(),d=i.getBinding();for(let ke=0;ke<pe.length;ke++){const We=pe[ke].camera;if(We){let Ke=h[We];Ke||(Ke=new _c,h[We]=Ke);const Ae=d.getCameraImage(We);Ke.sourceTexture=Ae}}}}for(let pe=0;pe<w.length;pe++){const Te=A[pe],ge=w[pe];Te!==null&&ge!==void 0&&ge.update(Te,j,l||a)}Fe&&Fe(K,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),_=null}const Qe=new xc;Qe.setAnimationLoop(at),this.setAnimationLoop=function(K){Fe=K},this.dispose=function(){}}}const jn=new mn,Vg=new ht;function Wg(n,e){function t(m,h){m.matrixAutoUpdate===!0&&m.updateMatrix(),h.value.copy(m.matrix)}function i(m,h){h.color.getRGB(m.fogColor.value,dc(n)),h.isFog?(m.fogNear.value=h.near,m.fogFar.value=h.far):h.isFogExp2&&(m.fogDensity.value=h.density)}function r(m,h,E,T,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?s(m,h):h.isMeshToonMaterial?(s(m,h),d(m,h)):h.isMeshPhongMaterial?(s(m,h),u(m,h)):h.isMeshStandardMaterial?(s(m,h),f(m,h),h.isMeshPhysicalMaterial&&p(m,h,y)):h.isMeshMatcapMaterial?(s(m,h),_(m,h)):h.isMeshDepthMaterial?s(m,h):h.isMeshDistanceMaterial?(s(m,h),v(m,h)):h.isMeshNormalMaterial?s(m,h):h.isLineBasicMaterial?(a(m,h),h.isLineDashedMaterial&&o(m,h)):h.isPointsMaterial?c(m,h,E,T):h.isSpriteMaterial?l(m,h):h.isShadowMaterial?(m.color.value.copy(h.color),m.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(m,h){m.opacity.value=h.opacity,h.color&&m.diffuse.value.copy(h.color),h.emissive&&m.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.bumpMap&&(m.bumpMap.value=h.bumpMap,t(h.bumpMap,m.bumpMapTransform),m.bumpScale.value=h.bumpScale,h.side===kt&&(m.bumpScale.value*=-1)),h.normalMap&&(m.normalMap.value=h.normalMap,t(h.normalMap,m.normalMapTransform),m.normalScale.value.copy(h.normalScale),h.side===kt&&m.normalScale.value.negate()),h.displacementMap&&(m.displacementMap.value=h.displacementMap,t(h.displacementMap,m.displacementMapTransform),m.displacementScale.value=h.displacementScale,m.displacementBias.value=h.displacementBias),h.emissiveMap&&(m.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,m.emissiveMapTransform)),h.specularMap&&(m.specularMap.value=h.specularMap,t(h.specularMap,m.specularMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest);const E=e.get(h),T=E.envMap,y=E.envMapRotation;T&&(m.envMap.value=T,jn.copy(y),jn.x*=-1,jn.y*=-1,jn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),m.envMapRotation.value.setFromMatrix4(Vg.makeRotationFromEuler(jn)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=h.reflectivity,m.ior.value=h.ior,m.refractionRatio.value=h.refractionRatio),h.lightMap&&(m.lightMap.value=h.lightMap,m.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,m.lightMapTransform)),h.aoMap&&(m.aoMap.value=h.aoMap,m.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,m.aoMapTransform))}function a(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform))}function o(m,h){m.dashSize.value=h.dashSize,m.totalSize.value=h.dashSize+h.gapSize,m.scale.value=h.scale}function c(m,h,E,T){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.size.value=h.size*E,m.scale.value=T*.5,h.map&&(m.map.value=h.map,t(h.map,m.uvTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function l(m,h){m.diffuse.value.copy(h.color),m.opacity.value=h.opacity,m.rotation.value=h.rotation,h.map&&(m.map.value=h.map,t(h.map,m.mapTransform)),h.alphaMap&&(m.alphaMap.value=h.alphaMap,t(h.alphaMap,m.alphaMapTransform)),h.alphaTest>0&&(m.alphaTest.value=h.alphaTest)}function u(m,h){m.specular.value.copy(h.specular),m.shininess.value=Math.max(h.shininess,1e-4)}function d(m,h){h.gradientMap&&(m.gradientMap.value=h.gradientMap)}function f(m,h){m.metalness.value=h.metalness,h.metalnessMap&&(m.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,m.metalnessMapTransform)),m.roughness.value=h.roughness,h.roughnessMap&&(m.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,m.roughnessMapTransform)),h.envMap&&(m.envMapIntensity.value=h.envMapIntensity)}function p(m,h,E){m.ior.value=h.ior,h.sheen>0&&(m.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),m.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(m.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,m.sheenColorMapTransform)),h.sheenRoughnessMap&&(m.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,m.sheenRoughnessMapTransform))),h.clearcoat>0&&(m.clearcoat.value=h.clearcoat,m.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(m.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,m.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(m.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===kt&&m.clearcoatNormalScale.value.negate())),h.dispersion>0&&(m.dispersion.value=h.dispersion),h.iridescence>0&&(m.iridescence.value=h.iridescence,m.iridescenceIOR.value=h.iridescenceIOR,m.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(m.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,m.iridescenceMapTransform)),h.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),h.transmission>0&&(m.transmission.value=h.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),h.transmissionMap&&(m.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,m.transmissionMapTransform)),m.thickness.value=h.thickness,h.thicknessMap&&(m.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=h.attenuationDistance,m.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(m.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(m.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=h.specularIntensity,m.specularColor.value.copy(h.specularColor),h.specularColorMap&&(m.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,m.specularColorMapTransform)),h.specularIntensityMap&&(m.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,h){h.matcap&&(m.matcap.value=h.matcap)}function v(m,h){const E=e.get(h).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Xg(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,T){const y=T.program;i.uniformBlockBinding(E,y)}function l(E,T){let y=r[E.id];y===void 0&&(_(E),y=u(E),r[E.id]=y,E.addEventListener("dispose",m));const w=T.program;i.updateUBOMapping(E,w);const A=e.render.frame;s[E.id]!==A&&(f(E),s[E.id]=A)}function u(E){const T=d();E.__bindingPointIndex=T;const y=n.createBuffer(),w=E.__size,A=E.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,w,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,T,y),y}function d(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return Je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){const T=r[E.id],y=E.uniforms,w=E.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let A=0,R=y.length;A<R;A++){const O=Array.isArray(y[A])?y[A]:[y[A]];for(let x=0,b=O.length;x<b;x++){const P=O[x];if(p(P,A,x,w)===!0){const F=P.__offset,U=Array.isArray(P.value)?P.value:[P.value];let V=0;for(let q=0;q<U.length;q++){const k=U[q],W=v(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,F+V,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,V),V+=W.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(E,T,y,w){const A=E.value,R=T+"_"+y;if(w[R]===void 0)return typeof A=="number"||typeof A=="boolean"?w[R]=A:w[R]=A.clone(),!0;{const O=w[R];if(typeof A=="number"||typeof A=="boolean"){if(O!==A)return w[R]=A,!0}else if(O.equals(A)===!1)return O.copy(A),!0}return!1}function _(E){const T=E.uniforms;let y=0;const w=16;for(let R=0,O=T.length;R<O;R++){const x=Array.isArray(T[R])?T[R]:[T[R]];for(let b=0,P=x.length;b<P;b++){const F=x[b],U=Array.isArray(F.value)?F.value:[F.value];for(let V=0,q=U.length;V<q;V++){const k=U[V],W=v(k),$=y%w,ie=$%W.boundary,ee=$+ie;y+=ie,ee!==0&&w-ee<W.storage&&(y+=w-ee),F.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=y,y+=W.storage}}}const A=y%w;return A>0&&(y+=w-A),E.__size=y,E.__cache={},this}function v(E){const T={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(T.boundary=4,T.storage=4):E.isVector2?(T.boundary=8,T.storage=8):E.isVector3||E.isColor?(T.boundary=16,T.storage=12):E.isVector4?(T.boundary=16,T.storage=16):E.isMatrix3?(T.boundary=48,T.storage=48):E.isMatrix4?(T.boundary=64,T.storage=64):E.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Le("WebGLRenderer: Unsupported uniform value type.",E),T}function m(E){const T=E.target;T.removeEventListener("dispose",m);const y=a.indexOf(T.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function h(){for(const E in r)n.deleteBuffer(r[E]);a=[],r={},s={}}return{bind:c,update:l,dispose:h}}const qg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ln=null;function Kg(){return ln===null&&(ln=new Id(qg,16,16,Fi,wn),ln.name="DFG_LUT",ln.minFilter=Rt,ln.magFilter=Rt,ln.wrapS=En,ln.wrapT=En,ln.generateMipmaps=!1,ln.needsUpdate=!0),ln}class Yg{constructor(e={}){const{canvas:t=sd(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:p=Kt}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=a;const v=p,m=new Set([ro,io,no]),h=new Set([Kt,pn,ir,rr,eo,to]),E=new Uint32Array(4),T=new Int32Array(4);let y=null,w=null;const A=[],R=[];let O=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=hn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let b=!1;this._outputColorSpace=Zt;let P=0,F=0,U=null,V=-1,q=null;const k=new mt,W=new mt;let $=null;const ie=new Xe(0);let ee=0,he=t.width,Ue=t.height,Fe=1,at=null,Qe=null;const K=new mt(0,0,he,Ue),j=new mt(0,0,he,Ue);let pe=!1;const Te=new lo;let ge=!1,Oe=!1;const ut=new ht,ke=new N,We=new mt,Ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ae=!1;function Ye(){return U===null?Fe:1}let C=i;function $e(M,I){return t.getContext(M,I)}try{const M={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ja}`),t.addEventListener("webglcontextlost",Ie,!1),t.addEventListener("webglcontextrestored",lt,!1),t.addEventListener("webglcontextcreationerror",tt,!1),C===null){const I="webgl2";if(C=$e(I,M),C===null)throw $e(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw Je("WebGLRenderer: "+M.message),M}let qe,et,xe,S,g,L,Y,J,X,ye,ae,be,De,te,le,Me,Se,oe,Ge,D,fe,re,me,Q;function Z(){qe=new Kp(C),qe.init(),re=new Bg(C,qe),et=new Bp(C,qe,e,re),xe=new Fg(C,qe),et.reversedDepthBuffer&&f&&xe.buffers.depth.setReversed(!0),S=new Zp(C),g=new bg,L=new Og(C,qe,xe,g,et,re,S),Y=new Gp(x),J=new qp(x),X=new Qd(C),me=new Fp(C,X),ye=new Yp(C,X,S,me),ae=new Jp(C,ye,X,S),Ge=new jp(C,et,L),Me=new zp(g),be=new Mg(x,Y,J,qe,et,me,Me),De=new Wg(x,g),te=new yg,le=new Rg(qe),oe=new Np(x,Y,J,xe,ae,_,c),Se=new Ug(x,ae,et),Q=new Xg(C,S,et,xe),D=new Op(C,qe,S),fe=new $p(C,qe,S),S.programs=be.programs,x.capabilities=et,x.extensions=qe,x.properties=g,x.renderLists=te,x.shadowMap=Se,x.state=xe,x.info=S}Z(),v!==Kt&&(O=new em(v,t.width,t.height,r,s));const se=new Hg(x,C);this.xr=se,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const M=qe.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=qe.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Fe},this.setPixelRatio=function(M){M!==void 0&&(Fe=M,this.setSize(he,Ue,!1))},this.getSize=function(M){return M.set(he,Ue)},this.setSize=function(M,I,H=!0){if(se.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}he=M,Ue=I,t.width=Math.floor(M*Fe),t.height=Math.floor(I*Fe),H===!0&&(t.style.width=M+"px",t.style.height=I+"px"),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,M,I)},this.getDrawingBufferSize=function(M){return M.set(he*Fe,Ue*Fe).floor()},this.setDrawingBufferSize=function(M,I,H){he=M,Ue=I,Fe=H,t.width=Math.floor(M*H),t.height=Math.floor(I*H),this.setViewport(0,0,M,I)},this.setEffects=function(M){if(v===Kt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let I=0;I<M.length;I++)if(M[I].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(k)},this.getViewport=function(M){return M.copy(K)},this.setViewport=function(M,I,H,G){M.isVector4?K.set(M.x,M.y,M.z,M.w):K.set(M,I,H,G),xe.viewport(k.copy(K).multiplyScalar(Fe).round())},this.getScissor=function(M){return M.copy(j)},this.setScissor=function(M,I,H,G){M.isVector4?j.set(M.x,M.y,M.z,M.w):j.set(M,I,H,G),xe.scissor(W.copy(j).multiplyScalar(Fe).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(M){xe.setScissorTest(pe=M)},this.setOpaqueSort=function(M){at=M},this.setTransparentSort=function(M){Qe=M},this.getClearColor=function(M){return M.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor(...arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha(...arguments)},this.clear=function(M=!0,I=!0,H=!0){let G=0;if(M){let z=!1;if(U!==null){const ce=U.texture.format;z=m.has(ce)}if(z){const ce=U.texture.type,_e=h.has(ce),de=oe.getClearColor(),ve=oe.getClearAlpha(),Ee=de.r,Pe=de.g,Ce=de.b;_e?(E[0]=Ee,E[1]=Pe,E[2]=Ce,E[3]=ve,C.clearBufferuiv(C.COLOR,0,E)):(T[0]=Ee,T[1]=Pe,T[2]=Ce,T[3]=ve,C.clearBufferiv(C.COLOR,0,T))}else G|=C.COLOR_BUFFER_BIT}I&&(G|=C.DEPTH_BUFFER_BIT),H&&(G|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ie,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",tt,!1),oe.dispose(),te.dispose(),le.dispose(),g.dispose(),Y.dispose(),J.dispose(),ae.dispose(),me.dispose(),Q.dispose(),be.dispose(),se.dispose(),se.removeEventListener("sessionstart",po),se.removeEventListener("sessionend",mo),Wn.stop()};function Ie(M){M.preventDefault(),Lo("WebGLRenderer: Context Lost."),b=!0}function lt(){Lo("WebGLRenderer: Context Restored."),b=!1;const M=S.autoReset,I=Se.enabled,H=Se.autoUpdate,G=Se.needsUpdate,z=Se.type;Z(),S.autoReset=M,Se.enabled=I,Se.autoUpdate=H,Se.needsUpdate=G,Se.type=z}function tt(M){Je("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function on(M){const I=M.target;I.removeEventListener("dispose",on),_n(I)}function _n(M){wc(M),g.remove(M)}function wc(M){const I=g.get(M).programs;I!==void 0&&(I.forEach(function(H){be.releaseProgram(H)}),M.isShaderMaterial&&be.releaseShaderCache(M))}this.renderBufferDirect=function(M,I,H,G,z,ce){I===null&&(I=Ke);const _e=z.isMesh&&z.matrixWorld.determinant()<0,de=Rc(M,I,H,G,z);xe.setMaterial(G,_e);let ve=H.index,Ee=1;if(G.wireframe===!0){if(ve=ye.getWireframeAttribute(H),ve===void 0)return;Ee=2}const Pe=H.drawRange,Ce=H.attributes.position;let He=Pe.start*Ee,rt=(Pe.start+Pe.count)*Ee;ce!==null&&(He=Math.max(He,ce.start*Ee),rt=Math.min(rt,(ce.start+ce.count)*Ee)),ve!==null?(He=Math.max(He,0),rt=Math.min(rt,ve.count)):Ce!=null&&(He=Math.max(He,0),rt=Math.min(rt,Ce.count));const ft=rt-He;if(ft<0||ft===1/0)return;me.setup(z,G,de,H,ve);let pt,ot=D;if(ve!==null&&(pt=X.get(ve),ot=fe,ot.setIndex(pt)),z.isMesh)G.wireframe===!0?(xe.setLineWidth(G.wireframeLinewidth*Ye()),ot.setMode(C.LINES)):ot.setMode(C.TRIANGLES);else if(z.isLine){let Re=G.linewidth;Re===void 0&&(Re=1),xe.setLineWidth(Re*Ye()),z.isLineSegments?ot.setMode(C.LINES):z.isLineLoop?ot.setMode(C.LINE_LOOP):ot.setMode(C.LINE_STRIP)}else z.isPoints?ot.setMode(C.POINTS):z.isSprite&&ot.setMode(C.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)sr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ot.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(qe.get("WEBGL_multi_draw"))ot.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Re=z._multiDrawStarts,nt=z._multiDrawCounts,je=z._multiDrawCount,Ht=ve?X.get(ve).bytesPerElement:1,hi=g.get(G).currentProgram.getUniforms();for(let Vt=0;Vt<je;Vt++)hi.setValue(C,"_gl_DrawID",Vt),ot.render(Re[Vt]/Ht,nt[Vt])}else if(z.isInstancedMesh)ot.renderInstances(He,ft,z.count);else if(H.isInstancedBufferGeometry){const Re=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,nt=Math.min(H.instanceCount,Re);ot.renderInstances(He,ft,nt)}else ot.render(He,ft)};function fo(M,I,H){M.transparent===!0&&M.side===yn&&M.forceSinglePass===!1?(M.side=kt,M.needsUpdate=!0,fr(M,I,H),M.side=Hn,M.needsUpdate=!0,fr(M,I,H),M.side=yn):fr(M,I,H)}this.compile=function(M,I,H=null){H===null&&(H=M),w=le.get(H),w.init(I),R.push(w),H.traverseVisible(function(z){z.isLight&&z.layers.test(I.layers)&&(w.pushLight(z),z.castShadow&&w.pushShadow(z))}),M!==H&&M.traverseVisible(function(z){z.isLight&&z.layers.test(I.layers)&&(w.pushLight(z),z.castShadow&&w.pushShadow(z))}),w.setupLights();const G=new Set;return M.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ce=z.material;if(ce)if(Array.isArray(ce))for(let _e=0;_e<ce.length;_e++){const de=ce[_e];fo(de,H,z),G.add(de)}else fo(ce,H,z),G.add(ce)}),w=R.pop(),G},this.compileAsync=function(M,I,H=null){const G=this.compile(M,I,H);return new Promise(z=>{function ce(){if(G.forEach(function(_e){g.get(_e).currentProgram.isReady()&&G.delete(_e)}),G.size===0){z(M);return}setTimeout(ce,10)}qe.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let ls=null;function Cc(M){ls&&ls(M)}function po(){Wn.stop()}function mo(){Wn.start()}const Wn=new xc;Wn.setAnimationLoop(Cc),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(M){ls=M,se.setAnimationLoop(M),M===null?Wn.stop():Wn.start()},se.addEventListener("sessionstart",po),se.addEventListener("sessionend",mo),this.render=function(M,I){if(I!==void 0&&I.isCamera!==!0){Je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;const H=se.enabled===!0&&se.isPresenting===!0,G=O!==null&&(U===null||H)&&O.begin(x,U);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(se.cameraAutoUpdate===!0&&se.updateCamera(I),I=se.getCamera()),M.isScene===!0&&M.onBeforeRender(x,M,I,U),w=le.get(M,R.length),w.init(I),R.push(w),ut.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Te.setFromProjectionMatrix(ut,dn,I.reversedDepth),Oe=this.localClippingEnabled,ge=Me.init(this.clippingPlanes,Oe),y=te.get(M,A.length),y.init(),A.push(y),se.enabled===!0&&se.isPresenting===!0){const _e=x.xr.getDepthSensingMesh();_e!==null&&cs(_e,I,-1/0,x.sortObjects)}cs(M,I,0,x.sortObjects),y.finish(),x.sortObjects===!0&&y.sort(at,Qe),Ae=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,Ae&&oe.addToRenderList(y,M),this.info.render.frame++,ge===!0&&Me.beginShadows();const z=w.state.shadowsArray;if(Se.render(z,M,I),ge===!0&&Me.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&O.hasRenderPass())===!1){const _e=y.opaque,de=y.transmissive;if(w.setupLights(),I.isArrayCamera){const ve=I.cameras;if(de.length>0)for(let Ee=0,Pe=ve.length;Ee<Pe;Ee++){const Ce=ve[Ee];_o(_e,de,M,Ce)}Ae&&oe.render(M);for(let Ee=0,Pe=ve.length;Ee<Pe;Ee++){const Ce=ve[Ee];go(y,M,Ce,Ce.viewport)}}else de.length>0&&_o(_e,de,M,I),Ae&&oe.render(M),go(y,M,I)}U!==null&&F===0&&(L.updateMultisampleRenderTarget(U),L.updateRenderTargetMipmap(U)),G&&O.end(x),M.isScene===!0&&M.onAfterRender(x,M,I),me.resetDefaultState(),V=-1,q=null,R.pop(),R.length>0?(w=R[R.length-1],ge===!0&&Me.setGlobalState(x.clippingPlanes,w.state.camera)):w=null,A.pop(),A.length>0?y=A[A.length-1]:y=null};function cs(M,I,H,G){if(M.visible===!1)return;if(M.layers.test(I.layers)){if(M.isGroup)H=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(I);else if(M.isLight)w.pushLight(M),M.castShadow&&w.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Te.intersectsSprite(M)){G&&We.setFromMatrixPosition(M.matrixWorld).applyMatrix4(ut);const _e=ae.update(M),de=M.material;de.visible&&y.push(M,_e,de,H,We.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Te.intersectsObject(M))){const _e=ae.update(M),de=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),We.copy(M.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),We.copy(_e.boundingSphere.center)),We.applyMatrix4(M.matrixWorld).applyMatrix4(ut)),Array.isArray(de)){const ve=_e.groups;for(let Ee=0,Pe=ve.length;Ee<Pe;Ee++){const Ce=ve[Ee],He=de[Ce.materialIndex];He&&He.visible&&y.push(M,_e,He,H,We.z,Ce)}}else de.visible&&y.push(M,_e,de,H,We.z,null)}}const ce=M.children;for(let _e=0,de=ce.length;_e<de;_e++)cs(ce[_e],I,H,G)}function go(M,I,H,G){const{opaque:z,transmissive:ce,transparent:_e}=M;w.setupLightsView(H),ge===!0&&Me.setGlobalState(x.clippingPlanes,H),G&&xe.viewport(k.copy(G)),z.length>0&&hr(z,I,H),ce.length>0&&hr(ce,I,H),_e.length>0&&hr(_e,I,H),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function _o(M,I,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[G.id]===void 0){const He=qe.has("EXT_color_buffer_half_float")||qe.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[G.id]=new fn(1,1,{generateMipmaps:!0,type:He?wn:Kt,minFilter:ii,samples:et.samples,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ze.workingColorSpace})}const ce=w.state.transmissionRenderTarget[G.id],_e=G.viewport||k;ce.setSize(_e.z*x.transmissionResolutionScale,_e.w*x.transmissionResolutionScale);const de=x.getRenderTarget(),ve=x.getActiveCubeFace(),Ee=x.getActiveMipmapLevel();x.setRenderTarget(ce),x.getClearColor(ie),ee=x.getClearAlpha(),ee<1&&x.setClearColor(16777215,.5),x.clear(),Ae&&oe.render(H);const Pe=x.toneMapping;x.toneMapping=hn;const Ce=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),w.setupLightsView(G),ge===!0&&Me.setGlobalState(x.clippingPlanes,G),hr(M,H,G),L.updateMultisampleRenderTarget(ce),L.updateRenderTargetMipmap(ce),qe.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let rt=0,ft=I.length;rt<ft;rt++){const pt=I[rt],{object:ot,geometry:Re,material:nt,group:je}=pt;if(nt.side===yn&&ot.layers.test(G.layers)){const Ht=nt.side;nt.side=kt,nt.needsUpdate=!0,vo(ot,H,G,Re,nt,je),nt.side=Ht,nt.needsUpdate=!0,He=!0}}He===!0&&(L.updateMultisampleRenderTarget(ce),L.updateRenderTargetMipmap(ce))}x.setRenderTarget(de,ve,Ee),x.setClearColor(ie,ee),Ce!==void 0&&(G.viewport=Ce),x.toneMapping=Pe}function hr(M,I,H){const G=I.isScene===!0?I.overrideMaterial:null;for(let z=0,ce=M.length;z<ce;z++){const _e=M[z],{object:de,geometry:ve,group:Ee}=_e;let Pe=_e.material;Pe.allowOverride===!0&&G!==null&&(Pe=G),de.layers.test(H.layers)&&vo(de,I,H,ve,Pe,Ee)}}function vo(M,I,H,G,z,ce){M.onBeforeRender(x,I,H,G,z,ce),M.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),z.onBeforeRender(x,I,H,G,M,ce),z.transparent===!0&&z.side===yn&&z.forceSinglePass===!1?(z.side=kt,z.needsUpdate=!0,x.renderBufferDirect(H,I,G,z,M,ce),z.side=Hn,z.needsUpdate=!0,x.renderBufferDirect(H,I,G,z,M,ce),z.side=yn):x.renderBufferDirect(H,I,G,z,M,ce),M.onAfterRender(x,I,H,G,z,ce)}function fr(M,I,H){I.isScene!==!0&&(I=Ke);const G=g.get(M),z=w.state.lights,ce=w.state.shadowsArray,_e=z.state.version,de=be.getParameters(M,z.state,ce,I,H),ve=be.getProgramCacheKey(de);let Ee=G.programs;G.environment=M.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(M.isMeshStandardMaterial?J:Y).get(M.envMap||G.environment),G.envMapRotation=G.environment!==null&&M.envMap===null?I.environmentRotation:M.envMapRotation,Ee===void 0&&(M.addEventListener("dispose",on),Ee=new Map,G.programs=Ee);let Pe=Ee.get(ve);if(Pe!==void 0){if(G.currentProgram===Pe&&G.lightsStateVersion===_e)return Mo(M,de),Pe}else de.uniforms=be.getUniforms(M),M.onBeforeCompile(de,x),Pe=be.acquireProgram(de,ve),Ee.set(ve,Pe),G.uniforms=de.uniforms;const Ce=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ce.clippingPlanes=Me.uniform),Mo(M,de),G.needsLights=Dc(M),G.lightsStateVersion=_e,G.needsLights&&(Ce.ambientLightColor.value=z.state.ambient,Ce.lightProbe.value=z.state.probe,Ce.directionalLights.value=z.state.directional,Ce.directionalLightShadows.value=z.state.directionalShadow,Ce.spotLights.value=z.state.spot,Ce.spotLightShadows.value=z.state.spotShadow,Ce.rectAreaLights.value=z.state.rectArea,Ce.ltc_1.value=z.state.rectAreaLTC1,Ce.ltc_2.value=z.state.rectAreaLTC2,Ce.pointLights.value=z.state.point,Ce.pointLightShadows.value=z.state.pointShadow,Ce.hemisphereLights.value=z.state.hemi,Ce.directionalShadowMap.value=z.state.directionalShadowMap,Ce.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ce.spotShadowMap.value=z.state.spotShadowMap,Ce.spotLightMatrix.value=z.state.spotLightMatrix,Ce.spotLightMap.value=z.state.spotLightMap,Ce.pointShadowMap.value=z.state.pointShadowMap,Ce.pointShadowMatrix.value=z.state.pointShadowMatrix),G.currentProgram=Pe,G.uniformsList=null,Pe}function xo(M){if(M.uniformsList===null){const I=M.currentProgram.getUniforms();M.uniformsList=Kr.seqWithValue(I.seq,M.uniforms)}return M.uniformsList}function Mo(M,I){const H=g.get(M);H.outputColorSpace=I.outputColorSpace,H.batching=I.batching,H.batchingColor=I.batchingColor,H.instancing=I.instancing,H.instancingColor=I.instancingColor,H.instancingMorph=I.instancingMorph,H.skinning=I.skinning,H.morphTargets=I.morphTargets,H.morphNormals=I.morphNormals,H.morphColors=I.morphColors,H.morphTargetsCount=I.morphTargetsCount,H.numClippingPlanes=I.numClippingPlanes,H.numIntersection=I.numClipIntersection,H.vertexAlphas=I.vertexAlphas,H.vertexTangents=I.vertexTangents,H.toneMapping=I.toneMapping}function Rc(M,I,H,G,z){I.isScene!==!0&&(I=Ke),L.resetTextureUnits();const ce=I.fog,_e=G.isMeshStandardMaterial?I.environment:null,de=U===null?x.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:Oi,ve=(G.isMeshStandardMaterial?J:Y).get(G.envMap||_e),Ee=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Pe=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ce=!!H.morphAttributes.position,He=!!H.morphAttributes.normal,rt=!!H.morphAttributes.color;let ft=hn;G.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(ft=x.toneMapping);const pt=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ot=pt!==void 0?pt.length:0,Re=g.get(G),nt=w.state.lights;if(ge===!0&&(Oe===!0||M!==q)){const It=M===q&&G.id===V;Me.setState(G,M,It)}let je=!1;G.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==nt.state.version||Re.outputColorSpace!==de||z.isBatchedMesh&&Re.batching===!1||!z.isBatchedMesh&&Re.batching===!0||z.isBatchedMesh&&Re.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Re.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Re.instancing===!1||!z.isInstancedMesh&&Re.instancing===!0||z.isSkinnedMesh&&Re.skinning===!1||!z.isSkinnedMesh&&Re.skinning===!0||z.isInstancedMesh&&Re.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Re.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Re.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Re.instancingMorph===!1&&z.morphTexture!==null||Re.envMap!==ve||G.fog===!0&&Re.fog!==ce||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==Me.numPlanes||Re.numIntersection!==Me.numIntersection)||Re.vertexAlphas!==Ee||Re.vertexTangents!==Pe||Re.morphTargets!==Ce||Re.morphNormals!==He||Re.morphColors!==rt||Re.toneMapping!==ft||Re.morphTargetsCount!==ot)&&(je=!0):(je=!0,Re.__version=G.version);let Ht=Re.currentProgram;je===!0&&(Ht=fr(G,I,z));let hi=!1,Vt=!1,Gi=!1;const ct=Ht.getUniforms(),Ot=Re.uniforms;if(xe.useProgram(Ht.program)&&(hi=!0,Vt=!0,Gi=!0),G.id!==V&&(V=G.id,Vt=!0),hi||q!==M){xe.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),ct.setValue(C,"projectionMatrix",M.projectionMatrix),ct.setValue(C,"viewMatrix",M.matrixWorldInverse);const Bt=ct.map.cameraPosition;Bt!==void 0&&Bt.setValue(C,ke.setFromMatrixPosition(M.matrixWorld)),et.logarithmicDepthBuffer&&ct.setValue(C,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ct.setValue(C,"isOrthographic",M.isOrthographicCamera===!0),q!==M&&(q=M,Vt=!0,Gi=!0)}if(Re.needsLights&&(nt.state.directionalShadowMap.length>0&&ct.setValue(C,"directionalShadowMap",nt.state.directionalShadowMap,L),nt.state.spotShadowMap.length>0&&ct.setValue(C,"spotShadowMap",nt.state.spotShadowMap,L),nt.state.pointShadowMap.length>0&&ct.setValue(C,"pointShadowMap",nt.state.pointShadowMap,L)),z.isSkinnedMesh){ct.setOptional(C,z,"bindMatrix"),ct.setOptional(C,z,"bindMatrixInverse");const It=z.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),ct.setValue(C,"boneTexture",It.boneTexture,L))}z.isBatchedMesh&&(ct.setOptional(C,z,"batchingTexture"),ct.setValue(C,"batchingTexture",z._matricesTexture,L),ct.setOptional(C,z,"batchingIdTexture"),ct.setValue(C,"batchingIdTexture",z._indirectTexture,L),ct.setOptional(C,z,"batchingColorTexture"),z._colorsTexture!==null&&ct.setValue(C,"batchingColorTexture",z._colorsTexture,L));const Yt=H.morphAttributes;if((Yt.position!==void 0||Yt.normal!==void 0||Yt.color!==void 0)&&Ge.update(z,H,Ht),(Vt||Re.receiveShadow!==z.receiveShadow)&&(Re.receiveShadow=z.receiveShadow,ct.setValue(C,"receiveShadow",z.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Ot.envMap.value=ve,Ot.flipEnvMap.value=ve.isCubeTexture&&ve.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(Ot.envMapIntensity.value=I.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=Kg()),Vt&&(ct.setValue(C,"toneMappingExposure",x.toneMappingExposure),Re.needsLights&&Pc(Ot,Gi),ce&&G.fog===!0&&De.refreshFogUniforms(Ot,ce),De.refreshMaterialUniforms(Ot,G,Fe,Ue,w.state.transmissionRenderTarget[M.id]),Kr.upload(C,xo(Re),Ot,L)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Kr.upload(C,xo(Re),Ot,L),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ct.setValue(C,"center",z.center),ct.setValue(C,"modelViewMatrix",z.modelViewMatrix),ct.setValue(C,"normalMatrix",z.normalMatrix),ct.setValue(C,"modelMatrix",z.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const It=G.uniformsGroups;for(let Bt=0,us=It.length;Bt<us;Bt++){const Xn=It[Bt];Q.update(Xn,Ht),Q.bind(Xn,Ht)}}return Ht}function Pc(M,I){M.ambientLightColor.needsUpdate=I,M.lightProbe.needsUpdate=I,M.directionalLights.needsUpdate=I,M.directionalLightShadows.needsUpdate=I,M.pointLights.needsUpdate=I,M.pointLightShadows.needsUpdate=I,M.spotLights.needsUpdate=I,M.spotLightShadows.needsUpdate=I,M.rectAreaLights.needsUpdate=I,M.hemisphereLights.needsUpdate=I}function Dc(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(M,I,H){const G=g.get(M);G.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),g.get(M.texture).__webglTexture=I,g.get(M.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:H,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,I){const H=g.get(M);H.__webglFramebuffer=I,H.__useDefaultFramebuffer=I===void 0};const Lc=C.createFramebuffer();this.setRenderTarget=function(M,I=0,H=0){U=M,P=I,F=H;let G=null,z=!1,ce=!1;if(M){const de=g.get(M);if(de.__useDefaultFramebuffer!==void 0){xe.bindFramebuffer(C.FRAMEBUFFER,de.__webglFramebuffer),k.copy(M.viewport),W.copy(M.scissor),$=M.scissorTest,xe.viewport(k),xe.scissor(W),xe.setScissorTest($),V=-1;return}else if(de.__webglFramebuffer===void 0)L.setupRenderTarget(M);else if(de.__hasExternalTextures)L.rebindTextures(M,g.get(M.texture).__webglTexture,g.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Pe=M.depthTexture;if(de.__boundDepthTexture!==Pe){if(Pe!==null&&g.has(Pe)&&(M.width!==Pe.image.width||M.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(M)}}const ve=M.texture;(ve.isData3DTexture||ve.isDataArrayTexture||ve.isCompressedArrayTexture)&&(ce=!0);const Ee=g.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ee[I])?G=Ee[I][H]:G=Ee[I],z=!0):M.samples>0&&L.useMultisampledRTT(M)===!1?G=g.get(M).__webglMultisampledFramebuffer:Array.isArray(Ee)?G=Ee[H]:G=Ee,k.copy(M.viewport),W.copy(M.scissor),$=M.scissorTest}else k.copy(K).multiplyScalar(Fe).floor(),W.copy(j).multiplyScalar(Fe).floor(),$=pe;if(H!==0&&(G=Lc),xe.bindFramebuffer(C.FRAMEBUFFER,G)&&xe.drawBuffers(M,G),xe.viewport(k),xe.scissor(W),xe.setScissorTest($),z){const de=g.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+I,de.__webglTexture,H)}else if(ce){const de=I;for(let ve=0;ve<M.textures.length;ve++){const Ee=g.get(M.textures[ve]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+ve,Ee.__webglTexture,H,de)}}else if(M!==null&&H!==0){const de=g.get(M.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,de.__webglTexture,H)}V=-1},this.readRenderTargetPixels=function(M,I,H,G,z,ce,_e,de=0){if(!(M&&M.isWebGLRenderTarget)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ve=g.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(ve=ve[_e]),ve){xe.bindFramebuffer(C.FRAMEBUFFER,ve);try{const Ee=M.textures[de],Pe=Ee.format,Ce=Ee.type;if(!et.textureFormatReadable(Pe)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Ce)){Je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=M.width-G&&H>=0&&H<=M.height-z&&(M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+de),C.readPixels(I,H,G,z,re.convert(Pe),re.convert(Ce),ce))}finally{const Ee=U!==null?g.get(U).__webglFramebuffer:null;xe.bindFramebuffer(C.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(M,I,H,G,z,ce,_e,de=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ve=g.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&_e!==void 0&&(ve=ve[_e]),ve)if(I>=0&&I<=M.width-G&&H>=0&&H<=M.height-z){xe.bindFramebuffer(C.FRAMEBUFFER,ve);const Ee=M.textures[de],Pe=Ee.format,Ce=Ee.type;if(!et.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Ce))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const He=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,He),C.bufferData(C.PIXEL_PACK_BUFFER,ce.byteLength,C.STREAM_READ),M.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+de),C.readPixels(I,H,G,z,re.convert(Pe),re.convert(Ce),0);const rt=U!==null?g.get(U).__webglFramebuffer:null;xe.bindFramebuffer(C.FRAMEBUFFER,rt);const ft=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await ad(C,ft,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,He),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,ce),C.deleteBuffer(He),C.deleteSync(ft),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,I=null,H=0){const G=Math.pow(2,-H),z=Math.floor(M.image.width*G),ce=Math.floor(M.image.height*G),_e=I!==null?I.x:0,de=I!==null?I.y:0;L.setTexture2D(M,0),C.copyTexSubImage2D(C.TEXTURE_2D,H,0,0,_e,de,z,ce),xe.unbindTexture()};const Ic=C.createFramebuffer(),Uc=C.createFramebuffer();this.copyTextureToTexture=function(M,I,H=null,G=null,z=0,ce=null){ce===null&&(z!==0?(sr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ce=z,z=0):ce=0);let _e,de,ve,Ee,Pe,Ce,He,rt,ft;const pt=M.isCompressedTexture?M.mipmaps[ce]:M.image;if(H!==null)_e=H.max.x-H.min.x,de=H.max.y-H.min.y,ve=H.isBox3?H.max.z-H.min.z:1,Ee=H.min.x,Pe=H.min.y,Ce=H.isBox3?H.min.z:0;else{const Yt=Math.pow(2,-z);_e=Math.floor(pt.width*Yt),de=Math.floor(pt.height*Yt),M.isDataArrayTexture?ve=pt.depth:M.isData3DTexture?ve=Math.floor(pt.depth*Yt):ve=1,Ee=0,Pe=0,Ce=0}G!==null?(He=G.x,rt=G.y,ft=G.z):(He=0,rt=0,ft=0);const ot=re.convert(I.format),Re=re.convert(I.type);let nt;I.isData3DTexture?(L.setTexture3D(I,0),nt=C.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(L.setTexture2DArray(I,0),nt=C.TEXTURE_2D_ARRAY):(L.setTexture2D(I,0),nt=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,I.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,I.unpackAlignment);const je=C.getParameter(C.UNPACK_ROW_LENGTH),Ht=C.getParameter(C.UNPACK_IMAGE_HEIGHT),hi=C.getParameter(C.UNPACK_SKIP_PIXELS),Vt=C.getParameter(C.UNPACK_SKIP_ROWS),Gi=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,pt.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,pt.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Ee),C.pixelStorei(C.UNPACK_SKIP_ROWS,Pe),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ce);const ct=M.isDataArrayTexture||M.isData3DTexture,Ot=I.isDataArrayTexture||I.isData3DTexture;if(M.isDepthTexture){const Yt=g.get(M),It=g.get(I),Bt=g.get(Yt.__renderTarget),us=g.get(It.__renderTarget);xe.bindFramebuffer(C.READ_FRAMEBUFFER,Bt.__webglFramebuffer),xe.bindFramebuffer(C.DRAW_FRAMEBUFFER,us.__webglFramebuffer);for(let Xn=0;Xn<ve;Xn++)ct&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,g.get(M).__webglTexture,z,Ce+Xn),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,g.get(I).__webglTexture,ce,ft+Xn)),C.blitFramebuffer(Ee,Pe,_e,de,He,rt,_e,de,C.DEPTH_BUFFER_BIT,C.NEAREST);xe.bindFramebuffer(C.READ_FRAMEBUFFER,null),xe.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(z!==0||M.isRenderTargetTexture||g.has(M)){const Yt=g.get(M),It=g.get(I);xe.bindFramebuffer(C.READ_FRAMEBUFFER,Ic),xe.bindFramebuffer(C.DRAW_FRAMEBUFFER,Uc);for(let Bt=0;Bt<ve;Bt++)ct?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Yt.__webglTexture,z,Ce+Bt):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Yt.__webglTexture,z),Ot?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,It.__webglTexture,ce,ft+Bt):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,It.__webglTexture,ce),z!==0?C.blitFramebuffer(Ee,Pe,_e,de,He,rt,_e,de,C.COLOR_BUFFER_BIT,C.NEAREST):Ot?C.copyTexSubImage3D(nt,ce,He,rt,ft+Bt,Ee,Pe,_e,de):C.copyTexSubImage2D(nt,ce,He,rt,Ee,Pe,_e,de);xe.bindFramebuffer(C.READ_FRAMEBUFFER,null),xe.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else Ot?M.isDataTexture||M.isData3DTexture?C.texSubImage3D(nt,ce,He,rt,ft,_e,de,ve,ot,Re,pt.data):I.isCompressedArrayTexture?C.compressedTexSubImage3D(nt,ce,He,rt,ft,_e,de,ve,ot,pt.data):C.texSubImage3D(nt,ce,He,rt,ft,_e,de,ve,ot,Re,pt):M.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,ce,He,rt,_e,de,ot,Re,pt.data):M.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,ce,He,rt,pt.width,pt.height,ot,pt.data):C.texSubImage2D(C.TEXTURE_2D,ce,He,rt,_e,de,ot,Re,pt);C.pixelStorei(C.UNPACK_ROW_LENGTH,je),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ht),C.pixelStorei(C.UNPACK_SKIP_PIXELS,hi),C.pixelStorei(C.UNPACK_SKIP_ROWS,Vt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Gi),ce===0&&I.generateMipmaps&&C.generateMipmap(nt),xe.unbindTexture()},this.initRenderTarget=function(M){g.get(M).__webglFramebuffer===void 0&&L.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?L.setTextureCube(M,0):M.isData3DTexture?L.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?L.setTexture2DArray(M,0):L.setTexture2D(M,0),xe.unbindTexture()},this.resetState=function(){P=0,F=0,U=null,xe.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ze._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ze._getUnpackColorSpace()}}const Rl={type:"change"},ho={type:"start"},Ec={type:"end"},Gr=new ns,Pl=new Fn,$g=Math.cos(70*ld.DEG2RAD),xt=new N,Gt=2*Math.PI,st={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ws=1e-6;class Zg extends jd{constructor(e,t=null){super(e,t),this.state=st.NONE,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Di.ROTATE,MIDDLE:Di.DOLLY,RIGHT:Di.PAN},this.touches={ONE:Ri.ROTATE,TWO:Ri.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new li,this._lastTargetPosition=new N,this._quat=new li().setFromUnitVectors(e.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new rl,this._sphericalDelta=new rl,this._scale=1,this._panOffset=new N,this._rotateStart=new Ne,this._rotateEnd=new Ne,this._rotateDelta=new Ne,this._panStart=new Ne,this._panEnd=new Ne,this._panDelta=new Ne,this._dollyStart=new Ne,this._dollyEnd=new Ne,this._dollyDelta=new Ne,this._dollyDirection=new N,this._mouse=new Ne,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Jg.bind(this),this._onPointerDown=jg.bind(this),this._onPointerUp=Qg.bind(this),this._onContextMenu=a0.bind(this),this._onMouseWheel=n0.bind(this),this._onKeyDown=i0.bind(this),this._onTouchStart=r0.bind(this),this._onTouchMove=s0.bind(this),this._onMouseDown=e0.bind(this),this._onMouseMove=t0.bind(this),this._interceptControlDown=o0.bind(this),this._interceptControlUp=l0.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Rl),this.update(),this.state=st.NONE}update(e=null){const t=this.object.position;xt.copy(t).sub(this.target),xt.applyQuaternion(this._quat),this._spherical.setFromVector3(xt),this.autoRotate&&this.state===st.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=Gt:i>Math.PI&&(i-=Gt),r<-Math.PI?r+=Gt:r>Math.PI&&(r-=Gt),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(xt.setFromSpherical(this._spherical),xt.applyQuaternion(this._quatInverse),t.copy(this.target).add(xt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=xt.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const o=new N(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new N(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=xt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Gr.origin.copy(this.object.position),Gr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Gr.direction))<$g?this.object.lookAt(this.target):(Pl.setFromNormalAndCoplanarPoint(this.object.up,this.target),Gr.intersectPlane(Pl,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Ws||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ws||this._lastTargetPosition.distanceToSquared(this.target)>Ws?(this.dispatchEvent(Rl),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Gt/60*this.autoRotateSpeed*e:Gt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){xt.setFromMatrixColumn(t,0),xt.multiplyScalar(-e),this._panOffset.add(xt)}_panUp(e,t){this.screenSpacePanning===!0?xt.setFromMatrixColumn(t,1):(xt.setFromMatrixColumn(t,0),xt.crossVectors(this.object.up,xt)),xt.multiplyScalar(e),this._panOffset.add(xt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;xt.copy(r).sub(this.target);let s=xt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,a=i.width,o=i.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Gt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Gt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Gt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ne,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function jg(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Jg(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Qg(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ec),this.state=st.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function e0(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Di.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=st.DOLLY;break;case Di.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=st.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=st.ROTATE}break;case Di.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=st.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=st.PAN}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(ho)}function t0(n){switch(this.state){case st.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case st.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case st.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function n0(n){this.enabled===!1||this.enableZoom===!1||this.state!==st.NONE||(n.preventDefault(),this.dispatchEvent(ho),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(Ec))}function i0(n){this.enabled!==!1&&this._handleKeyDown(n)}function r0(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Ri.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=st.TOUCH_ROTATE;break;case Ri.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=st.TOUCH_PAN;break;default:this.state=st.NONE}break;case 2:switch(this.touches.TWO){case Ri.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=st.TOUCH_DOLLY_PAN;break;case Ri.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=st.TOUCH_DOLLY_ROTATE;break;default:this.state=st.NONE}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(ho)}function s0(n){switch(this._trackPointer(n),this.state){case st.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case st.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case st.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case st.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=st.NONE}}function a0(n){this.enabled!==!1&&n.preventDefault()}function o0(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function l0(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const c0={temperatureK:293.15,pressureAtm:1,gravityMps2:9.81},Dl={H:1,C:4,N:3,O:2,Na:1,Cl:1,S:2,P:3},u0=[{symbols:["O","H"],bondClass:"covalent",order:1,restLength:.52,captureRadius:1.75,priority:100,breakK:4200,label:"O-H covalent"},{symbols:["C","H"],bondClass:"covalent",order:1,restLength:.58,captureRadius:1.55,priority:80,breakK:4300,label:"C-H covalent"},{symbols:["N","H"],bondClass:"covalent",order:1,restLength:.56,captureRadius:1.55,priority:78,breakK:3900,label:"N-H covalent"},{symbols:["C","O"],bondClass:"covalent",order:2,restLength:.62,captureRadius:1.45,priority:72,breakK:4700,label:"C-O covalent"},{symbols:["Na","Cl"],bondClass:"ionic",order:1,restLength:.72,captureRadius:1.95,priority:95,breakK:3400,label:"Na-Cl ionic"},{symbols:["S","H"],bondClass:"covalent",order:1,restLength:.62,captureRadius:1.45,priority:55,breakK:3400,label:"S-H covalent"},{symbols:["P","H"],bondClass:"covalent",order:1,restLength:.64,captureRadius:1.45,priority:52,breakK:3400,label:"P-H covalent"}],d0=new Set(["alkali metal","alkaline earth","post-transition metal","transition metal","actinide"]),tr=(n=0,e=0,t=0)=>({x:n,y:e,z:t}),nn=(n,e,t)=>{n.x+=e.x*t,n.y+=e.y*t,n.z+=e.z*t},ji=(n,e)=>tr(n.x-e.x,n.y-e.y,n.z-e.z),Ci=n=>Math.hypot(n.x,n.y,n.z),Xs=(n,e)=>{const t=Math.max(1e-6,Ci(n)),i=e/t;return n.x*=i,n.y*=i,n.z*=i,n},Tc=(n,e)=>{const[t,i]=[n,e].sort();return`${t}-${i}`},h0=n=>Tc(n[0],n[1]),f0=new Map(u0.map(n=>[h0(n.symbols),n])),Ac=n=>d0.has(Vn(n).category),Ll=(n,e)=>{const t=f0.get(Tc(n,e));return t||(n===e&&Ac(n)?{symbols:[n,e],bondClass:"metallic",order:1,restLength:.82,captureRadius:1.25,priority:24,breakK:2200,label:`${n}-${e} metallic`}:null)},p0=n=>Dl[n]?Dl[n]:Ac(n)?6:0,m0=n=>{const e=Object.keys(n).filter(r=>n[r]>0),i=e.every(r=>["Na","Cl"].includes(r))?["Na","Cl"]:e.includes("C")?["C","H",...e.filter(r=>!["C","H"].includes(r)).sort()]:["H","O",...e.filter(r=>!["H","O"].includes(r)).sort()];return[...new Set(i)].filter(r=>n[r]>0).map(r=>`${r}${n[r]===1?"":n[r]}`).join("")};class g0{constructor({seed:e="reactive-atoms-v0",extent:t=4.7}={}){this.rng=Hc(Ol(e)),this.extent=t,this.atoms=[],this.bonds=[],this.nextAtomId=1,this.nextBondId=1,this.timeS=0,this.environment={...c0}}setEnvironment(e={}){this.environment={temperatureK:bt(Number(e.temperatureK??this.environment.temperatureK),20,6e3),pressureAtm:bt(Number(e.pressureAtm??this.environment.pressureAtm),.01,250),gravityMps2:bt(Number(e.gravityMps2??this.environment.gravityMps2),0,100)}}clear(){this.atoms=[],this.bonds=[],this.nextAtomId=1,this.nextBondId=1,this.timeS=0}addAtoms(e,t=1){const i=Vn(e),r=Math.max(0,Math.min(80,Math.floor(Number(t)||0))),s=[];for(let a=0;a<r;a++){const o=this.atoms.length+1,c=o*2.399963229728653,l=.22+Math.cbrt(o)*.28,u=(o%7-3)*.13,d=Math.sqrt(this.environment.temperatureK/293.15)*.34,f={id:this.nextAtomId++,symbol:i.symbol,name:i.name,color:i.color,valenceCapacity:p0(i.symbol),position:tr(Math.cos(c)*l,u,Math.sin(c)*l),velocity:tr((this.rng()-.5)*d,(this.rng()-.5)*d,(this.rng()-.5)*d),force:tr()};this.atoms.push(f),s.push(f)}return s}addWaterRecipe(e=5){const t=Math.max(1,Math.min(20,Math.floor(Number(e)||5))),i=this.addAtoms("O",t),r=this.addAtoms("H",t*2);return[...i,...r]}bondSlotsUsed(e){return this.bonds.reduce((t,i)=>i.a===e||i.b===e?t+(i.order||1):t,0)}canBond(e,t,i){return!i||this.bonds.some(r=>r.a===e.id&&r.b===t.id||r.a===t.id&&r.b===e.id)?!1:this.bondSlotsUsed(e.id)+(i.order||1)<=e.valenceCapacity&&this.bondSlotsUsed(t.id)+(i.order||1)<=t.valenceCapacity}addBond(e,t,i){const r={id:this.nextBondId++,a:e.id,b:t.id,bondClass:i.bondClass,order:i.order||1,restLength:i.restLength,breakK:i.breakK,label:i.label,formedAtS:this.timeS};return this.bonds.push(r),r}update(e=1/60){const t=bt(e,0,.05),i=Math.max(1,Math.ceil(t/.012)),r=t/i;for(let s=0;s<i;s++)this.step(r)}step(e){this.timeS+=e;for(const r of this.atoms)r.force=tr();const t=.24*Math.sqrt(this.environment.pressureAtm),i=Math.sqrt(this.environment.temperatureK/293.15);for(const r of this.atoms)nn(r.force,r.position,-t),r.force.y-=this.environment.gravityMps2*.055,r.velocity.x+=(this.rng()-.5)*i*.028*e,r.velocity.y+=(this.rng()-.5)*i*.028*e,r.velocity.z+=(this.rng()-.5)*i*.028*e;this.applyPairForces(),this.applyBondForces(),this.breakHotOrStretchedBonds(e),this.integrate(e),this.attemptBonding()}applyPairForces(){for(let e=0;e<this.atoms.length;e++)for(let t=e+1;t<this.atoms.length;t++){const i=this.atoms[e],r=this.atoms[t],s=ji(r.position,i.position),a=Math.max(.001,Ci(s)),o=Xs(s,1),c=Math.max(0,.34-a)*7.2;c>0&&(nn(i.force,o,-c),nn(r.force,o,c));const l=Ll(i.symbol,r.symbol);if(this.canBond(i,r,l)&&a<3.4){const u=l.priority/100*.42/Math.max(.4,a);nn(i.force,o,u),nn(r.force,o,-u)}}}applyBondForces(){const e=new Map(this.atoms.map(t=>[t.id,t]));for(const t of this.bonds){const i=e.get(t.a),r=e.get(t.b);if(!i||!r)continue;const s=ji(r.position,i.position),a=Math.max(.001,Ci(s)),o=Xs(s,1),c=a-t.restLength,l=t.bondClass==="ionic"?3.2:t.bondClass==="metallic"?1.7:4.4,u=c*l;nn(i.force,o,u),nn(r.force,o,-u);const d=.05,f=ji(r.velocity,i.velocity),p=(f.x*o.x+f.y*o.y+f.z*o.z)*d;nn(i.force,o,p),nn(r.force,o,-p)}}integrate(e){const t=this.extent*.5,i=bt(.992-this.environment.pressureAtm*8e-4,.94,.994);for(const r of this.atoms){nn(r.velocity,r.force,e),Ci(r.velocity)>6&&Xs(r.velocity,6),nn(r.position,r.velocity,e),r.velocity.x*=i,r.velocity.y*=i,r.velocity.z*=i;for(const a of["x","y","z"])r.position[a]>t?(r.position[a]=t,r.velocity[a]*=-.68):r.position[a]<-t&&(r.position[a]=-t,r.velocity[a]*=-.68)}}attemptBonding(){const e=[];for(let i=0;i<this.atoms.length;i++)for(let r=i+1;r<this.atoms.length;r++){const s=this.atoms[i],a=this.atoms[r],o=Ll(s.symbol,a.symbol);if(!this.canBond(s,a,o)||this.environment.temperatureK>o.breakK*.92)continue;const c=Ci(ji(a.position,s.position)),l=bt(1+Math.log1p(this.environment.pressureAtm)*.16,1,1.75),u=o.captureRadius*l;c<=u&&e.push({a:s,b:a,rule:o,dist:c})}e.sort((i,r)=>r.rule.priority-i.rule.priority||i.dist-r.dist);let t=0;for(const i of e){if(t>=6)break;this.canBond(i.a,i.b,i.rule)&&(this.addBond(i.a,i.b,i.rule),t+=1)}}breakHotOrStretchedBonds(e){const t=new Map(this.atoms.map(i=>[i.id,i]));this.bonds=this.bonds.filter(i=>{const r=t.get(i.a),s=t.get(i.b);if(!r||!s||Ci(ji(s.position,r.position))>i.restLength*3.8)return!1;if(this.environment.temperatureK<=i.breakK)return!0;const o=bt((this.environment.temperatureK-i.breakK)/i.breakK,0,1)*e*.8;return this.rng()>o})}getComposition(){return this.atoms.reduce((e,t)=>(e[t.symbol]=(e[t.symbol]||0)+1,e),{})}getMoleculeSummary(){const e=new Map(this.atoms.map(a=>[a.id,a.id])),t=a=>{let o=e.get(a);for(;o!==e.get(o);)o=e.get(o);return o},i=(a,o)=>{const c=t(a),l=t(o);c!==l&&e.set(l,c)};for(const a of this.bonds)i(a.a,a.b);const r=new Map;for(const a of this.atoms){const o=t(a.id);r.has(o)||r.set(o,[]),r.get(o).push(a)}const s=new Map;for(const a of r.values()){const o=a.reduce((u,d)=>(u[d.symbol]=(u[d.symbol]||0)+1,u),{}),c=m0(o)||"n/a",l=s.get(c)||{formula:c,count:0,atomCount:a.length};l.count+=1,s.set(c,l)}return[...s.values()].sort((a,o)=>o.atomCount-a.atomCount||a.formula.localeCompare(o.formula))}getBondSummary(){return this.bonds.reduce((e,t)=>(e[t.bondClass]=(e[t.bondClass]||0)+1,e),{})}getSummary(){const e=[...new Set(this.atoms.filter(t=>t.valenceCapacity===0).map(t=>t.symbol))];return{model:"toy-reactive-atoms-v0",timeS:this.timeS,atomCount:this.atoms.length,bondCount:this.bonds.length,composition:this.getComposition(),bondSummary:this.getBondSummary(),molecules:this.getMoleculeSummary(),environment:{...this.environment},warnings:["Toy dynamics: heuristic valence/bond rules, not validated quantum chemistry.",...e.length?[`No bond rule for: ${e.join(", ")}`]:[]]}}getSnapshot(){return{...this.getSummary(),atoms:this.atoms.map(e=>({id:e.id,symbol:e.symbol,position:{...e.position},velocity:{...e.velocity},valenceUsed:this.bondSlotsUsed(e.id),valenceCapacity:e.valenceCapacity})),bonds:this.bonds.map(e=>({...e}))}}}const _0=n=>{const e=Vn(n);return n==="H"?.12:["O","N","C"].includes(n)?.18:["Na","Cl"].includes(n)?.22:Math.min(.28,.13+Math.cbrt(e.Z)*.03)},v0=n=>{const e=Vn(n.symbol),t=e.color||"#d7fff0",i=new Dt(new ur(_0(n.symbol),32,24),new dr({color:t,emissive:t,emissiveIntensity:.08,roughness:.38,metalness:e.category.includes("metal")?.22:.03}));return i.name=`reactive-atom:${n.symbol}:${n.id}`,i.userData={id:n.id,symbol:n.symbol},i},x0=n=>{const e=kn[n.bondClass]||kn.unknown,t=n.bondClass==="ionic"?.034:n.bondClass==="metallic"?.026:.025,i=new Dt(new rs(t,t,1,18),new dr({color:e.color,emissive:e.emissive,emissiveIntensity:n.bondClass==="ionic"?.28:.18,roughness:.38,transparent:!0,opacity:n.bondClass==="ionic"?.76:.9}));return i.name=`reactive-bond:${n.bondClass}:${n.id}`,i.userData={id:n.id,bondClass:n.bondClass,label:n.label},i},M0=(n,e,t)=>{const i=new N(e.x,e.y,e.z),r=new N(t.x,t.y,t.z),s=i.clone().lerp(r,.5),a=r.clone().sub(i),o=Math.max(.001,a.length());n.position.copy(s),n.scale.set(1,o,1),n.quaternion.setFromUnitVectors(new N(0,1,0),a.normalize())},Ji=n=>{n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()};class b0{constructor(){this.simulation=new g0,this.group=new si,this.group.name="reactive-atom-sandbox",this.atomMeshes=new Map,this.bondMeshes=new Map,this.shell=new Dt(new di(this.simulation.extent,this.simulation.extent,this.simulation.extent),new is({color:"#66f7c0",wireframe:!0,transparent:!0,opacity:.2})),this.shell.name="reactive-boundary",this.group.add(this.shell)}setEnvironment(e){this.simulation.setEnvironment(e)}addAtoms(e,t){const i=this.simulation.addAtoms(e,t);return this.sync(),i}addWaterRecipe(e){const t=this.simulation.addWaterRecipe(e);return this.sync(),t}clear(){this.simulation.clear(),this.sync()}update(e){this.simulation.update(e),this.sync()}getSummary(){return this.simulation.getSummary()}getSnapshot(){return this.simulation.getSnapshot()}sync(){var r,s;const e=new Set(this.simulation.atoms.map(a=>a.id));for(const[a,o]of this.atomMeshes.entries())e.has(a)||(this.group.remove(o),Ji(o),this.atomMeshes.delete(a));for(const a of this.simulation.atoms){let o=this.atomMeshes.get(a.id);o||(o=v0(a),this.atomMeshes.set(a.id,o),this.group.add(o)),o.position.set(a.position.x,a.position.y,a.position.z)}const t=new Set(this.simulation.bonds.map(a=>a.id));for(const[a,o]of this.bondMeshes.entries())t.has(a)||(this.group.remove(o),Ji(o),this.bondMeshes.delete(a));const i=new Map(this.simulation.atoms.map(a=>[a.id,a]));for(const a of this.simulation.bonds){let o=this.bondMeshes.get(a.id);o||(o=x0(a),this.bondMeshes.set(a.id,o),this.group.add(o));const c=(r=i.get(a.a))==null?void 0:r.position,l=(s=i.get(a.b))==null?void 0:s.position;c&&l&&M0(o,c,l)}}dispose(){for(const e of this.atomMeshes.values())Ji(e);for(const e of this.bondMeshes.values())Ji(e);Ji(this.shell),this.atomMeshes.clear(),this.bondMeshes.clear()}}const Il={solid:{spacing:1.2,jitter:.02,spread:4.4,moleculeScale:.95},liquid:{spacing:1.18,jitter:.22,spread:4.5,moleculeScale:1},gas:{spacing:2.05,jitter:.55,spread:6.4,moleculeScale:1},mixed:{spacing:1.45,jitter:.35,spread:5.2,moleculeScale:.98}},S0={H:{radius:.105,color:"#f3fbff"},C:{radius:.17,color:"#9ea7ad"},N:{radius:.16,color:"#7aa7ff"},O:{radius:.19,color:"#ff6f7d"},Na:{radius:.19,color:"#9fd0ff"},Cl:{radius:.21,color:"#8dff9a"}},y0=n=>{const e=Vn(n),t=S0[n]||{radius:.16,color:e.color||"#d7fff0"},i=new Dt(new ur(t.radius,28,20),new dr({color:t.color,roughness:.42,metalness:.03,emissive:t.color,emissiveIntensity:.035}));return i.name=`atom:${n}`,i},E0=(n,e,t={})=>{const i=new N(...n),r=new N(...e),s=i.clone().lerp(r,.5),a=r.clone().sub(i),o=a.length(),c=t.bondClass||"unknown",l=kn[c]||kn.unknown,u=Math.max(1,Math.min(3,Number(t.order||1))),d=c==="ionic"?.03:.018+u*.005,f=new Dt(new rs(d,d,o,18),new dr({color:l.color,emissive:l.emissive,emissiveIntensity:c==="ionic"?.2:.14,roughness:.42,transparent:!0,opacity:c==="ionic"?.72:.88}));return f.name=`bond:${c}`,f.userData={bondClass:c,order:u,label:t.label||l.label,from:t.from,to:t.to},f.position.copy(s),f.quaternion.setFromUnitVectors(new N(0,1,0),a.normalize()),f},T0=n=>{var i,r;const e=Xa(n),t=new si;t.name=`molecule:${n}`;for(const s of e.atoms){const a=y0(s.symbol);a.position.set(...s.position),t.add(a)}for(const s of e.bonds){const a=(i=e.atoms[s.from])==null?void 0:i.position,o=(r=e.atoms[s.to])==null?void 0:r.position;a&&o&&t.add(E0(a,o,s))}return t.userData={formula:n,atomCount:e.atoms.length,bondCount:e.bonds.length,bondClasses:[...new Set(e.bonds.map(s=>s.bondClass||"unknown"))]},t},A0=n=>{var t;const e=((t=n==null?void 0:n.state)==null?void 0:t.composition)||{};return Object.keys(e)[0]||"H2O"},w0=n=>{var u;const e=((u=n==null?void 0:n.state)==null?void 0:u.phase)||"liquid",t=Il[e]||Il.liquid,i=A0(n),r=new si;r.name="material-phase-group";const s=e==="gas"?16:27,a=Math.ceil(Math.cbrt(s));let o=0;for(let d=0;d<a;d++)for(let f=0;f<a;f++)for(let p=0;p<a&&!(o>=s);p++){const _=T0(i);_.name=`molecule:${i}:${o}`,_.scale.setScalar(t.moleculeScale),_.position.set((p-(a-1)/2)*t.spacing,(f-(a-1)/2)*t.spacing,(d-(a-1)/2)*t.spacing),_.position.x+=Math.sin(o*7.13)*t.jitter,_.position.y+=Math.cos(o*3.81)*t.jitter,_.position.z+=Math.sin(o*4.47)*t.jitter,_.rotation.set(o*.41,o*.27,o*.19),r.add(_),o+=1}const c=new Dt(new di(t.spread,t.spread,t.spread),new is({color:e==="solid"?"#9fd8ff":e==="gas"?"#ffe2a1":"#7af0d1",wireframe:!0,transparent:!0,opacity:.24}));r.add(c);const l=Xa(i);return r.userData={formula:i,moleculeCount:s,atomsPerMolecule:l.atoms.length,bondsPerMolecule:l.bonds.length,bondClasses:[...new Set(l.bonds.map(d=>d.bondClass||"unknown"))],bondEvents:qa(i),extent:t.spread},r},C0=()=>{const n=document.createElement("canvas");n.width=64,n.height=64;const e=n.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.45,"rgba(255,255,255,0.8)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),new zd(n)},R0=n=>{const e=n.replace("#",""),t=Number.parseInt(e.length===3?e.split("").map(i=>i+i).join(""):e,16);return{r:(t>>16&255)/255,g:(t>>8&255)/255,b:(t&255)/255}};class P0{constructor(e){this.container=e,this.scene=new Ld,this.camera=new jt(45,1,.01,2e3),this.camera.position.set(7,5,8),this.renderer=new Yg({antialias:!0,alpha:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setClearColor(132099,1),this.container.appendChild(this.renderer.domElement),this.controls=new Zg(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.autoRotate=!0,this.controls.autoRotateSpeed=.45,this.controls.enablePan=!1,this.scene.add(new qd("#89ffcb",.35));const t=new il("#e9fff7",.85);t.position.set(5,7,3),this.scene.add(t);const i=new il("#ffcc66",.25);i.position.set(-4,2,-5),this.scene.add(i),this.grid=new $d(12,24,"#18382d","#102a22"),this.grid.position.y=-4,this.scene.add(this.grid),this.axes=new Zd(3),this.axes.visible=!1,this.scene.add(this.axes),this.pointTexture=C0(),this.cloud=null,this.nucleus=null,this.waterGroup=null,this.reactiveView=new b0,this.scene.add(this.reactiveView.group),this.orbitalExtent=8,this.materialVisualKey="",this.mode="orbital",this.clock=new Yd,this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(this.container),this.resize(),this.animate()}resize(){const e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight);this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}setGuidesVisible(e){this.grid.visible=e,this.axes.visible=e}setRotationEnabled(e){this.controls.autoRotate=e}setMode(e){this.mode=e,this.cloud&&(this.cloud.visible=e==="orbital"||e==="wave"),this.nucleus&&(this.nucleus.visible=e==="orbital"||e==="wave"),this.waterGroup&&(this.waterGroup.visible=e==="water"),this.reactiveView.group.visible=e==="reactive",e==="water"&&this.waterGroup&&this.fitMaterialCell(this.waterGroup.userData.extent||5),e==="reactive"&&this.fitReactiveCell(this.reactiveView.simulation.extent),e!=="water"&&e!=="reactive"&&this.orbitalExtent&&this.fitCamera(this.orbitalExtent)}setOrbital({points:e,colors:t,element:i,extentBohr:r}){this.cloud&&(this.scene.remove(this.cloud),this.cloud.geometry.dispose(),this.cloud.material.dispose()),this.nucleus&&(this.scene.remove(this.nucleus),this.nucleus.geometry.dispose(),this.nucleus.material.dispose());const s=R0(i.color||"#9fffd8");for(let l=0;l<t.length;l+=3){const u=t[l];t[l]=u*s.r,t[l+1]=u*s.g,t[l+2]=u*s.b}const a=new Lt;a.setAttribute("position",new Jt(e,3)),a.setAttribute("color",new Jt(t,3));const o=new gc({size:Math.max(.018,Math.min(.055,r/260)),sizeAttenuation:!0,transparent:!0,opacity:.72,vertexColors:!0,map:this.pointTexture,alphaTest:.04,depthWrite:!1});this.cloud=new Bd(a,o),this.scene.add(this.cloud),this.orbitalExtent=r;const c=new Dt(new ur(Math.max(.08,r*.012),32,24),new dr({color:i.color||"#d7fff0",emissive:i.color||"#0d3b30",emissiveIntensity:.15,roughness:.25}));this.nucleus=c,this.scene.add(c),this.fitCamera(r),this.setMode(this.mode)}setWaterPacket(e){var r,s;const t=Object.keys(((r=e==null?void 0:e.state)==null?void 0:r.composition)||{}).join(","),i=`${(e==null?void 0:e.materialId)||"material"}:${((s=e==null?void 0:e.state)==null?void 0:s.phase)||"phase"}:${t}`;if(this.waterGroup&&i===this.materialVisualKey){this.waterGroup.userData.packet=e;return}this.waterGroup&&(this.scene.remove(this.waterGroup),this.waterGroup.traverse(a=>{a.geometry&&a.geometry.dispose(),a.material&&a.material.dispose()})),this.waterGroup=w0(e),this.waterGroup.userData.packet=e,this.materialVisualKey=i,this.scene.add(this.waterGroup),this.setMode(this.mode)}fitCamera(e){const t=Math.max(4,Math.min(60,e)),i=Math.max(7,t*.85);this.camera.near=.01,this.camera.far=Math.max(200,t*12),this.camera.position.set(i,i*.65,i*.9),this.controls.maxDistance=Math.max(30,t*3),this.controls.target.set(0,0,0),this.camera.updateProjectionMatrix()}fitMaterialCell(e=5){const t=Math.max(7.5,e*1.8);this.camera.near=.01,this.camera.far=Math.max(200,e*18),this.camera.position.set(t,t*.65,t*.95),this.controls.maxDistance=Math.max(24,e*5),this.controls.target.set(0,0,0),this.camera.updateProjectionMatrix()}fitReactiveCell(e=5){const t=Math.max(7.5,e*1.85);this.camera.near=.01,this.camera.far=Math.max(200,e*18),this.camera.position.set(t,t*.7,t*.95),this.controls.maxDistance=Math.max(24,e*5),this.controls.target.set(0,0,0),this.camera.updateProjectionMatrix()}setReactiveEnvironment(e){this.reactiveView.setEnvironment(e)}addReactiveAtoms(e,t){return this.reactiveView.addAtoms(e,t)}addReactiveWaterRecipe(e){return this.reactiveView.addWaterRecipe(e)}clearReactiveAtoms(){this.reactiveView.clear()}getReactiveSummary(){return this.reactiveView.getSummary()}getReactiveSnapshot(){return this.reactiveView.getSnapshot()}animate(){requestAnimationFrame(()=>this.animate());const e=Math.min(.05,this.clock.getDelta());this.waterGroup&&this.mode==="water"&&(this.waterGroup.rotation.y+=.002),this.mode==="reactive"&&this.reactiveView.update(e),this.controls.update(),this.renderer.render(this.scene,this.camera)}destroy(){this.resizeObserver.disconnect(),this.reactiveView.dispose(),this.renderer.dispose(),this.container.replaceChildren()}}const D0=document.querySelector("#app"),L0=101325,B={viewMode:"water",elementSymbol:"O",n:2,l:1,m:0,gridSize:28,pointCount:7e4,screeningExchange:!0,relativisticSpinOrbit:!1,correlationMixing:!1,materialId:"water",temperatureK:293.15,pressureAtm:1,gravityMps2:9.81,reactiveElementSymbol:"H",reactiveCount:5,rotating:!0,guides:!1,currentPacket:null,peerSession:null,peerStatus:"standalone",webgpuStatus:"probing",webgpuDetail:"",orbitalStats:null,radialEigenstate:null},I0=nr.map(n=>`<option value="${n.symbol}">${n.symbol} :: ${n.name} :: Z=${n.Z}</option>`).join(""),U0=['<optgroup label="Molecules">',...qs.map(n=>`<option value="${n.id}">${n.label}</option>`),"</optgroup>",'<optgroup label="Elements">',...nr.map(n=>`<option value="element:${n.symbol}">${n.name} (${n.symbol})</option>`),"</optgroup>"].join(""),N0=nr.map(n=>`<option value="${n.symbol}">${n.symbol} :: ${n.name}</option>`).join("");D0.innerHTML=`
  <div class="terminal-shell">
    <section class="viewport-panel">
      <div id="viewport" class="viewport"></div>
      <div class="viewport-hud">
        <div><span>backend</span><strong id="backend-status">webgpu-required</strong></div>
        <div><span>packet</span><strong id="packet-status">pending</strong></div>
        <div><span>peercompute</span><strong id="peer-status">standalone</strong></div>
      </div>
    </section>

    <aside class="control-panel left-panel">
      <header class="panel-header">
        <div class="eyebrow">MATERIALS CONSOLE</div>
        <h1>Schrodinger</h1>
      </header>

      <label class="field">
        <span>View</span>
        <select id="view-mode">
          <option value="water">Material cell</option>
          <option value="reactive">Reactive atoms</option>
          <option value="orbital">Orbital cloud</option>
          <option value="wave">Wave grid</option>
        </select>
      </label>

      <div class="section-label">Atom</div>
      <label class="field">
        <span>Element</span>
        <select id="element-select">${I0}</select>
      </label>

      <label class="field">
        <span>Principal n</span>
        <input id="n-input" type="range" min="1" max="6" step="1" value="${B.n}" />
        <output id="n-output">${B.n}</output>
      </label>

      <label class="field">
        <span>Angular l</span>
        <select id="l-select"></select>
      </label>

      <label class="field">
        <span>Magnetic m</span>
        <select id="m-select"></select>
      </label>

      <label class="field">
        <span>Point samples</span>
        <input id="point-count" type="range" min="10000" max="140000" step="5000" value="${B.pointCount}" />
        <output id="point-output">${B.pointCount.toLocaleString()}</output>
      </label>

      <label class="toggle"><input id="screening" type="checkbox" checked /> <span>screening/exchange</span></label>
      <label class="toggle"><input id="relativistic" type="checkbox" /> <span>relativistic/spin-orbit</span></label>
      <label class="toggle"><input id="correlation" type="checkbox" /> <span>correlation mixing</span></label>

      <div class="button-row">
        <button id="regenerate">regenerate</button>
        <button id="rotate-toggle">pause</button>
        <button id="guides-toggle">guides</button>
      </div>

      <div class="section-label">Network</div>
      <button id="peercompute-attach">attach peercompute</button>
      <button id="publish-packet">publish packet</button>
      <pre id="network-log" class="mini-log">standalone</pre>
    </aside>

    <aside class="control-panel right-panel">
      <div class="section-label">Material</div>
      <label class="field">
        <span>Sample</span>
        <select id="material-select">${U0}</select>
      </label>

      <label class="field">
        <span>Temperature K</span>
        <input id="temperature" type="range" min="20" max="6000" step="1" value="${B.temperatureK}" />
        <output id="temperature-output">${B.temperatureK.toFixed(0)}</output>
      </label>

      <label class="field">
        <span>Pressure atm</span>
        <input id="pressure" type="range" min="0.05" max="25" step="0.05" value="${B.pressureAtm}" />
        <output id="pressure-output">${B.pressureAtm.toFixed(2)}</output>
      </label>

      <label class="field">
        <span>Gravity m/s2</span>
        <input id="gravity" type="range" min="0" max="30" step="0.1" value="${B.gravityMps2}" />
        <output id="gravity-output">${B.gravityMps2.toFixed(1)}</output>
      </label>

      <div class="section-label">Reactive Atoms</div>
      <label class="field">
        <span>Element</span>
        <select id="reactive-element">${N0}</select>
      </label>

      <label class="field">
        <span>Count</span>
        <input id="reactive-count" type="range" min="1" max="40" step="1" value="${B.reactiveCount}" />
        <output id="reactive-count-output">${B.reactiveCount}</output>
      </label>

      <div class="button-row">
        <button id="add-reactive-atoms">add atoms</button>
        <button id="add-water-mix">add 5 H2O</button>
        <button id="clear-reactive-atoms">clear</button>
      </div>
      <pre id="reactive-log" class="mini-log">toy-reactive-atoms-v0</pre>

      <div id="stats-panel" class="stats-panel"></div>
      <div class="section-label">Property Packet</div>
      <pre id="property-packet" class="packet-view"></pre>
    </aside>
  </div>
`;const Mt=new P0(document.querySelector("#viewport")),ne={viewMode:document.querySelector("#view-mode"),element:document.querySelector("#element-select"),n:document.querySelector("#n-input"),nOutput:document.querySelector("#n-output"),l:document.querySelector("#l-select"),m:document.querySelector("#m-select"),pointCount:document.querySelector("#point-count"),pointOutput:document.querySelector("#point-output"),screening:document.querySelector("#screening"),relativistic:document.querySelector("#relativistic"),correlation:document.querySelector("#correlation"),material:document.querySelector("#material-select"),temperature:document.querySelector("#temperature"),temperatureOutput:document.querySelector("#temperature-output"),pressure:document.querySelector("#pressure"),pressureOutput:document.querySelector("#pressure-output"),gravity:document.querySelector("#gravity"),gravityOutput:document.querySelector("#gravity-output"),reactiveElement:document.querySelector("#reactive-element"),reactiveCount:document.querySelector("#reactive-count"),reactiveCountOutput:document.querySelector("#reactive-count-output"),addReactiveAtoms:document.querySelector("#add-reactive-atoms"),addWaterMix:document.querySelector("#add-water-mix"),clearReactiveAtoms:document.querySelector("#clear-reactive-atoms"),reactiveLog:document.querySelector("#reactive-log"),regenerate:document.querySelector("#regenerate"),rotate:document.querySelector("#rotate-toggle"),guides:document.querySelector("#guides-toggle"),attach:document.querySelector("#peercompute-attach"),publish:document.querySelector("#publish-packet"),networkLog:document.querySelector("#network-log"),stats:document.querySelector("#stats-panel"),packet:document.querySelector("#property-packet"),backendStatus:document.querySelector("#backend-status"),packetStatus:document.querySelector("#packet-status"),peerStatus:document.querySelector("#peer-status")},dt=(n,e=3)=>{if(n==null)return"n/a";if(!Number.isFinite(n))return String(n);const t=Math.abs(n);return t>=1e5||t>0&&t<.001?n.toExponential(2):n.toFixed(e).replace(/\.?0+$/,"")},F0=({element:n,n:e,l:t,error:i})=>({schema:$a,modelId:"radial-webgpu-required-v0",mode:"time-independent-radial-schrodinger",status:"webgpu-unavailable",backend:"webgpu-required",solver:"none",potentialModel:"unavailable",elementSymbol:(n==null?void 0:n.symbol)||null,atomicNumber:(n==null?void 0:n.Z)||null,principalN:e,angularL:t,radialNodeCountTarget:Math.max(0,e-t-1),radialNodeCountObserved:null,energyEv:null,energyErrorEv:null,residualRelativeL2:null,meanRadiusBohr:null,gridPointCount:0,radialSamples:[],webgpuStatus:{available:!1,reason:(i==null?void 0:i.message)||String(i||"WebGPU unavailable")},validity:{status:"webgpu-required",warnings:["No CPU fallback was used for the Schrodinger radial solve."]}}),O0=({element:n,n:e,l:t,m:i,gridSize:r,error:s})=>({schema:Za,modelId:"orbital-grid-webgpu-required-v0",status:"webgpu-unavailable",backend:"webgpu-required",elementSymbol:(n==null?void 0:n.symbol)||null,atomicNumber:(n==null?void 0:n.Z)||null,principalN:e,angularL:t,magneticM:i,gridSize:r,positions:new Float32Array(0),probabilities:new Float32Array(0),points:new Float32Array(0),colors:new Float32Array(0),normalization:null,boundaryMass:null,energyEv:null,zEff:null,pointSampleCount:0,pointSamplingMode:"webgpu-required",webgpuStatus:{available:!1,reason:(s==null?void 0:s.message)||String(s||"WebGPU unavailable")},validity:{status:"webgpu-required",warnings:["No CPU fallback was used for the Schrodinger orbital grid."]}}),B0=n=>{var e;return Object.keys(((e=n==null?void 0:n.state)==null?void 0:e.composition)||{})[0]||"n/a"},z0=n=>{var a;const e=((a=n==null?void 0:n.chemical)==null?void 0:a.bondEvents)||[],t=Fl(e),i=Object.entries(t);if(!i.length)return'<div class="bond-legend empty">no molecular bond template in packet</div>';const r=i.map(([o,c])=>{const l=kn[o]||kn.unknown;return`<span class="bond-chip bond-${o}"><span class="bond-swatch"></span>${l.label}: ${c}</span>`}).join(""),s=e.slice(0,6).map(o=>`<div class="bond-line">${o.atoms.join("-")} :: ${o.label} :: order ${o.order}</div>`).join("");return`<div class="bond-legend">${r}<div class="bond-detail">${s}</div></div>`},G0=n=>{const e=Object.entries((n==null?void 0:n.bondSummary)||{});if(!e.length)return'<div class="bond-legend empty">no active bonds</div>';const t=e.map(([r,s])=>{const a=kn[r]||kn.unknown;return`<span class="bond-chip bond-${r}"><span class="bond-swatch"></span>${a.label}: ${s}</span>`}).join(""),i=(n.molecules||[]).slice(0,8).map(r=>`<div class="bond-line">${r.formula} x${r.count}</div>`).join("");return`<div class="bond-legend">${t}<div class="bond-detail">${i}</div></div>`},ei=()=>{Mt.setReactiveEnvironment({temperatureK:B.temperatureK,pressureAtm:B.pressureAtm,gravityMps2:B.gravityMps2})},Wa=()=>{const n=Nc(B.n);B.l=Math.min(B.l,n),B.m=Math.max(-B.l,Math.min(B.m,B.l)),ne.l.innerHTML=Array.from({length:n+1},(e,t)=>`<option value="${t}">${t} (${tu[t]||"higher"})</option>`).join(""),ne.l.value=String(B.l),ne.m.innerHTML=Array.from({length:B.l*2+1},(e,t)=>t-B.l).map(e=>`<option value="${e}">${e}</option>`).join(""),ne.m.value=String(B.m)},zn=n=>{B.viewMode=n,ne.viewMode.value=n,Mt.setMode(n)},ai=()=>{B.viewMode=ne.viewMode.value,B.elementSymbol=ne.element.value,B.n=Number(ne.n.value),B.l=Number(ne.l.value||0),B.m=Number(ne.m.value||0),B.pointCount=Number(ne.pointCount.value),B.screeningExchange=ne.screening.checked,B.relativisticSpinOrbit=ne.relativistic.checked,B.correlationMixing=ne.correlation.checked,B.materialId=ne.material.value,B.temperatureK=Number(ne.temperature.value),B.pressureAtm=Number(ne.pressure.value),B.gravityMps2=Number(ne.gravity.value),B.reactiveElementSymbol=ne.reactiveElement.value,B.reactiveCount=Number(ne.reactiveCount.value),ne.nOutput.textContent=String(B.n),ne.pointOutput.textContent=B.pointCount.toLocaleString(),ne.temperatureOutput.textContent=B.temperatureK.toFixed(0),ne.pressureOutput.textContent=B.pressureAtm.toFixed(2),ne.gravityOutput.textContent=B.gravityMps2.toFixed(1),ne.reactiveCountOutput.textContent=String(B.reactiveCount)},gt=()=>{var s,a,o,c;if(B.viewMode==="reactive"){const l=Mt.getReactiveSummary();ne.packetStatus.textContent=`reactive :: ${l.atomCount} atoms`,ne.peerStatus.textContent=B.peerStatus,ne.backendStatus.textContent="toy-reactive";const u=Object.entries(l.composition).map(([p,_])=>`${p}${_}`).join(" ")||"empty",d=l.molecules.map(p=>`${p.formula} x${p.count}`).join(" / ")||"none",f=l.warnings||[];ne.stats.innerHTML=`
      <div class="stat-grid">
        <div><span>atoms</span><strong>${l.atomCount}</strong></div>
        <div><span>bonds</span><strong>${l.bondCount}</strong></div>
        <div><span>composition</span><strong>${u}</strong></div>
        <div><span>molecules</span><strong>${d}</strong></div>
        <div><span>temperature K</span><strong>${dt(l.environment.temperatureK,1)}</strong></div>
        <div><span>pressure atm</span><strong>${dt(l.environment.pressureAtm,2)}</strong></div>
        <div><span>gravity m/s2</span><strong>${dt(l.environment.gravityMps2,2)}</strong></div>
        <div><span>time s</span><strong>${dt(l.timeS,2)}</strong></div>
      </div>
      ${G0(l)}
      <div class="validation warn">toy-reactive-atoms-v0 :: heuristic</div>
      ${f.length?`<div class="warnings">${f.map(p=>`<div>${p}</div>`).join("")}</div>`:""}
      <div class="mini-log">${B.webgpuDetail}</div>
    `,ne.packet.textContent=JSON.stringify(Mt.getReactiveSnapshot(),null,2);return}const n=B.currentPacket,e=B.orbitalStats,t=B.radialEigenstate,i=n?Wc(n):{ok:!1};ne.packetStatus.textContent=n?`${n.state.phase} :: ${Xc(n)?"fresh":"stale"}`:"pending",ne.peerStatus.textContent=B.peerStatus,ne.backendStatus.textContent=(t==null?void 0:t.backend)||(e==null?void 0:e.backend)||"webgpu-required";const r=((s=n==null?void 0:n.validation)==null?void 0:s.warnings)||[];ne.stats.innerHTML=`
    <div class="stat-grid">
      <div><span>element</span><strong>${Vn(B.elementSymbol).name}</strong></div>
      <div><span>orbital</span><strong>n=${B.n} l=${B.l} m=${B.m}</strong></div>
      <div><span>structure</span><strong>${B0(n)}</strong></div>
      <div><span>bonds</span><strong>${Object.entries(Fl(((a=n==null?void 0:n.chemical)==null?void 0:a.bondEvents)||[])).map(([l,u])=>`${u} ${l}`).join(" / ")||"none"}</strong></div>
      <div><span>orbital backend</span><strong>${(e==null?void 0:e.backend)||"pending"}</strong></div>
      <div><span>point sampler</span><strong>${e!=null&&e.pointSamplingMode?`${e.pointSamplingMode} / ${((c=(o=e.pointSampleCount)==null?void 0:o.toLocaleString)==null?void 0:c.call(o))||e.pointSampleCount}`:"pending"}</strong></div>
      <div><span>Zeff</span><strong>${dt(e==null?void 0:e.zEff,4)}</strong></div>
      <div><span>energy eV</span><strong>${dt(e==null?void 0:e.energyEv,4)}</strong></div>
      <div><span>GPU radial</span><strong>${(t==null?void 0:t.status)||"pending"}</strong></div>
      <div><span>GPU energy eV</span><strong>${dt(t==null?void 0:t.energyEv,4)}</strong></div>
      <div><span>GPU error eV</span><strong>${dt(t==null?void 0:t.energyErrorEv,5)}</strong></div>
      <div><span>GPU residual L2</span><strong>${dt(t==null?void 0:t.residualRelativeL2,3)}</strong></div>
      <div><span>GPU nodes</span><strong>${t?`${t.radialNodeCountObserved??"n/a"}/${t.radialNodeCountTarget}`:"n/a"}</strong></div>
      <div><span>GPU mean r bohr</span><strong>${dt(t==null?void 0:t.meanRadiusBohr,3)}</strong></div>
      <div><span>norm</span><strong>${dt(e==null?void 0:e.normalization,6)}</strong></div>
      <div><span>boundary mass</span><strong>${dt(e==null?void 0:e.boundaryMass,5)}</strong></div>
      <div><span>phase</span><strong>${(n==null?void 0:n.state.phase)||"n/a"}</strong></div>
      <div><span>density kg/m3</span><strong>${dt(n==null?void 0:n.state.densityKgM3,3)}</strong></div>
      <div><span>bulk Pa</span><strong>${dt(n==null?void 0:n.mechanics.bulkModulusPa,3)}</strong></div>
      <div><span>young Pa</span><strong>${dt(n==null?void 0:n.mechanics.youngsModulusPa,3)}</strong></div>
      <div><span>viscosity Pa*s</span><strong>${dt(n==null?void 0:n.mechanics.viscosityPaS,6)}</strong></div>
      <div><span>heat J/kgK</span><strong>${dt(n==null?void 0:n.thermal.heatCapacityJkgK,2)}</strong></div>
      <div><span>n optical</span><strong>${dt(n==null?void 0:n.optical.refractiveIndex,5)}</strong></div>
      <div><span>dielectric</span><strong>${dt(n==null?void 0:n.electromagnetic.dielectricConstant,4)}</strong></div>
      <div><span>conductivity S/m</span><strong>${dt(n==null?void 0:n.electromagnetic.electricalConductivitySpm,4)}</strong></div>
      <div><span>activity Bq/kg</span><strong>${dt(n==null?void 0:n.nuclear.activityBqKg,3)}</strong></div>
    </div>
    ${z0(n)}
    <div class="validation ${i.ok?"ok":"warn"}">${(n==null?void 0:n.validation.status)||"pending"} :: ${(n==null?void 0:n.validation.referenceSet)||"none"}</div>
    ${r.length?`<div class="warnings">${r.map(l=>`<div>${l}</div>`).join("")}</div>`:""}
    <div class="mini-log">${B.webgpuDetail}</div>
  `,ne.packet.textContent=n?JSON.stringify(n,null,2):""},Gn=()=>{const n=B.pressureAtm*L0;ei(),B.currentPacket=B.materialId.startsWith("element:")?eu({symbol:B.materialId.replace("element:",""),temperatureK:B.temperatureK,pressurePa:n,sampleId:"element-cell"}):Qc({materialId:B.materialId,temperatureK:B.temperatureK,pressurePa:n,sampleId:"material-cell"}),Mt.setWaterPacket(B.currentPacket),B.peerSession&&es()};let Ul=0;const rn=async()=>{const n=++Ul;ai(),Wa();const e=Vn(B.elementSymbol),t={screeningExchange:B.screeningExchange,relativisticSpinOrbit:B.relativisticSpinOrbit,correlationMixing:B.correlationMixing},i=performance.now();B.orbitalStats={schema:Za,modelId:"orbital-grid-webgpu-pending-v0",status:"webgpu-pending",backend:"webgpu-orbital-grid-density",elementSymbol:e.symbol,atomicNumber:e.Z,principalN:B.n,angularL:B.l,magneticM:B.m,gridSize:B.gridSize,pointSampleCount:B.pointCount,pointSamplingMode:"webgpu-pending"},B.radialEigenstate={schema:$a,modelId:"radial-webgpu-pending-v0",mode:"time-independent-radial-schrodinger",status:"webgpu-pending",backend:"webgpu-radial-schrodinger",elementSymbol:e.symbol,atomicNumber:e.Z,principalN:B.n,angularL:B.l,radialNodeCountTarget:Math.max(0,B.n-B.l-1),radialNodeCountObserved:null},gt();let r,s;try{r=await pu({element:e,n:B.n,l:B.l,m:B.m,gridSize:B.gridSize,sampleCount:B.pointCount,sampleSeed:iu({element:e,n:B.n,l:B.l,m:B.m,gridSize:B.gridSize,options:t}),options:t}),s=await fu({element:e,n:B.n,l:B.l,zEff:r.zEff,options:t,gridPointCount:Math.max(512,B.gridSize*18)}),B.webgpuStatus="ok",B.webgpuDetail=`webgpu orbital ${r.gridSize}^3 norm=${dt(r.normalization,6)} / radial ${s.status} E=${dt(s.energyEv,4)}eV residual=${dt(s.residualRelativeL2,3)}`}catch(a){r=O0({element:e,n:B.n,l:B.l,m:B.m,gridSize:B.gridSize,error:a}),s=F0({element:e,n:B.n,l:B.l,error:a}),B.webgpuStatus="unavailable",B.webgpuDetail=`webgpu orbital/radial unavailable: ${a.message||String(a)}`,B.orbitalStats={...r,radialEigenstate:s,elapsedMs:performance.now()-i},B.radialEigenstate=s,Gn(),gt();return}n===Ul&&(Mt.setOrbital({points:r.points,colors:r.colors,element:e,extentBohr:r.extentBohr}),B.orbitalStats={...r,radialEigenstate:s,elapsedMs:performance.now()-i},B.radialEigenstate=s,Mt.setMode(B.viewMode),Gn(),gt())},es=()=>{var n;!B.peerSession||!B.currentPacket||(B.peerSession.publishPacket(B.currentPacket),ne.networkLog.textContent=`published ${B.currentPacket.materialId}
peer ${((n=B.peerSession.getStatus().network)==null?void 0:n.peerId)||"unknown"}`)},k0=async()=>{if(B.peerSession){es();return}ne.networkLog.textContent="attaching...";try{B.peerSession=await Au({onStatus:n=>{B.peerStatus=n,ne.peerStatus.textContent=n,ne.networkLog.textContent=n}}),B.peerStatus="attached",es()}catch(n){B.peerStatus="standalone",ne.networkLog.textContent=`attach failed: ${n.message||String(n)}`}gt()},H0=async()=>{const n=await hu();if(!n.available){B.webgpuStatus="unavailable",B.webgpuDetail=`webgpu: ${n.reason}`,gt();return}try{const e=await gu();B.webgpuStatus=e.ok?"ok":"failed",B.webgpuDetail=`webgpu probability smoke total=${dt(e.total,6)}`}catch(e){B.webgpuStatus="failed",B.webgpuDetail=`webgpu smoke failed: ${e.message||String(e)}`}gt()},V0=()=>{ne.viewMode.value=B.viewMode,ne.element.value=B.elementSymbol,ne.material.value=B.materialId,ne.reactiveElement.value=B.reactiveElementSymbol,Wa(),ne.viewMode.addEventListener("change",()=>{ai(),Mt.setMode(B.viewMode),gt()}),ne.element.addEventListener("change",rn),ne.n.addEventListener("input",()=>{B.n=Number(ne.n.value),ne.nOutput.textContent=String(B.n),Wa()}),ne.n.addEventListener("change",rn),ne.l.addEventListener("change",rn),ne.m.addEventListener("change",rn),ne.pointCount.addEventListener("input",()=>{ne.pointOutput.textContent=Number(ne.pointCount.value).toLocaleString()}),ne.pointCount.addEventListener("change",rn),ne.screening.addEventListener("change",rn),ne.relativistic.addEventListener("change",rn),ne.correlation.addEventListener("change",rn),ne.material.addEventListener("change",()=>{ai(),B.materialId.startsWith("element:")||zn("water"),Gn(),gt()}),ne.temperature.addEventListener("input",()=>{B.temperatureK=Number(ne.temperature.value),ne.temperatureOutput.textContent=B.temperatureK.toFixed(0),ei(),Gn(),gt()}),ne.pressure.addEventListener("input",()=>{B.pressureAtm=Number(ne.pressure.value),ne.pressureOutput.textContent=B.pressureAtm.toFixed(2),ei(),Gn(),gt()}),ne.gravity.addEventListener("input",()=>{B.gravityMps2=Number(ne.gravity.value),ne.gravityOutput.textContent=B.gravityMps2.toFixed(1),ei(),gt()}),ne.reactiveElement.addEventListener("change",()=>{B.reactiveElementSymbol=ne.reactiveElement.value}),ne.reactiveCount.addEventListener("input",()=>{B.reactiveCount=Number(ne.reactiveCount.value),ne.reactiveCountOutput.textContent=String(B.reactiveCount)}),ne.addReactiveAtoms.addEventListener("click",()=>{ai(),ei(),Mt.addReactiveAtoms(B.reactiveElementSymbol,B.reactiveCount),zn("reactive");const n=Mt.getReactiveSummary();ne.reactiveLog.textContent=`added ${B.reactiveCount} ${B.reactiveElementSymbol}
atoms ${n.atomCount} bonds ${n.bondCount}`,gt()}),ne.addWaterMix.addEventListener("click",()=>{ai(),ei(),Mt.addReactiveWaterRecipe(5),zn("reactive");const n=Mt.getReactiveSummary();ne.reactiveLog.textContent=`added 5 O + 10 H
atoms ${n.atomCount} bonds ${n.bondCount}`,gt()}),ne.clearReactiveAtoms.addEventListener("click",()=>{Mt.clearReactiveAtoms(),zn("reactive"),ne.reactiveLog.textContent="cleared reactive atoms",gt()}),ne.regenerate.addEventListener("click",rn),ne.rotate.addEventListener("click",()=>{B.rotating=!B.rotating,ne.rotate.textContent=B.rotating?"pause":"rotate",Mt.setRotationEnabled(B.rotating)}),ne.guides.addEventListener("click",()=>{B.guides=!B.guides,Mt.setGuidesVisible(B.guides)}),ne.attach.addEventListener("click",k0),ne.publish.addEventListener("click",es)};V0();rn();H0();setInterval(()=>{Gn(),gt()},2e3);setInterval(()=>{B.viewMode==="reactive"&&gt()},500);window.__schrodingerDemo={getState:()=>({...B,peerSession:!!B.peerSession}),setElement:n=>{ne.element.value=n,rn()},setMaterial:n=>{ne.material.value=n,ai(),B.materialId.startsWith("element:")||zn("water"),Gn(),gt()},setConditions:({temperatureK:n,pressureAtm:e,gravityMps2:t}={})=>{Number.isFinite(n)&&(ne.temperature.value=String(n)),Number.isFinite(e)&&(ne.pressure.value=String(e)),Number.isFinite(t)&&(ne.gravity.value=String(t)),ai(),ei(),Gn(),gt()},addAtoms:(n,e=1)=>{Mt.addReactiveAtoms(n,e),zn("reactive"),gt()},addWaterMix:(n=5)=>{Mt.addReactiveWaterRecipe(n),zn("reactive"),gt()},clearAtoms:()=>{Mt.clearReactiveAtoms(),zn("reactive"),gt()},getReactiveState:()=>Mt.getReactiveSnapshot(),getRadialEigenstate:()=>B.radialEigenstate,getPacket:()=>B.currentPacket};export{xu as _};
