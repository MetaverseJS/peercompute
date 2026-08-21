import{g as je}from"./random-CBxRAFIW.js";import{e as Ge,a as ze,h as Ue,H as Se,b as Oe,Q as Ve,d as we}from"./quantumOrbitalClosure-DT3aX4Pm.js";let Be=null;const qe="peercompute.schrodinger.radial-webgpu-eigensolver.v0",Qe=.0529177210903,Ye=24.188843265857,Re=96,$e=768,ne=128,ke=(t,r,a)=>Math.min(a,Math.max(r,t)),$=(t,r=0)=>{if(t==null||t==="")return r;const a=Number(t);return Number.isFinite(a)?a:r},Xe=(t,r)=>{const a=ke(Math.round(192+Math.max(1,r)*32),Re,512);return Math.round(ke($(t,a),Re,$e))},Je=({n:t,radialZ:r})=>{const a=Math.max(.25,r),l=Oe({n:t,zEff:a,scale:10});return ke(Math.max(18/a,l),8/a,420)},We=t=>{let r=0;for(const c of t)r=Math.max(r,Math.abs(c));const a=r*1e-4;let l=0,n=0;for(const c of t){if(Math.abs(c)<=a)continue;const f=c<0?-1:1;l!==0&&f!==l&&(n+=1),l=f}return n},et=({energyErrorEv:t,residualRelativeL2:r,potentialModel:a})=>a!=="coulomb"?r<.002?"webgpu-screened-converged":"webgpu-screened-watch":Math.abs(t)<.08&&r<.002?"webgpu-converged":Math.abs(t)<.35&&r<.01?"webgpu-watch":"webgpu-refine",_e=(t,r,a,l=0)=>t.createBuffer({label:r,size:Math.max(4,a),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST|l}),Me=async(t,r,a,l)=>{const n=t.createBuffer({label:l,size:Math.max(4,a),usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),c=t.createCommandEncoder();c.copyBufferToBuffer(r,0,n,0,Math.max(4,a)),t.queue.submit([c.finish()]),await n.mapAsync(GPUMapMode.READ);const f=n.getMappedRange().slice(0,a);return n.unmap(),n.destroy(),new Float32Array(f)},Ne=t=>{const r=[0,0,0,0];for(let a=0;a<t.length;a+=4)r[0]+=t[a],r[1]+=t[a+1],r[2]+=t[a+2],r[3]+=t[a+3];return r},tt=({vector:t,spacing:r,pointCount:a})=>{var f;const l=[],n=Math.max(1,Math.floor(a/96));for(let u=0;u<a;u+=n)l.push({rBohr:(u+1)*r,u:t[u],probabilityDensity:t[u]*t[u]});const c=a-1;return((f=l[l.length-1])==null?void 0:f.rBohr)!==(c+1)*r&&l.push({rBohr:(c+1)*r,u:t[c],probabilityDensity:t[c]*t[c]}),l},at=async()=>(Be||(Be=(async()=>{if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU unavailable");const t=await navigator.gpu.requestAdapter();if(!t)throw new Error("No WebGPU adapter available");return t.requestDevice()})()),Be),rt=async({element:t=null,atomicNumber:r=null,n:a=1,l=0,zEff:n=null,options:c={},gridPointCount:f=null,radialExtentBohr:u=null,gpuDevice:m=null}={})=>{const d=m||await at(),e=Math.max(1,Math.round($(a,1))),p=Math.max(0,Math.round($(l,0)));if(p>=e)throw new Error("radial WebGPU eigensolver requires 0 <= l < n");const o=Math.max(1,Math.round($(r,(t==null?void 0:t.Z)||1))),h=Math.max(.05,$(n,t?Ge(t,e,p,c):o)),y=ze(h,e,p,c),g=Xe(f,e),i=Math.max(1,$(u,Je({n:e,radialZ:y}))),s=i/(g+1),P=$(c.debyeLengthBohr,1/0),A=Math.max(0,$(c.coulombSofteningBohr,0)),I=c.debyeLengthBohr||c.coulombSofteningBohr?"screened-softened-coulomb":"coulomb",S=Ue({n:e,zEff:y})/Se,x=Math.max(1,Math.ceil(g/ne)),U=d.createShaderModule({label:"schrodinger-radial-webgpu-eigensolver",code:`
      @group(0) @binding(0) var<storage, read> params: array<f32>;
      @group(0) @binding(1) var<storage, read_write> waveU: array<f32>;
      @group(0) @binding(2) var<storage, read_write> residuals: array<f32>;
      @group(0) @binding(3) var<storage, read_write> partials: array<vec4f>;

      var<workgroup> localPartial: array<vec4f, ${ne}>;

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
        var stride = ${ne/2}u;
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

      @compute @workgroup_size(${ne})
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

      @compute @workgroup_size(${ne})
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
    `}),v=d.createBindGroupLayout({label:"schrodinger-radial-webgpu-bindgroup-layout",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),T=d.createPipelineLayout({label:"schrodinger-radial-webgpu-pipeline-layout",bindGroupLayouts:[v]}),R=d.createComputePipeline({label:"schrodinger-radial-webgpu-prepare-pipeline",layout:T,compute:{module:U,entryPoint:"prepare"}}),F=d.createComputePipeline({label:"schrodinger-radial-webgpu-diagnose-pipeline",layout:T,compute:{module:U,entryPoint:"diagnose"}}),E=new Float32Array(16);E[0]=g,E[1]=e,E[2]=p,E[3]=y,E[4]=s,E[5]=i,E[6]=Number.isFinite(P)&&P>0?P:0,E[7]=A,E[8]=S,E[9]=I==="coulomb"?0:1,E[10]=1,E[11]=S;const C=d.createBuffer({label:"schrodinger-radial-webgpu-params",size:E.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),b=_e(d,"schrodinger-radial-webgpu-wave-u",g*4),N=_e(d,"schrodinger-radial-webgpu-residuals",g*4),O=_e(d,"schrodinger-radial-webgpu-partials",x*16),Z=d.createBindGroup({label:"schrodinger-radial-webgpu-bindgroup",layout:v,entries:[{binding:0,resource:{buffer:C}},{binding:1,resource:{buffer:b}},{binding:2,resource:{buffer:N}},{binding:3,resource:{buffer:O}}]});d.queue.writeBuffer(C,0,E);let G=d.createCommandEncoder(),L=G.beginComputePass({label:"schrodinger-radial-webgpu-prepare-pass"});L.setPipeline(R),L.setBindGroup(0,Z),L.dispatchWorkgroups(x),L.end(),d.queue.submit([G.finish()]);const z=await Me(d,O,x*16,"schrodinger-radial-webgpu-prepare-readback"),[q,w,X,H]=Ne(z),Q=Math.max(1e-30,q),j=w/Q,ce=1/Math.sqrt(Q);E[10]=ce,E[11]=j,d.queue.writeBuffer(C,0,E),G=d.createCommandEncoder(),L=G.beginComputePass({label:"schrodinger-radial-webgpu-diagnose-pass"}),L.setPipeline(F),L.setBindGroup(0,Z),L.dispatchWorkgroups(x),L.end(),d.queue.submit([G.finish()]);const[Ie,V,he]=await Promise.all([Me(d,O,x*16,"schrodinger-radial-webgpu-diagnostic-readback"),Me(d,b,g*4,"schrodinger-radial-webgpu-wave-readback"),Me(d,N,g*4,"schrodinger-radial-webgpu-residual-readback")]),[de,xe,ye,ue]=Ne(Ie),me=Math.sqrt(Math.max(0,xe)),ae=me/Math.max(1e-30,Math.sqrt(Math.max(0,ye))),pe=j*Se,re=S*Se,ie=pe-re;let J=0,k=0,be=0;for(let Y=0;Y<g;Y+=1){J=Math.max(J,Math.abs(he[Y]));const Pe=V[Y]*V[Y];Pe>k&&(k=Pe,be=(Y+1)*s)}return C.destroy(),b.destroy(),N.destroy(),O.destroy(),{schema:qe,modelId:"radial-webgpu-hydrogenic-basis-hamiltonian-v0",mode:"time-independent-radial-schrodinger",status:et({energyErrorEv:ie,residualRelativeL2:ae,potentialModel:I}),backend:"webgpu-radial-schrodinger",hamiltonian:"H_l = -1/2 d2/dr2 + l(l+1)/(2r^2) - Z_eff/r",solver:"webgpu-analytic-basis-finite-difference-hamiltonian",potentialModel:I,units:{length:"bohr",energy:"hartree/eV",timeAtomicUnitAttoseconds:Ye},elementSymbol:(t==null?void 0:t.symbol)||null,atomicNumber:o,principalN:e,angularL:p,radialNodeCountTarget:Math.max(0,e-p-1),radialNodeCountObserved:We(V),zEff:h,radialZ:y,energyHartree:j,energyEv:pe,analyticEnergyHartree:S,analyticEnergyEv:re,energyErrorHartree:j-S,energyErrorEv:ie,relativeEnergyError:Math.abs(ie)/Math.max(1e-12,Math.abs(re)),residualL2Hartree:me,residualRelativeL2:ae,maxAbsResidualHartree:J,maxAbsResidualEv:J*Se,normalization:de,meanRadiusBohr:ue/Math.max(1e-30,de),meanRadiusNm:ue/Math.max(1e-30,de)*Qe,rmsRadiusBohr:Math.sqrt(Math.max(0,H/Q)),peakRadiusBohr:be,peakProbabilityDensity:k,gridPointCount:g,radialExtentBohr:i,spacingBohr:s,iterationsRequested:0,iterationsCompleted:0,shiftHartree:null,converged:ae<.002,radialSamples:tt({vector:V,spacing:s,pointCount:g}),radialGrid:{schema:"peercompute.schrodinger.radial-webgpu-grid.v0",radiiBohr:null,wavefunctionU:V,residualHartree:he,spacingBohr:s,pointCount:g},webgpuStatus:{available:!0,kernelMode:"webgpu-radial-hamiltonian",reductionMode:"webgpu-workgroup-partials-js-final-sum",partialCount:x,workgroupSize:ne},validity:{status:"webgpu-primary-schrodinger-basis",warnings:["WebGPU samples the hydrogenic radial basis and evaluates the radial Hamiltonian/residual directly on GPU.","This is not a CPU fallback path; unavailable WebGPU is reported as unavailable."]}}},ve="peercompute.multiscale.quantum-orbital-grid.result.v0",it="peercompute.multiscale.quantum-orbital-grid.delta.v0",Ee="peercompute.multiscale.quantum-orbital-grid.webgpu.v0",Rt="peercompute.multiscale.quantum-orbital-grid.parity.v0",nt="peercompute.multiscale.quantum-orbital-grid.eigen-residual-webgpu.v0",lt="peercompute.multiscale.quantum-orbital-grid.wavefunction-evolution-webgpu.v0",st="peercompute.multiscale.quantum-orbital-grid.hamiltonian-components-webgpu.v0",ot="peercompute.multiscale.quantum-orbital-grid.field-response-webgpu.v0",ct="peercompute.multiscale.quantum-orbital-grid.magnetic-response-webgpu.v0",dt="peercompute.multiscale.quantum-orbital-grid.statistical-bridge-webgpu.v0",Nt=qe,K="webgpu-only-no-cpu-fallback",ut=32768,Le="orbital:quantum-orbital-grid:default",mt="multiscale-solver-deltas",D=64,pt="webgpu-orbital-grid-probability-evaluation",Ze="webgpu-orbital-grid-eigen-residual-reduction",le="webgpu-orbital-grid-wavefunction-evolution-reduction",B=27.211386245988,ft=8617333262145e-17,fe=514220674763,ee=.05,ge=235051.756758,te=.05,oe=new Map,Ae=new Map,se=new Map,gt=`
const PI: f32 = 3.141592653589793;
const SQRT2: f32 = 1.4142135623730951;
const FINE_STRUCTURE_ALPHA: f32 = 0.0072973525693;

@group(0) @binding(0) var<storage, read> params: array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<vec4f>;

var<workgroup> localPartial: array<vec4f, ${D}>;

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
  let absX = clamp(x, -1.0, 1.0);
  var pmm = 1.0;
  if (m > 0u) {
    let root = sqrt(max(0.0, (1.0 - absX) * (1.0 + absX)));
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

  var pmmp1 = absX * f32(2u * m + 1u) * pmm;
  if (l == m + 1u) {
    return pmmp1;
  }

  var pll = 0.0;
  var ll = m + 2u;
  loop {
    if (ll > l) {
      break;
    }
    pll = (f32(2u * ll - 1u) * absX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
    pmm = pmmp1;
    pmmp1 = pll;
    ll = ll + 1u;
  }
  return pll;
}

fn absI(value: i32) -> u32 {
  if (value < 0) {
    return u32(-value);
  }
  return u32(value);
}

fn clampM(value: i32, l: u32) -> i32 {
  let limit = i32(l);
  if (value < -limit) {
    return -limit;
  }
  if (value > limit) {
    return limit;
  }
  return value;
}

fn radialComponent(n: u32, l: u32, rBohr: f32, zEff: f32) -> f32 {
  let safeR = max(rBohr, 1.0e-6);
  let rho = (2.0 * zEff * safeR) / max(1.0, f32(n));
  let radialOrder = n - l - 1u;
  let prefactor = sqrt(
    max(0.0, pow((2.0 * zEff) / max(1.0, f32(n)), 3.0)
      * (factorialF(radialOrder) / max(1.0, 2.0 * f32(n) * factorialF(n + l))))
  );
  return prefactor * exp(-rho / 2.0) * pow(rho, f32(l)) * associatedLaguerre(radialOrder, 2u * l + 1u, rho);
}

fn realSphericalHarmonicSq(l: u32, mSigned: i32, x: f32, y: f32, z: f32, r: f32) -> f32 {
  let absM = absI(mSigned);
  let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
  let plm = associatedLegendre(l, absM, cosTheta);
  let norm = sqrt(
    max(0.0, ((2.0 * f32(l) + 1.0) / (4.0 * PI))
      * (factorialF(l - absM) / max(1.0, factorialF(l + absM))))
  );
  var ylm = norm * plm;
  if (mSigned > 0) {
    ylm = SQRT2 * norm * plm * cos(f32(absM) * atan2(y, x));
  } else if (mSigned < 0) {
    ylm = SQRT2 * norm * plm * sin(f32(absM) * atan2(y, x));
  }
  return max(0.0, ylm * ylm);
}

fn orbitalBasisProbability(
  x: f32,
  y: f32,
  z: f32,
  n: u32,
  l: u32,
  mSigned: i32,
  radialZ: f32,
  zEff: f32,
  spinOrbitEnabled: bool
) -> f32 {
  let r = sqrt(x * x + y * y + z * z);
  let radial = radialComponent(n, l, r, radialZ);
  let ylmSq = realSphericalHarmonicSq(l, mSigned, x, y, z, r);
  var spinFactor = 1.0;
  if (spinOrbitEnabled && l > 0u && mSigned != 0) {
    let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
    let beta = pow(FINE_STRUCTURE_ALPHA * zEff, 2.0);
    let coupling = (0.24 * beta * f32(l)) / max(1.0, f32(n * n));
    spinFactor = clamp(1.0 + coupling * cosTheta * (f32(mSigned) / max(1.0, f32(l))), 0.5, 1.5);
  }
  return max(0.0, radial * radial * ylmSq * spinFactor);
}

fn sameBasis(aN: u32, aL: u32, bN: u32, bL: u32) -> bool {
  return aN == bN && aL == bL;
}

fn addCorrelationCandidate(
  current: vec2f,
  x: f32,
  y: f32,
  z: f32,
  n: u32,
  l: u32,
  mSigned: i32,
  weight: f32,
  radialZ: f32,
  seenAN: u32,
  seenAL: u32,
  seenBN: u32,
  seenBL: u32,
  hasSeenB: bool
) -> vec2f {
  if (l >= n || sameBasis(n, l, seenAN, seenAL) || (hasSeenB && sameBasis(n, l, seenBN, seenBL))) {
    return current;
  }
  let termM = clampM(mSigned, l);
  let probability = orbitalBasisProbability(x, y, z, n, l, termM, radialZ, radialZ, false);
  return vec2f(current.x + weight * probability, current.y + weight);
}

fn orbitalProbabilityRaw(x: f32, y: f32, z: f32) -> f32 {
  let zEff = params[3];
  let radialZ = params[4];
  let n = max(1u, paramU(5u));
  let l = min(paramU(6u), max(0u, n - 1u));
  let mSigned = clampM(paramI(7u), l);
  let correlationEnabled = params[8] > 0.5 && n >= 2u;
  let spinOrbitEnabled = params[9] > 0.5;
  let baseProbability = orbitalBasisProbability(x, y, z, n, l, mSigned, radialZ, zEff, spinOrbitEnabled);
  if (!correlationEnabled) {
    return baseProbability;
  }

  let c1N = n - 1u;
  let c1L = min(l, n - 2u);
  let c2N = n;
  var c2L = 0u;
  if (l > 0u) {
    c2L = l - 1u;
  }
  let c3N = n;
  let c3L = min(n - 1u, l + 1u);
  var mixed = addCorrelationCandidate(vec2f(0.0, 0.0), x, y, z, c1N, c1L, mSigned, 0.42, radialZ, 999u, 999u, 999u, 999u, false);
  mixed = addCorrelationCandidate(mixed, x, y, z, c2N, c2L, mSigned, 0.29, radialZ, c1N, c1L, 999u, 999u, false);
  mixed = addCorrelationCandidate(mixed, x, y, z, c3N, c3L, mSigned, 0.29, radialZ, c1N, c1L, c2N, c2L, true);
  let strength = clamp(0.04 + radialZ * 0.002, 0.04, 0.18);
  let mixedProbability = select(baseProbability, mixed.x / max(1.0e-12, mixed.y), mixed.y > 0.0);
  return (1.0 - strength) * baseProbability + strength * mixedProbability;
}

@compute @workgroup_size(${D})
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(workgroup_id) wid: vec3u
) {
  let index = gid.x;
  let localIndex = lid.x;
  let gridSize = max(1u, paramU(0u));
  let sampleCount = gridSize * gridSize * gridSize;
  let extent = params[1];
  let spacing = params[2];
  var sum = vec4f(0.0, 0.0, 0.0, 0.0);
  if (index < sampleCount) {
    let area = gridSize * gridSize;
    let zIndex = index / area;
    let yIndex = (index - zIndex * area) / gridSize;
    let xIndex = index % gridSize;
    let x = -extent + f32(xIndex) * spacing;
    let y = -extent + f32(yIndex) * spacing;
    let z = -extent + f32(zIndex) * spacing;
    let r = sqrt(x * x + y * y + z * z);
    let p = max(0.0, orbitalProbabilityRaw(x, y, z));
    let isBoundary = xIndex == 0u || yIndex == 0u || zIndex == 0u || xIndex == gridSize - 1u || yIndex == gridSize - 1u || zIndex == gridSize - 1u;
    sum = vec4f(p, p * r, p * r * r, select(0.0, p, isBoundary));
  }
  localPartial[localIndex] = sum;
  workgroupBarrier();

  var stride = ${D/2}u;
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
    partials[wid.x] = localPartial[0];
  }
}
`,ht=`
const PI: f32 = 3.141592653589793;
const SQRT2: f32 = 1.4142135623730951;

@group(0) @binding(0) var<storage, read> params: array<f32>;
@group(0) @binding(1) var<storage, read_write> partials: array<vec4f>;

var<workgroup> localPartial: array<vec4f, ${D}>;

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
  let absX = clamp(x, -1.0, 1.0);
  var pmm = 1.0;
  if (m > 0u) {
    let root = sqrt(max(0.0, (1.0 - absX) * (1.0 + absX)));
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

  var pmmp1 = absX * f32(2u * m + 1u) * pmm;
  if (l == m + 1u) {
    return pmmp1;
  }

  var pll = 0.0;
  var ll = m + 2u;
  loop {
    if (ll > l) {
      break;
    }
    pll = (f32(2u * ll - 1u) * absX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
    pmm = pmmp1;
    pmmp1 = pll;
    ll = ll + 1u;
  }
  return pll;
}

fn absI(value: i32) -> u32 {
  if (value < 0) {
    return u32(-value);
  }
  return u32(value);
}

fn clampM(value: i32, l: u32) -> i32 {
  let limit = i32(l);
  if (value < -limit) {
    return -limit;
  }
  if (value > limit) {
    return limit;
  }
  return value;
}

fn radialComponent(n: u32, l: u32, rBohr: f32, radialZ: f32) -> f32 {
  let safeR = max(rBohr, 1.0e-6);
  let rho = (2.0 * radialZ * safeR) / max(1.0, f32(n));
  let radialOrder = n - l - 1u;
  let prefactor = sqrt(
    max(0.0, pow((2.0 * radialZ) / max(1.0, f32(n)), 3.0)
      * (factorialF(radialOrder) / max(1.0, 2.0 * f32(n) * factorialF(n + l))))
  );
  return prefactor * exp(-rho / 2.0) * pow(rho, f32(l)) * associatedLaguerre(radialOrder, 2u * l + 1u, rho);
}

fn realSphericalHarmonic(l: u32, mSigned: i32, x: f32, y: f32, z: f32, r: f32) -> f32 {
  let absM = absI(mSigned);
  let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
  let plm = associatedLegendre(l, absM, cosTheta);
  let norm = sqrt(
    max(0.0, ((2.0 * f32(l) + 1.0) / (4.0 * PI))
      * (factorialF(l - absM) / max(1.0, factorialF(l + absM))))
  );
  if (mSigned > 0) {
    return SQRT2 * norm * plm * cos(f32(absM) * atan2(y, x));
  }
  if (mSigned < 0) {
    return SQRT2 * norm * plm * sin(f32(absM) * atan2(y, x));
  }
  return norm * plm;
}

fn wavefunctionAt(x: f32, y: f32, z: f32, n: u32, l: u32, mSigned: i32, radialZ: f32) -> f32 {
  let r = sqrt(x * x + y * y + z * z);
  return radialComponent(n, l, r, radialZ) * realSphericalHarmonic(l, mSigned, x, y, z, r);
}

@compute @workgroup_size(${D})
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(workgroup_id) wid: vec3u
) {
  let index = gid.x;
  let localIndex = lid.x;
  let gridSize = max(1u, paramU(0u));
  let sampleCount = gridSize * gridSize * gridSize;
  let extent = params[1];
  let spacing = max(params[2], 1.0e-6);
  let radialZ = max(params[4], 1.0e-6);
  let n = max(1u, paramU(5u));
  let l = min(paramU(6u), max(0u, n - 1u));
  let mSigned = clampM(paramI(7u), l);
  let singularSkipRadius = spacing * 0.75;
  var sum = vec4f(0.0, 0.0, 0.0, 0.0);
  if (index < sampleCount) {
    let area = gridSize * gridSize;
    let zIndex = index / area;
    let yIndex = (index - zIndex * area) / gridSize;
    let xIndex = index % gridSize;
    if (xIndex > 0u && yIndex > 0u && zIndex > 0u && xIndex < gridSize - 1u && yIndex < gridSize - 1u && zIndex < gridSize - 1u) {
      let x = -extent + f32(xIndex) * spacing;
      let y = -extent + f32(yIndex) * spacing;
      let z = -extent + f32(zIndex) * spacing;
      let radius = sqrt(x * x + y * y + z * z);
      if (radius > singularSkipRadius) {
        let center = wavefunctionAt(x, y, z, n, l, mSigned, radialZ);
        let laplacian = (
          wavefunctionAt(x + spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x - spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y + spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y - spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z + spacing, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z - spacing, n, l, mSigned, radialZ)
          - 6.0 * center
        ) / (spacing * spacing);
        let energyHartree = -0.5 * radialZ * radialZ / max(1.0, f32(n * n));
        let hPsi = -0.5 * laplacian - (radialZ / max(radius, singularSkipRadius)) * center;
        let ePsi = energyHartree * center;
        let residual = hPsi - ePsi;
        let weight = center * center;
        sum = vec4f(residual * residual, ePsi * ePsi, abs(residual) * weight, weight);
      }
    }
  }
  localPartial[localIndex] = sum;
  workgroupBarrier();

  var stride = ${D/2}u;
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
    partials[wid.x] = localPartial[0];
  }
}
`,xt=`
const PI: f32 = 3.141592653589793;
const SQRT2: f32 = 1.4142135623730951;

@group(0) @binding(0) var<storage, read> params: array<f32>;
@group(0) @binding(1) var<storage, read_write> sampleTerms: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> partials: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> fieldPartials: array<vec4f>;

var<workgroup> localPartial: array<vec4f, ${D}>;
var<workgroup> localFieldPartial: array<vec4f, ${D}>;

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
  let absX = clamp(x, -1.0, 1.0);
  var pmm = 1.0;
  if (m > 0u) {
    let root = sqrt(max(0.0, (1.0 - absX) * (1.0 + absX)));
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

  var pmmp1 = absX * f32(2u * m + 1u) * pmm;
  if (l == m + 1u) {
    return pmmp1;
  }

  var pll = 0.0;
  var ll = m + 2u;
  loop {
    if (ll > l) {
      break;
    }
    pll = (f32(2u * ll - 1u) * absX * pmmp1 - f32(ll + m - 1u) * pmm) / max(1.0, f32(ll - m));
    pmm = pmmp1;
    pmmp1 = pll;
    ll = ll + 1u;
  }
  return pll;
}

fn absI(value: i32) -> u32 {
  if (value < 0) {
    return u32(-value);
  }
  return u32(value);
}

fn clampM(value: i32, l: u32) -> i32 {
  let limit = i32(l);
  if (value < -limit) {
    return -limit;
  }
  if (value > limit) {
    return limit;
  }
  return value;
}

fn radialComponent(n: u32, l: u32, rBohr: f32, radialZ: f32) -> f32 {
  let safeR = max(rBohr, 1.0e-6);
  let rho = (2.0 * radialZ * safeR) / max(1.0, f32(n));
  let radialOrder = n - l - 1u;
  let prefactor = sqrt(
    max(0.0, pow((2.0 * radialZ) / max(1.0, f32(n)), 3.0)
      * (factorialF(radialOrder) / max(1.0, 2.0 * f32(n) * factorialF(n + l))))
  );
  return prefactor * exp(-rho / 2.0) * pow(rho, f32(l)) * associatedLaguerre(radialOrder, 2u * l + 1u, rho);
}

fn realSphericalHarmonic(l: u32, mSigned: i32, x: f32, y: f32, z: f32, r: f32) -> f32 {
  let absM = absI(mSigned);
  let cosTheta = select(1.0, clamp(z / max(r, 1.0e-12), -1.0, 1.0), r > 1.0e-12);
  let plm = associatedLegendre(l, absM, cosTheta);
  let norm = sqrt(
    max(0.0, ((2.0 * f32(l) + 1.0) / (4.0 * PI))
      * (factorialF(l - absM) / max(1.0, factorialF(l + absM))))
  );
  if (mSigned > 0) {
    return SQRT2 * norm * plm * cos(f32(absM) * atan2(y, x));
  }
  if (mSigned < 0) {
    return SQRT2 * norm * plm * sin(f32(absM) * atan2(y, x));
  }
  return norm * plm;
}

fn wavefunctionAt(x: f32, y: f32, z: f32, n: u32, l: u32, mSigned: i32, radialZ: f32) -> f32 {
  let r = sqrt(x * x + y * y + z * z);
  return radialComponent(n, l, r, radialZ) * realSphericalHarmonic(l, mSigned, x, y, z, r);
}

@compute @workgroup_size(${D})
fn main(
  @builtin(global_invocation_id) gid: vec3u,
  @builtin(local_invocation_id) lid: vec3u,
  @builtin(workgroup_id) wid: vec3u
) {
  let index = gid.x;
  let localIndex = lid.x;
  let gridSize = max(1u, paramU(0u));
  let sampleCount = gridSize * gridSize * gridSize;
  let extent = params[1];
  let spacing = max(params[2], 1.0e-6);
  let radialZ = max(params[4], 1.0e-6);
  let n = max(1u, paramU(5u));
  let l = min(paramU(6u), max(0u, n - 1u));
  let mSigned = clampM(paramI(7u), l);
  let dtAtomicUnits = clamp(params[11], 1.0e-5, 0.02);
  let electricFieldAtomicUnits = clamp(params[12], -0.05, 0.05);
  let magneticFieldAtomicUnits = clamp(params[14], -0.05, 0.05);
  let zeemanProjection = clamp(params[16], -8.0, 8.0);
  let zeemanShiftHartree = 0.5 * magneticFieldAtomicUnits * zeemanProjection;
  let singularSkipRadius = spacing * 0.75;
  var sum = vec4f(0.0, 0.0, 0.0, 0.0);
  var fieldSum = vec4f(0.0, 0.0, 0.0, 0.0);
  if (index < sampleCount) {
    sampleTerms[index] = vec4f(0.0, 0.0, 0.0, 0.0);
    let area = gridSize * gridSize;
    let zIndex = index / area;
    let yIndex = (index - zIndex * area) / gridSize;
    let xIndex = index % gridSize;
    if (xIndex > 0u && yIndex > 0u && zIndex > 0u && xIndex < gridSize - 1u && yIndex < gridSize - 1u && zIndex < gridSize - 1u) {
      let x = -extent + f32(xIndex) * spacing;
      let y = -extent + f32(yIndex) * spacing;
      let z = -extent + f32(zIndex) * spacing;
      let radius = sqrt(x * x + y * y + z * z);
      if (radius > singularSkipRadius) {
        let center = wavefunctionAt(x, y, z, n, l, mSigned, radialZ);
        let laplacian = (
          wavefunctionAt(x + spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x - spacing, y, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y + spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y - spacing, z, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z + spacing, n, l, mSigned, radialZ)
          + wavefunctionAt(x, y, z - spacing, n, l, mSigned, radialZ)
          - 6.0 * center
        ) / (spacing * spacing);
        let kineticPsi = -0.5 * laplacian;
        let potentialPsi = -(radialZ / max(radius, singularSkipRadius)) * center;
        let fieldPotentialPsi = electricFieldAtomicUnits * z * center;
        let magneticPotentialPsi = zeemanShiftHartree * center;
        let hPsi = kineticPsi + potentialPsi + fieldPotentialPsi + magneticPotentialPsi;
        let initialDensity = center * center;
        let evolvedDensity = initialDensity + dtAtomicUnits * dtAtomicUnits * hPsi * hPsi;
        sampleTerms[index] = vec4f(initialDensity, evolvedDensity, center * kineticPsi, center * potentialPsi);
        sum = vec4f(initialDensity, evolvedDensity, center * hPsi, hPsi * hPsi);
        fieldSum = vec4f(
          z * initialDensity,
          center * fieldPotentialPsi,
          z * z * initialDensity,
          abs(center * fieldPotentialPsi)
        );
      }
    }
  }
  localPartial[localIndex] = sum;
  localFieldPartial[localIndex] = fieldSum;
  workgroupBarrier();

  var stride = ${D/2}u;
  loop {
    if (stride == 0u) {
      break;
    }
    if (localIndex < stride) {
      localPartial[localIndex] = localPartial[localIndex] + localPartial[localIndex + stride];
      localFieldPartial[localIndex] = localFieldPartial[localIndex] + localFieldPartial[localIndex + stride];
    }
    workgroupBarrier();
    stride = stride / 2u;
  }

  if (localIndex == 0u) {
    partials[wid.x] = localPartial[0];
    fieldPartials[wid.x] = localFieldPartial[0];
  }
}
`;function Te(){const t=globalThis.self,r=globalThis.WorkerGlobalScope;return t&&r&&t instanceof r?"dedicated-worker":"inline"}function M(t,r,a){return Math.min(a,Math.max(r,t))}function _(t,r=0){const a=Number(t);return Number.isFinite(a)?a:r}function W(t,r,a=1,l=Number.MAX_SAFE_INTEGER){const n=Math.round(Number(t));return Number.isFinite(n)?Math.min(l,Math.max(a,n)):r}function yt(t={}){var a;const r=t.environment&&typeof t.environment=="object"?t.environment:{};return M(_(((a=t.options)==null?void 0:a.electricFieldVm)??t.electricFieldVm??t.electricFieldStrengthVm??t.electricFieldVpm??r.electricFieldVm??r.electricFieldStrengthVm??r.electricFieldVpm,0),-fe*ee,fe*ee)}function bt(t={}){var a;const r=t.environment&&typeof t.environment=="object"?t.environment:{};return M(_(((a=t.options)==null?void 0:a.magneticFieldT)??t.magneticFieldT??t.magneticFluxDensityT??r.magneticFieldT??r.magneticFluxDensityT,0),-ge*te,ge*te)}function De(t){return 2*(2*t+1)}function Pt(t=[]){let r=0;for(const a of t){const l=2*a.l+1,n=M(a.occupancy,0,De(a.l));r+=n<=l?n:Math.max(0,De(a.l)-n)}return r}function St(t){return Pt(we(t.Z))>0?.5:0}function Mt(t={}){var h,y,g,i,s,P,A,I,S;const r=je(t.elementSymbol||((h=t.element)==null?void 0:h.symbol)||"O"),a=t.environment&&typeof t.environment=="object"?t.environment:{},l=W(t.principalN??t.n,2,1,7),n=W(t.angularL??t.l,1,0,Math.max(0,l-1)),c=W(t.magneticM??t.m,0,-n,n),f=W(t.finiteGridSize??t.gridSize,18,8,32),u=yt(t),m=bt(t),d=M(_(((y=t.options)==null?void 0:y.spinProjection)??t.spinProjection,St(r)),-.5,.5),e=M(_(((g=t.options)==null?void 0:g.zeemanProjection)??t.zeemanProjection,c+2*d),-8,8),p={screeningExchange:((i=t.options)==null?void 0:i.screeningExchange)??t.screeningExchange??!0,relativisticSpinOrbit:((s=t.options)==null?void 0:s.relativisticSpinOrbit)??t.relativisticSpinOrbit??r.Z>=30,correlationMixing:((P=t.options)==null?void 0:P.correlationMixing)??t.correlationMixing??r.Z>=6,wavefunctionDtAtomicUnits:M(_(((A=t.options)==null?void 0:A.wavefunctionDtAtomicUnits)??t.wavefunctionDtAtomicUnits??t.dtAtomicUnits,.002),1e-5,.02),electricFieldVm:u,electricFieldAtomicUnits:M(u/fe,-ee,ee),magneticFieldT:m,magneticFieldAtomicUnits:M(m/ge,-te,te),ambientTemperatureK:M(_(((I=t.options)==null?void 0:I.ambientTemperatureK)??t.ambientTemperatureK??a.ambientTemperatureK??a.temperatureK,298.15),.001,1e9),ambientPressurePa:M(_(((S=t.options)==null?void 0:S.ambientPressurePa)??t.ambientPressurePa??a.ambientPressurePa??a.pressurePa,101325),1e-9,1e18),spinProjection:d,zeemanProjection:e},o=[r.symbol,l,n,c,f,!!p.screeningExchange,!!p.relativisticSpinOrbit,!!p.correlationMixing,p.wavefunctionDtAtomicUnits.toExponential(4),p.electricFieldVm.toExponential(4),p.magneticFieldT.toExponential(4),p.zeemanProjection.toFixed(3),p.ambientTemperatureK.toExponential(4),p.ambientPressurePa.toExponential(4)].join(":");return{element:r,elementSymbol:r.symbol,principalN:l,angularL:n,magneticM:c,gridSize:f,options:p,inputKey:o}}function Et(t){const r=Ge(t.element,t.principalN,t.angularL,t.options),a=Oe({n:t.principalN,zEff:r}),l=a*2/Math.max(1,t.gridSize-1);return{extentBohr:a,spacingBohr:l,gridSize:t.gridSize,zEff:r,energyEv:Ue({n:t.principalN,zEff:r}),normalization:null,maxProbability:null,maxRadiusBohr:null,boundaryMass:null}}function At(t,r=0){let a=0,l=0,n=0,c=0;for(let m=0;m<t.length;m+=4)a+=Number(t[m]||0),l+=Number(t[m+1]||0),n+=Number(t[m+2]||0),c+=Number(t[m+3]||0);const f=a>0?a:1,u=a>0?1:0;return{probabilityMass:u,meanRadiusBohr:l/f,rmsRadiusBohr:Math.sqrt(Math.max(0,n/f)),normalizationError:Math.abs(1-u),boundaryMass:a>0?c/f:0,countedSamples:W(r,0,0,Number.MAX_SAFE_INTEGER),rawProbabilityMass:a,rawBoundaryMass:c,rawNormalizationMode:"webgpu-self-normalized-density-moments"}}function It(t,r,a){let l=0,n=0,c=0,f=0;for(let p=0;p<t.length;p+=4)l+=Number(t[p]||0),n+=Number(t[p+1]||0),c+=Number(t[p+2]||0),f+=Number(t[p+3]||0);const u=n>1e-18?n:1,m=f>1e-18?f:1,d=Math.sqrt(Math.max(0,l)/u),e=c/m;return{schema:nt,backend:Ze,modelId:"webgpu-screened-hydrogenic-central-difference-eigencheck-v0",mode:"wgsl-atomic-units-central-difference-reduction",status:d<.08?"finite-grid-pass":d<.25?"finite-grid-watch":"finite-grid-divergent",relativeL2:d,weightedMeanResidualHartree:e,weightedMeanResidualEv:e*B,referenceNorm:Math.sqrt(Math.max(0,n)),residualNorm:Math.sqrt(Math.max(0,l)),probabilityWeight:f,gridSize:a.gridSize,sampleCount:a.gridSize**3,spacingBohr:r.spacingBohr,extentBohr:r.extentBohr}}function Bt(t,r){const a=r.gridSize,l=Math.max(_(t.spacingBohr),1e-6),n=_(t.extentBohr),c=l*.75;let f=0,u=0;for(let m=1;m<a-1;m+=1){const d=-n+m*l;for(let e=1;e<a-1;e+=1){const p=-n+e*l;for(let o=1;o<a-1;o+=1){const h=-n+o*l;if(Math.sqrt(h*h+p*p+d*d)<=c){u+=1;continue}f+=1}}}return{interiorSampleCount:f,singularSkippedCount:u,boundarySkippedCount:Math.max(0,a**3-f-u)}}function _t(t,r,a,l,n){var ue,me,ae,pe,re,ie,J;let c=0,f=0,u=0,m=0;for(let k=0;k<t.length;k+=4)c+=Number(t[k]||0),f+=Number(t[k+1]||0),u+=Number(t[k+2]||0),m+=Number(t[k+3]||0);let d=0,e=0,p=0,o=0;for(let k=0;k<a.length;k+=4)d+=Number(a[k]||0),e+=Number(a[k+1]||0),p+=Number(a[k+2]||0),o+=Number(a[k+3]||0);const h=c>1e-18?c:1,y=f>1e-18?f:1,g=Math.sqrt(h/y);let i=0,s=0,P=0,A=0;for(let k=0;k<r.length;k+=4){const be=Number(r[k]||0),Y=Number(r[k+1]||0);P+=Number(r[k+2]||0),A+=Number(r[k+3]||0);const Pe=be/h,Ke=Y*g*g/h,Ce=Math.abs(Ke-Pe);i+=Ce,s=Math.max(s,Ce)}const I=u/h,S=P/h,x=A/h,U=e/h,v=o/h,T=d/h,R=Math.sqrt(Math.max(0,p/h)),F=M(_((ue=n.options)==null?void 0:ue.electricFieldAtomicUnits,0),-ee,ee),E=_((me=n.options)==null?void 0:me.electricFieldVm,F*fe),C=F===0?0:Math.max(Math.abs(T/F),R**3),b=-.5*C*F*F,N=M(_((ae=n.options)==null?void 0:ae.magneticFieldAtomicUnits,0),-te,te),O=_((pe=n.options)==null?void 0:pe.magneticFieldT,N*ge),Z=_(n.magneticM,0),G=M(_((re=n.options)==null?void 0:re.spinProjection,0),-.5,.5),L=M(_((ie=n.options)==null?void 0:ie.zeemanProjection,Z+2*G),-8,8),z=.5*N*L,q=Math.abs(z),w=-L,X=Math.abs(N),H=S+x+U+z,Q=H-I,j=2*S+x,ce=M(_((J=n.options)==null?void 0:J.wavefunctionDtAtomicUnits,.002),1e-5,.02),Ie=-I*ce,V=Math.abs(f/h-1),he=Bt(l,n),de={schema:st,backend:le,mode:"wgsl-central-difference-hamiltonian-component-reduction",kineticExpectationHartree:S,kineticExpectationEv:S*B,potentialExpectationHartree:x,potentialExpectationEv:x*B,componentEnergyExpectationHartree:H,componentEnergyExpectationEv:H*B,energyExpectationHartree:I,energyExpectationEv:I*B,fieldEnergyExpectationHartree:U,fieldEnergyExpectationEv:U*B,absFieldEnergyExpectationHartree:v,absFieldEnergyExpectationEv:v*B,electricFieldVm:E,electricFieldAtomicUnits:F,dipoleMomentZBohrElectron:T,fieldRmsExtentBohr:R,polarizabilityProxyBohr3:C,starkShiftProxyHartree:b,starkShiftProxyEv:b*B,magneticFieldT:O,magneticFieldAtomicUnits:N,orbitalMagneticM:Z,spinProjection:G,zeemanProjection:L,zeemanEnergyExpectationHartree:z,zeemanEnergyExpectationEv:z*B,absZeemanEnergyExpectationHartree:q,absZeemanEnergyExpectationEv:q*B,magneticMomentProjectionBohrMagneton:w,larmorAngularFrequencyProxyAu:X,hamiltonianComponentResidualHartree:Q,hamiltonianComponentResidualEv:Q*B,virialResidualHartree:j,virialResidualEv:j*B},xe={schema:ot,backend:le,modelId:"webgpu-screened-hydrogenic-stark-response-proxy-v0",mode:"first-order-electric-field-hamiltonian-perturbation",status:Math.abs(F)>0?"field-coupled":"zero-field",electricFieldVm:E,electricFieldAtomicUnits:F,maxInteractiveElectricFieldAtomicUnits:ee,atomicElectricFieldVm:fe,dipoleMomentZBohrElectron:T,fieldEnergyExpectationHartree:U,fieldEnergyExpectationEv:U*B,absFieldEnergyExpectationHartree:v,absFieldEnergyExpectationEv:v*B,fieldRmsExtentBohr:R,polarizabilityProxyBohr3:C,starkShiftProxyHartree:b,starkShiftProxyEv:b*B,responseBasis:"finite-grid-z-axis-field-proxy",validity:{status:"interactive-proxy",warnings:["This is a bounded finite-grid Stark-response proxy, not a calibrated polarizability or TDSE/DFT response calculation.","The field term is included in the WebGPU Hamiltonian as F*z in atomic units and clamped for interactive stability."]}},ye={schema:ct,backend:le,modelId:"webgpu-screened-hydrogenic-zeeman-response-proxy-v0",mode:"reduced-zeeman-hamiltonian-shift",status:Math.abs(N)>0?"field-coupled":"zero-field",magneticFieldT:O,magneticFieldAtomicUnits:N,maxInteractiveMagneticFieldAtomicUnits:te,atomicMagneticFieldT:ge,orbitalMagneticM:Z,spinProjection:G,zeemanProjection:L,magneticMomentProjectionBohrMagneton:w,zeemanEnergyExpectationHartree:z,zeemanEnergyExpectationEv:z*B,absZeemanEnergyExpectationHartree:q,absZeemanEnergyExpectationEv:q*B,larmorAngularFrequencyProxyAu:X,responseBasis:"finite-grid-magnetic-field-zeeman-proxy",validity:{status:"interactive-proxy",warnings:["This is a bounded reduced Zeeman-response proxy, not a calibrated magnetic susceptibility, spin-orbit, or many-electron magnetic response.","The magnetic term is included in the WebGPU Hamiltonian as a constant 0.5*B*(m+2s) shift in atomic units."]}};return{schema:lt,backend:le,modelId:"webgpu-central-difference-real-time-wavefunction-step-v0",mode:"wgsl-single-step-explicit-real-time-schrodinger",status:V<1e-4?"finite-difference-stable":V<.005?"finite-difference-watch":"finite-difference-unstable",hamiltonian:"H = -1/2 laplacian - Z_eff/r + Fz + 0.5*B*(m+2s)",integrator:"first-order-explicit-complex-euler-renormalized",dtAtomicUnits:ce,dtAttoseconds:ce*24.188843265857,energyExpectationHartree:I,energyExpectationEv:I*B,kineticExpectationHartree:S,kineticExpectationEv:S*B,potentialExpectationHartree:x,potentialExpectationEv:x*B,fieldEnergyExpectationHartree:U,fieldEnergyExpectationEv:U*B,absFieldEnergyExpectationHartree:v,absFieldEnergyExpectationEv:v*B,electricFieldVm:E,electricFieldAtomicUnits:F,dipoleMomentZBohrElectron:T,fieldRmsExtentBohr:R,polarizabilityProxyBohr3:C,starkShiftProxyHartree:b,starkShiftProxyEv:b*B,magneticFieldT:O,magneticFieldAtomicUnits:N,orbitalMagneticM:Z,spinProjection:G,zeemanProjection:L,zeemanEnergyExpectationHartree:z,zeemanEnergyExpectationEv:z*B,absZeemanEnergyExpectationHartree:q,absZeemanEnergyExpectationEv:q*B,magneticMomentProjectionBohrMagneton:w,larmorAngularFrequencyProxyAu:X,componentEnergyExpectationHartree:H,componentEnergyExpectationEv:H*B,hamiltonianComponentResidualHartree:Q,hamiltonianComponentResidualEv:Q*B,virialResidualHartree:j,virialResidualEv:j*B,hamiltonianComponents:de,fieldResponse:xe,fieldResponseSchema:xe.schema,magneticResponse:ye,magneticResponseSchema:ye.schema,phaseRotationRad:Ie,normBefore:c,normAfterEuler:f,normDrift:V,renormalizationScale:g,densityDriftL1:i,maxDensityDelta:s,hPsiNorm:Math.sqrt(Math.max(0,m)),gridSize:n.gridSize,sampleCount:n.gridSize**3,spacingBohr:l.spacingBohr,extentBohr:l.extentBohr,...he,validity:{status:"interactive-proxy",warnings:["This is a WebGPU reducer for the single explicit finite-difference Hamiltonian step, not a stable production time propagator.","The step starts from the base real screened hydrogenic orbital and renormalizes after the Euler update."]}}}function Ft({normalized:t,grid:r,wavefunctionEvolution:a=null,radialEigenstate:l=null}){var q,w,X,H;const n=M(_((q=t.options)==null?void 0:q.ambientTemperatureK,298.15),.001,1e9),c=M(_((w=t.options)==null?void 0:w.ambientPressurePa,101325),1e-9,1e18),f=Math.max(1e-12,n*ft),u=_((l==null?void 0:l.energyEv)??(a==null?void 0:a.energyExpectationEv)??r.energyEv,r.energyEv),m=_((a==null?void 0:a.componentEnergyExpectationEv)??((X=a==null?void 0:a.hamiltonianComponents)==null?void 0:X.componentEnergyExpectationEv),u),d=Math.min(12,Math.max(t.principalN+1,t.principalN)),e=Ue({n:d,zEff:_(r.zEff,t.element.Z)}),p=M(Math.max(1e-9,e-Math.min(u,m)),1e-9,1e9),o=Math.max(1,2*(2*t.angularL+1)),h=Math.max(1,2*d*d),y=h*Math.exp(-Math.min(700,p/f)),g=Math.max(1e-300,o+y),i=Math.log(g),s=M(y/g,0,1),P=M(o/g,0,1),A=u+s*p,I=u-f*i,S=P*(u-A)**2+s*(u+p-A)**2,x=M(S/Math.max(f*f,1e-24),0,64),U=M(i+(A-u)/f,0,128),v=Math.max(.1,Math.abs(u)),T=M(c/101325,1e-12,1e12),R=Math.exp(-Math.min(700,v/f)),F=M(R*(1+s*8)/Math.sqrt(Math.max(1e-9,T)),0,1),E=M(Math.max(0,t.element.Z)*Math.pow(T,2/3)/Math.pow(Math.max(1,n/300),1.5)*1e-4,0,128),C=M(s*.75+F*.42+Math.abs(_(a==null?void 0:a.fieldEnergyExpectationEv,0))/100+Math.abs(_(a==null?void 0:a.zeemanEnergyExpectationEv,0))/100,0,64),b=M(c*(1+s*.02+F*.14+Math.min(.2,E*.01)),1e-9,1e18),N=M(Math.log2(Math.max(1e-12,b/Math.max(1e-9,c)))*.16,-.4,.4),O=M(C*.05+F*.08,0,1.35),Z=M(E*.012,0,.32),G=M(s*38+F*45+x*.12,0,90),L=M(F*.08+Z*.02,0,.1),z=M(1-Math.min(.08,x*.0025+Math.max(0,N)*.08),.82,1.05);return{schema:dt,backend:le,modelId:"webgpu-orbital-two-level-statistical-bridge-v0",mode:"hamiltonian-spectrum-to-reduced-ensemble-closure",status:"webgpu-energy-derived-ensemble-ready",distribution:"reduced-boltzmann-two-level-saha-degeneracy",sourceHamiltonianSchema:((H=a==null?void 0:a.hamiltonianComponents)==null?void 0:H.schema)||null,sourceWavefunctionEvolutionSchema:(a==null?void 0:a.schema)||null,sourceRadialEigenstateSchema:(l==null?void 0:l.schema)||null,temperatureK:n,pressurePa:c,thermalEnergyEv:f,referenceEnergyEv:u,componentEnergyEv:m,excitedReferenceEnergyEv:u+p,excitationGapEv:p,groundDegeneracy:o,excitedDegeneracy:h,partitionFunctionLog:i,groundOccupation:P,excitedOccupation:s,freeEnergyEv:I,internalEnergyEv:A,energyVarianceEv2:S,heatCapacityProxy:x,entropyProxyKb:U,ionizationThresholdEv:v,ionizationFraction:F,opacityPopulationProxy:C,degeneracyParameter:E,ensemblePressurePa:b,sourceTerms:{pressureDriveProxy:N,opacityDriveProxy:O,ionizationDriveProxy:F,degeneracyPressureDriveProxy:Z,temperatureDeltaKProxy:G,chargeDeltaProxy:L,heatCapacityProxy:x,thermalDampingScale:z},channels:[{id:"orbital-partition",quantity:"relative-partition-function",unit:"log",driveProxy:i},{id:"orbital-excitation",quantity:"excited-state-occupation",unit:"fraction",driveProxy:s},{id:"orbital-ionization",quantity:"saha-like-ionization-population",unit:"fraction",driveProxy:F},{id:"orbital-opacity",quantity:"opacity-population-proxy",unit:"reduced",driveProxy:O},{id:"orbital-heat-capacity",quantity:"heat-capacity-proxy",unit:"reduced",driveProxy:x}],validity:{status:"interactive-proxy",warnings:["This is a reduced two-level Boltzmann/Saha-style bridge derived from WebGPU qgrid energy reductions, not a calibrated EOS or many-electron partition function.","The bridge is intended to make ensemble/statistical handoff explicit for lower-layer coupling before calibrated quantum statistical closures are available."]}}}function kt({normalized:t,grid:r,moments:a,backend:l,webgpuStatus:n=null,webgpuError:c=null,reference:f=null,parity:u=null,webgpuEigenResidual:m=null,webgpuEigenResidualError:d=null,webgpuWavefunctionEvolution:e=null,webgpuWavefunctionEvolutionError:p=null,webgpuRadialEigenstate:o=null,webgpuRadialEigenstateError:h=null}){var P,A,I,S,x,U,v,T,R;const y={n:t.principalN,l:t.angularL,magneticM:t.magneticM},g=m||null,i=e||null,s=i?Ft({normalized:t,grid:r,wavefunctionEvolution:i,radialEigenstate:o}):null;return{schema:Ve,liveBackendPolicy:K,backend:l,elementSymbol:t.element.symbol,atomicNumber:t.element.Z,principalN:t.principalN,angularL:t.angularL,magneticM:t.magneticM,gridSize:t.gridSize,sampleCount:t.gridSize**3,extentBohr:r.extentBohr,spacingBohr:r.spacingBohr,zEff:r.zEff,energyEv:r.energyEv,normalization:a.probabilityMass,normalizationError:a.normalizationError,boundaryMass:a.boundaryMass??r.boundaryMass??null,maxProbability:r.maxProbability??null,maxRadiusBohr:r.maxRadiusBohr??null,meanRadiusBohr:a.meanRadiusBohr,rmsRadiusBohr:a.rmsRadiusBohr,probabilityMass:a.probabilityMass,rawProbabilityMass:a.rawProbabilityMass??null,rawNormalizationMode:a.rawNormalizationMode||null,reductionMode:(n==null?void 0:n.reductionMode)||"webgpu-float32-orbital-evaluation-reduction",webgpuStatus:n,webgpuError:c,reference:f,parity:u,eigenResidual:g,eigenResidualSchema:(g==null?void 0:g.schema)||null,eigenResidualStatus:(g==null?void 0:g.status)||(d?"webgpu-error":"unavailable"),eigenResidualRelativeL2:(g==null?void 0:g.relativeL2)??null,eigenResidualWeightedMeanHartree:(g==null?void 0:g.weightedMeanResidualHartree)??null,eigenResidualWeightedMeanEv:(g==null?void 0:g.weightedMeanResidualEv)??null,eigenResidualMaxAbsHartree:(g==null?void 0:g.maxAbsResidualHartree)??null,eigenResidualInteriorSampleCount:(g==null?void 0:g.interiorSampleCount)??null,eigenResidualWebgpu:m?{...m}:null,eigenResidualWebgpuError:d,eigenResidualWebgpuSchema:(m==null?void 0:m.schema)||null,eigenResidualWebgpuStatus:(m==null?void 0:m.status)||null,eigenResidualWebgpuRelativeL2:(m==null?void 0:m.relativeL2)??null,eigenResidualWebgpuWeightedMeanEv:(m==null?void 0:m.weightedMeanResidualEv)??null,eigenResidualWebgpuParity:null,eigenResidualWebgpuParityOk:null,wavefunctionEvolution:i,wavefunctionEvolutionSchema:(i==null?void 0:i.schema)||null,wavefunctionEvolutionStatus:(i==null?void 0:i.status)||(p?"webgpu-error":"unavailable"),wavefunctionEvolutionDtAtomicUnits:(i==null?void 0:i.dtAtomicUnits)??null,wavefunctionEvolutionNormDrift:(i==null?void 0:i.normDrift)??null,wavefunctionEvolutionDensityDriftL1:(i==null?void 0:i.densityDriftL1)??null,wavefunctionEvolutionEnergyExpectationEv:(i==null?void 0:i.energyExpectationEv)??null,wavefunctionEvolutionKineticExpectationEv:(i==null?void 0:i.kineticExpectationEv)??null,wavefunctionEvolutionPotentialExpectationEv:(i==null?void 0:i.potentialExpectationEv)??null,wavefunctionEvolutionFieldEnergyExpectationEv:(i==null?void 0:i.fieldEnergyExpectationEv)??null,wavefunctionEvolutionAbsFieldEnergyExpectationEv:(i==null?void 0:i.absFieldEnergyExpectationEv)??null,wavefunctionEvolutionElectricFieldVm:(i==null?void 0:i.electricFieldVm)??null,wavefunctionEvolutionElectricFieldAtomicUnits:(i==null?void 0:i.electricFieldAtomicUnits)??null,wavefunctionEvolutionDipoleMomentZBohrElectron:(i==null?void 0:i.dipoleMomentZBohrElectron)??null,wavefunctionEvolutionFieldRmsExtentBohr:(i==null?void 0:i.fieldRmsExtentBohr)??null,wavefunctionEvolutionPolarizabilityProxyBohr3:(i==null?void 0:i.polarizabilityProxyBohr3)??null,wavefunctionEvolutionStarkShiftProxyEv:(i==null?void 0:i.starkShiftProxyEv)??null,wavefunctionEvolutionFieldResponse:(i==null?void 0:i.fieldResponse)??null,wavefunctionEvolutionFieldResponseSchema:((P=i==null?void 0:i.fieldResponse)==null?void 0:P.schema)??null,wavefunctionEvolutionMagneticFieldT:(i==null?void 0:i.magneticFieldT)??null,wavefunctionEvolutionMagneticFieldAtomicUnits:(i==null?void 0:i.magneticFieldAtomicUnits)??null,wavefunctionEvolutionZeemanEnergyExpectationEv:(i==null?void 0:i.zeemanEnergyExpectationEv)??null,wavefunctionEvolutionAbsZeemanEnergyExpectationEv:(i==null?void 0:i.absZeemanEnergyExpectationEv)??null,wavefunctionEvolutionMagneticMomentProjectionBohrMagneton:(i==null?void 0:i.magneticMomentProjectionBohrMagneton)??null,wavefunctionEvolutionZeemanProjection:(i==null?void 0:i.zeemanProjection)??null,wavefunctionEvolutionSpinProjection:(i==null?void 0:i.spinProjection)??null,wavefunctionEvolutionLarmorAngularFrequencyProxyAu:(i==null?void 0:i.larmorAngularFrequencyProxyAu)??null,wavefunctionEvolutionMagneticResponse:(i==null?void 0:i.magneticResponse)??null,wavefunctionEvolutionMagneticResponseSchema:((A=i==null?void 0:i.magneticResponse)==null?void 0:A.schema)??null,wavefunctionEvolutionComponentEnergyExpectationEv:(i==null?void 0:i.componentEnergyExpectationEv)??null,wavefunctionEvolutionHamiltonianComponentResidualEv:(i==null?void 0:i.hamiltonianComponentResidualEv)??null,wavefunctionEvolutionVirialResidualEv:(i==null?void 0:i.virialResidualEv)??null,wavefunctionEvolutionHamiltonianComponents:(i==null?void 0:i.hamiltonianComponents)??null,wavefunctionEvolutionHamiltonianComponentsSchema:((I=i==null?void 0:i.hamiltonianComponents)==null?void 0:I.schema)??null,wavefunctionEvolutionPhaseRotationRad:(i==null?void 0:i.phaseRotationRad)??null,wavefunctionEvolutionInteriorSampleCount:(i==null?void 0:i.interiorSampleCount)??null,wavefunctionEvolutionWebgpu:e?{...e}:null,wavefunctionEvolutionWebgpuError:p,wavefunctionEvolutionWebgpuSchema:(e==null?void 0:e.schema)||null,wavefunctionEvolutionWebgpuStatus:(e==null?void 0:e.status)||null,wavefunctionEvolutionWebgpuDtAtomicUnits:(e==null?void 0:e.dtAtomicUnits)??null,wavefunctionEvolutionWebgpuNormDrift:(e==null?void 0:e.normDrift)??null,wavefunctionEvolutionWebgpuDensityDriftL1:(e==null?void 0:e.densityDriftL1)??null,wavefunctionEvolutionWebgpuEnergyExpectationEv:(e==null?void 0:e.energyExpectationEv)??null,wavefunctionEvolutionWebgpuKineticExpectationEv:(e==null?void 0:e.kineticExpectationEv)??null,wavefunctionEvolutionWebgpuPotentialExpectationEv:(e==null?void 0:e.potentialExpectationEv)??null,wavefunctionEvolutionWebgpuFieldEnergyExpectationEv:(e==null?void 0:e.fieldEnergyExpectationEv)??null,wavefunctionEvolutionWebgpuAbsFieldEnergyExpectationEv:(e==null?void 0:e.absFieldEnergyExpectationEv)??null,wavefunctionEvolutionWebgpuElectricFieldVm:(e==null?void 0:e.electricFieldVm)??null,wavefunctionEvolutionWebgpuElectricFieldAtomicUnits:(e==null?void 0:e.electricFieldAtomicUnits)??null,wavefunctionEvolutionWebgpuDipoleMomentZBohrElectron:(e==null?void 0:e.dipoleMomentZBohrElectron)??null,wavefunctionEvolutionWebgpuFieldRmsExtentBohr:(e==null?void 0:e.fieldRmsExtentBohr)??null,wavefunctionEvolutionWebgpuPolarizabilityProxyBohr3:(e==null?void 0:e.polarizabilityProxyBohr3)??null,wavefunctionEvolutionWebgpuStarkShiftProxyEv:(e==null?void 0:e.starkShiftProxyEv)??null,wavefunctionEvolutionWebgpuFieldResponse:(e==null?void 0:e.fieldResponse)??null,wavefunctionEvolutionWebgpuFieldResponseSchema:((S=e==null?void 0:e.fieldResponse)==null?void 0:S.schema)??null,wavefunctionEvolutionWebgpuMagneticFieldT:(e==null?void 0:e.magneticFieldT)??null,wavefunctionEvolutionWebgpuMagneticFieldAtomicUnits:(e==null?void 0:e.magneticFieldAtomicUnits)??null,wavefunctionEvolutionWebgpuZeemanEnergyExpectationEv:(e==null?void 0:e.zeemanEnergyExpectationEv)??null,wavefunctionEvolutionWebgpuAbsZeemanEnergyExpectationEv:(e==null?void 0:e.absZeemanEnergyExpectationEv)??null,wavefunctionEvolutionWebgpuMagneticMomentProjectionBohrMagneton:(e==null?void 0:e.magneticMomentProjectionBohrMagneton)??null,wavefunctionEvolutionWebgpuZeemanProjection:(e==null?void 0:e.zeemanProjection)??null,wavefunctionEvolutionWebgpuSpinProjection:(e==null?void 0:e.spinProjection)??null,wavefunctionEvolutionWebgpuLarmorAngularFrequencyProxyAu:(e==null?void 0:e.larmorAngularFrequencyProxyAu)??null,wavefunctionEvolutionWebgpuMagneticResponse:(e==null?void 0:e.magneticResponse)??null,wavefunctionEvolutionWebgpuMagneticResponseSchema:((x=e==null?void 0:e.magneticResponse)==null?void 0:x.schema)??null,wavefunctionEvolutionWebgpuComponentEnergyExpectationEv:(e==null?void 0:e.componentEnergyExpectationEv)??null,wavefunctionEvolutionWebgpuHamiltonianComponentResidualEv:(e==null?void 0:e.hamiltonianComponentResidualEv)??null,wavefunctionEvolutionWebgpuVirialResidualEv:(e==null?void 0:e.virialResidualEv)??null,wavefunctionEvolutionWebgpuHamiltonianComponents:(e==null?void 0:e.hamiltonianComponents)??null,wavefunctionEvolutionWebgpuHamiltonianComponentsSchema:((U=e==null?void 0:e.hamiltonianComponents)==null?void 0:U.schema)??null,wavefunctionEvolutionWebgpuPhaseRotationRad:(e==null?void 0:e.phaseRotationRad)??null,wavefunctionEvolutionWebgpuInteriorSampleCount:(e==null?void 0:e.interiorSampleCount)??null,wavefunctionEvolutionWebgpuParity:null,wavefunctionEvolutionWebgpuParityOk:null,statisticalBridge:s,statisticalBridgeSchema:(s==null?void 0:s.schema)||null,statisticalBridgeStatus:(s==null?void 0:s.status)||(p?"webgpu-error":"unavailable"),statisticalBridgeBackend:(s==null?void 0:s.backend)||null,statisticalBridgePartitionFunctionLog:(s==null?void 0:s.partitionFunctionLog)??null,statisticalBridgeGroundOccupation:(s==null?void 0:s.groundOccupation)??null,statisticalBridgeExcitedOccupation:(s==null?void 0:s.excitedOccupation)??null,statisticalBridgeFreeEnergyEv:(s==null?void 0:s.freeEnergyEv)??null,statisticalBridgeInternalEnergyEv:(s==null?void 0:s.internalEnergyEv)??null,statisticalBridgeHeatCapacityProxy:(s==null?void 0:s.heatCapacityProxy)??null,statisticalBridgeEntropyProxyKb:(s==null?void 0:s.entropyProxyKb)??null,statisticalBridgeIonizationFraction:(s==null?void 0:s.ionizationFraction)??null,statisticalBridgeOpacityPopulationProxy:(s==null?void 0:s.opacityPopulationProxy)??null,statisticalBridgeDegeneracyParameter:(s==null?void 0:s.degeneracyParameter)??null,statisticalBridgeEnsemblePressurePa:(s==null?void 0:s.ensemblePressurePa)??null,statisticalBridgeTemperatureDeltaKProxy:((v=s==null?void 0:s.sourceTerms)==null?void 0:v.temperatureDeltaKProxy)??null,statisticalBridgeChargeDeltaProxy:((T=s==null?void 0:s.sourceTerms)==null?void 0:T.chargeDeltaProxy)??null,statisticalBridgeThermalDampingScale:((R=s==null?void 0:s.sourceTerms)==null?void 0:R.thermalDampingScale)??null,radialEigenstate:o||null,radialEigenstateSchema:(o==null?void 0:o.schema)||null,radialEigenstateStatus:(o==null?void 0:o.status)||(h?"webgpu-error":"unavailable"),radialEigenstateEnergyEv:(o==null?void 0:o.energyEv)??null,radialEigenstateAnalyticEnergyEv:(o==null?void 0:o.analyticEnergyEv)??null,radialEigenstateEnergyErrorEv:(o==null?void 0:o.energyErrorEv)??null,radialEigenstateResidualRelativeL2:(o==null?void 0:o.residualRelativeL2)??null,radialEigenstateMeanRadiusBohr:(o==null?void 0:o.meanRadiusBohr)??null,radialEigenstateGridPointCount:(o==null?void 0:o.gridPointCount)??null,radialEigenstateNodeCountObserved:(o==null?void 0:o.radialNodeCountObserved)??null,radialEigenstateNodeCountTarget:(o==null?void 0:o.radialNodeCountTarget)??null,radialEigenstateWebgpu:o?{...o,radialGrid:o.radialGrid?{...o.radialGrid,wavefunctionU:null,residualHartree:null}:null}:null,radialEigenstateWebgpuError:h,radialEigenstateWebgpuSchema:(o==null?void 0:o.schema)||null,radialEigenstateWebgpuStatus:(o==null?void 0:o.status)||null,radialEigenstateWebgpuResidualRelativeL2:(o==null?void 0:o.residualRelativeL2)??null,radialEigenstateWebgpuEnergyErrorEv:(o==null?void 0:o.energyErrorEv)??null,activeOrbital:y}}class Ut{constructor(r){this.stateKey=r,this.device=null,this.evaluationPipeline=null,this.eigenResidualPipeline=null,this.wavefunctionEvolutionPipeline=null,this.submittedEvaluations=0,this.submittedEigenResiduals=0,this.submittedWavefunctionEvolutions=0,this.lastError=null,this.deviceLossHooked=!1}async ensureDevice(){var l,n;if(this.device)return;const r=(l=globalThis.navigator)==null?void 0:l.gpu;if(!r)throw new Error("WebGPU unavailable for quantum-orbital-grid worker");const a=await r.requestAdapter({powerPreference:"high-performance"});if(!a)throw new Error("No WebGPU adapter available for quantum-orbital-grid worker");this.device=await a.requestDevice(),this.deviceLossHooked||((n=this.device.lost)==null||n.then(c=>{this.lastError=(c==null?void 0:c.message)||(c==null?void 0:c.reason)||"Quantum orbital WebGPU device lost",se.set(this.stateKey,this.lastError)}),this.deviceLossHooked=!0)}async createPipeline(r,a){var c,f,u,m;await this.ensureDevice(),(f=(c=this.device).pushErrorScope)==null||f.call(c,"validation");const l=this.device.createComputePipeline({layout:"auto",compute:{module:this.device.createShaderModule({code:r,label:a}),entryPoint:"main"}}),n=await((m=(u=this.device).popErrorScope)==null?void 0:m.call(u));if(n)throw new Error(`Quantum orbital WebGPU ${a} validation: ${n.message||n}`);return l}async initializeEvaluation(){this.evaluationPipeline||(this.evaluationPipeline=await this.createPipeline(gt,"probability-evaluation-reduction"))}async initializeEigenResidual(){this.eigenResidualPipeline||(this.eigenResidualPipeline=await this.createPipeline(ht,"eigen-residual-reduction"))}async initializeWavefunctionEvolution(){this.wavefunctionEvolutionPipeline||(this.wavefunctionEvolutionPipeline=await this.createPipeline(xt,"wavefunction-evolution-reduction"))}makeEvaluationParams(r,a){return new Float32Array([a.gridSize,_(r.extentBohr),_(r.spacingBohr),_(r.zEff,a.element.Z),ze(_(r.zEff,a.element.Z),a.principalN,a.angularL,a.options),a.principalN,a.angularL,a.magneticM,a.options.correlationMixing?1:0,a.options.relativisticSpinOrbit?1:0,a.options.screeningExchange?1:0,a.options.wavefunctionDtAtomicUnits||.002,a.options.electricFieldAtomicUnits||0,a.options.electricFieldVm||0,a.options.magneticFieldAtomicUnits||0,a.options.magneticFieldT||0,a.options.zeemanProjection||0,a.options.spinProjection||0,0,0])}async evaluate(r,a){var s,P,A,I,S;await this.initializeEvaluation();const l=globalThis.GPUBufferUsage,n=globalThis.GPUMapMode;if(!l||!n)throw new Error("WebGPU buffer constants unavailable for quantum-orbital-grid worker");const c=a.gridSize**3,f=Math.ceil(c/D),u=this.makeEvaluationParams(r,a),m=this.device.createBuffer({size:u.byteLength,usage:l.STORAGE|l.COPY_DST}),d=Math.max(16,f*4*Float32Array.BYTES_PER_ELEMENT),e=this.device.createBuffer({size:d,usage:l.STORAGE|l.COPY_SRC|l.COPY_DST}),p=this.device.createBuffer({size:d,usage:l.COPY_DST|l.MAP_READ}),o=this.device.createBindGroup({layout:this.evaluationPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:e}}]});this.device.queue.writeBuffer(m,0,u);const h=this.device.createCommandEncoder(),y=h.beginComputePass();y.setPipeline(this.evaluationPipeline),y.setBindGroup(0,o),y.dispatchWorkgroups(f),y.end(),h.copyBufferToBuffer(e,0,p,0,d),this.device.queue.submit([h.finish()]),await((P=(s=this.device.queue).onSubmittedWorkDone)==null?void 0:P.call(s)),await p.mapAsync(n.READ);const g=p.getMappedRange(),i=new Float32Array(g).slice();return p.unmap(),(A=m.destroy)==null||A.call(m),(I=e.destroy)==null||I.call(e),(S=p.destroy)==null||S.call(p),this.submittedEvaluations+=1,{moments:At(i,c),status:{schema:Ee,stateKey:this.stateKey,kernelMode:"workgroup-probability-evaluation-reduction",evaluationMode:"wgsl-screened-hydrogenic-density",reductionMode:"webgpu-float32-orbital-evaluation-reduction",normalizationMode:"gpu-self-normalized-density-moments",sampleCount:c,workgroupSize:D,chunkCount:f,submittedEvaluations:this.submittedEvaluations,radialZ:u[4],options:{screeningExchange:!!a.options.screeningExchange,relativisticSpinOrbit:!!a.options.relativisticSpinOrbit,correlationMixing:!!a.options.correlationMixing,electricFieldVm:a.options.electricFieldVm,electricFieldAtomicUnits:a.options.electricFieldAtomicUnits,magneticFieldT:a.options.magneticFieldT,magneticFieldAtomicUnits:a.options.magneticFieldAtomicUnits,zeemanProjection:a.options.zeemanProjection,spinProjection:a.options.spinProjection}}}}async evaluateEigenResidual(r,a){var s,P,A,I,S;await this.initializeEigenResidual();const l=globalThis.GPUBufferUsage,n=globalThis.GPUMapMode;if(!l||!n)throw new Error("WebGPU buffer constants unavailable for quantum-orbital-grid worker");const c=a.gridSize**3,f=Math.ceil(c/D),u=this.makeEvaluationParams(r,a),m=this.device.createBuffer({size:u.byteLength,usage:l.STORAGE|l.COPY_DST}),d=Math.max(16,f*4*Float32Array.BYTES_PER_ELEMENT),e=this.device.createBuffer({size:d,usage:l.STORAGE|l.COPY_SRC|l.COPY_DST}),p=this.device.createBuffer({size:d,usage:l.COPY_DST|l.MAP_READ}),o=this.device.createBindGroup({layout:this.eigenResidualPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:e}}]});this.device.queue.writeBuffer(m,0,u);const h=this.device.createCommandEncoder(),y=h.beginComputePass();y.setPipeline(this.eigenResidualPipeline),y.setBindGroup(0,o),y.dispatchWorkgroups(f),y.end(),h.copyBufferToBuffer(e,0,p,0,d),this.device.queue.submit([h.finish()]),await((P=(s=this.device.queue).onSubmittedWorkDone)==null?void 0:P.call(s)),await p.mapAsync(n.READ);const g=p.getMappedRange(),i=new Float32Array(g).slice();return p.unmap(),(A=m.destroy)==null||A.call(m),(I=e.destroy)==null||I.call(e),(S=p.destroy)==null||S.call(p),this.submittedEigenResiduals+=1,{report:It(i,r,a),status:{schema:Ee,stateKey:this.stateKey,kernelMode:"workgroup-eigen-residual-reduction",evaluationMode:"wgsl-screened-hydrogenic-wavefunction-central-difference",reductionMode:Ze,sampleCount:c,workgroupSize:D,chunkCount:f,submittedEigenResiduals:this.submittedEigenResiduals,radialZ:u[4],electricFieldVm:u[13],electricFieldAtomicUnits:u[12],magneticFieldT:u[15],magneticFieldAtomicUnits:u[14],zeemanProjection:u[16],spinProjection:u[17]}}}async evaluateWavefunctionEvolution(r,a){var U,v,T,R,F,E,C,b,N;await this.initializeWavefunctionEvolution();const l=globalThis.GPUBufferUsage,n=globalThis.GPUMapMode;if(!l||!n)throw new Error("WebGPU buffer constants unavailable for quantum-orbital-grid worker");const c=a.gridSize**3,f=Math.ceil(c/D),u=this.makeEvaluationParams(r,a),m=this.device.createBuffer({size:u.byteLength,usage:l.STORAGE|l.COPY_DST}),d=Math.max(16,c*4*Float32Array.BYTES_PER_ELEMENT),e=Math.max(16,f*4*Float32Array.BYTES_PER_ELEMENT),p=this.device.createBuffer({size:d,usage:l.STORAGE|l.COPY_SRC|l.COPY_DST}),o=this.device.createBuffer({size:e,usage:l.STORAGE|l.COPY_SRC|l.COPY_DST}),h=this.device.createBuffer({size:e,usage:l.STORAGE|l.COPY_SRC|l.COPY_DST}),y=this.device.createBuffer({size:d,usage:l.COPY_DST|l.MAP_READ}),g=this.device.createBuffer({size:e,usage:l.COPY_DST|l.MAP_READ}),i=this.device.createBuffer({size:e,usage:l.COPY_DST|l.MAP_READ}),s=this.device.createBindGroup({layout:this.wavefunctionEvolutionPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:m}},{binding:1,resource:{buffer:p}},{binding:2,resource:{buffer:o}},{binding:3,resource:{buffer:h}}]});this.device.queue.writeBuffer(m,0,u);const P=this.device.createCommandEncoder(),A=P.beginComputePass();A.setPipeline(this.wavefunctionEvolutionPipeline),A.setBindGroup(0,s),A.dispatchWorkgroups(f),A.end(),P.copyBufferToBuffer(p,0,y,0,d),P.copyBufferToBuffer(o,0,g,0,e),P.copyBufferToBuffer(h,0,i,0,e),this.device.queue.submit([P.finish()]),await((v=(U=this.device.queue).onSubmittedWorkDone)==null?void 0:v.call(U)),await Promise.all([y.mapAsync(n.READ),g.mapAsync(n.READ),i.mapAsync(n.READ)]);const I=new Float32Array(y.getMappedRange()).slice(),S=new Float32Array(g.getMappedRange()).slice(),x=new Float32Array(i.getMappedRange()).slice();return y.unmap(),g.unmap(),i.unmap(),(T=m.destroy)==null||T.call(m),(R=p.destroy)==null||R.call(p),(F=o.destroy)==null||F.call(o),(E=h.destroy)==null||E.call(h),(C=y.destroy)==null||C.call(y),(b=g.destroy)==null||b.call(g),(N=i.destroy)==null||N.call(i),this.submittedWavefunctionEvolutions+=1,{report:_t(S,I,x,r,a),status:{schema:Ee,stateKey:this.stateKey,kernelMode:"workgroup-wavefunction-evolution-reduction",evaluationMode:"wgsl-screened-hydrogenic-wavefunction-central-difference-step",reductionMode:le,sampleCount:c,workgroupSize:D,chunkCount:f,submittedWavefunctionEvolutions:this.submittedWavefunctionEvolutions,radialZ:u[4],dtAtomicUnits:u[11],electricFieldVm:u[13],electricFieldAtomicUnits:u[12],magneticFieldT:u[15],magneticFieldAtomicUnits:u[14],zeemanProjection:u[16],spinProjection:u[17]}}}}function vt(t={}){var a,l;const r=t.input||t;return{payload:t,input:r,stateKey:t.stateKey||r.stateKey||r.taskId||Le,scope:r.scope||t.scope||((l=(a=t.solver)==null?void 0:a.warmDelta)==null?void 0:l.scope)||mt,taskId:r.taskId||t.stateKey||r.stateKey||Le,emitCommitDelta:r.emitCommitDelta===!0||t.emitCommitDelta===!0}}function He({payload:t,input:r,stateKey:a,sequence:l,summary:n,diagnostics:c,backend:f,webgpuStatus:u,webgpuError:m,status:d=null,normalized:e=null}){var p,o,h,y,g,i,s,P,A,I,S,x;return{schema:((o=(p=t.solver)==null?void 0:p.warmDelta)==null?void 0:o.schema)||it,solverId:((h=t.solver)==null?void 0:h.id)||"quantum-orbital-grid",stateKey:a,backend:f,status:d,liveBackendPolicy:K,sequence:l,finiteGrid:n,diagnostics:c,webgpuStatus:u,webgpuError:m,parameters:{elementSymbol:(n==null?void 0:n.elementSymbol)||((y=e==null?void 0:e.element)==null?void 0:y.symbol)||r.elementSymbol||"O",principalN:(n==null?void 0:n.principalN)??(e==null?void 0:e.principalN)??r.principalN??r.n??2,angularL:(n==null?void 0:n.angularL)??(e==null?void 0:e.angularL)??r.angularL??r.l??1,magneticM:(n==null?void 0:n.magneticM)??(e==null?void 0:e.magneticM)??r.magneticM??r.m??0,gridSize:(n==null?void 0:n.gridSize)??(e==null?void 0:e.gridSize)??r.finiteGridSize??r.gridSize??18,options:(e==null?void 0:e.options)||r.options||null,electricFieldVm:(n==null?void 0:n.wavefunctionEvolutionElectricFieldVm)??((g=e==null?void 0:e.options)==null?void 0:g.electricFieldVm)??0,electricFieldAtomicUnits:(n==null?void 0:n.wavefunctionEvolutionElectricFieldAtomicUnits)??((i=e==null?void 0:e.options)==null?void 0:i.electricFieldAtomicUnits)??0,magneticFieldT:(n==null?void 0:n.wavefunctionEvolutionMagneticFieldT)??((s=e==null?void 0:e.options)==null?void 0:s.magneticFieldT)??0,magneticFieldAtomicUnits:(n==null?void 0:n.wavefunctionEvolutionMagneticFieldAtomicUnits)??((P=e==null?void 0:e.options)==null?void 0:P.magneticFieldAtomicUnits)??0,zeemanProjection:(n==null?void 0:n.wavefunctionEvolutionZeemanProjection)??((A=e==null?void 0:e.options)==null?void 0:A.zeemanProjection)??0,spinProjection:(n==null?void 0:n.wavefunctionEvolutionSpinProjection)??((I=e==null?void 0:e.options)==null?void 0:I.spinProjection)??0,ambientTemperatureK:((S=e==null?void 0:e.options)==null?void 0:S.ambientTemperatureK)??298.15,ambientPressurePa:((x=e==null?void 0:e.options)==null?void 0:x.ambientPressurePa)??101325},units:{length:"Bohr radius",probability:"normalized electron probability"}}}function Fe({resolved:t,normalized:r,sampleCount:a,reason:l,status:n="blocked-webgpu-unavailable",backend:c="webgpu-unavailable"}){var y;const{payload:f,input:u,stateKey:m}=t,e=(oe.get(m)||{sequence:0}).sequence+1;oe.set(m,{sequence:e,inputKey:r.inputKey,backend:c,status:n});const p={schema:Ee,stateKey:m,status:n,backend:c,liveBackendPolicy:K,kernelMode:"blocked",evaluationMode:"blocked-webgpu-only-density-evaluation",reductionMode:"blocked-webgpu-only-orbital-grid",sampleCount:a,workgroupSize:D,fallback:!1,reason:l},o={schema:"peercompute.multiscale.quantum-orbital-grid.diagnostics.v0",inputKey:r.inputKey,elementSymbol:r.element.symbol,atomicNumber:r.element.Z,gridSize:r.gridSize,sampleCount:a,probabilityMass:null,normalizationError:null,meanRadiusBohr:null,rmsRadiusBohr:null,boundaryMass:null,reductionMode:"blocked-webgpu-only-orbital-grid",parity:null,finiteGrid:null,liveBackendPolicy:K},h={ok:!1,schema:ve,executionContext:Te(),solverId:((y=f.solver)==null?void 0:y.id)||"quantum-orbital-grid",stateKey:m,status:n,backend:c,liveBackendPolicy:K,sequence:e,elapsedTime:e,inputKey:r.inputKey,finiteGrid:null,diagnostics:o,conservation:{probabilityMass:null,normalizationError:null,mode:"blocked-webgpu-only-orbital-grid-evaluation",electronDensityAvailable:!1,wavefunctionEvolutionAvailable:!1},webgpuStatus:p,webgpuError:l,parameters:{elementSymbol:r.element.symbol,principalN:r.principalN,angularL:r.angularL,magneticM:r.magneticM,gridSize:r.gridSize,options:r.options}};return t.emitCommitDelta?{value:h,commitDelta:{taskId:t.taskId,scope:t.scope,version:e,timestamp:Date.now(),payload:He({payload:f,input:u,stateKey:m,sequence:e,summary:null,diagnostics:o,backend:c,webgpuStatus:p,webgpuError:l,status:n,normalized:r})}}:h}function Lt(t={}){if(t.stateKey||t.taskId){const r=t.stateKey||t.taskId;oe.delete(r),Ae.delete(r),se.delete(r)}else oe.clear(),Ae.clear(),se.clear();return{ok:!0,schema:ve,executionContext:Te()}}async function Dt(t={}){var T,R,F,E,C;const r=vt(t),{input:a,stateKey:l}=r,n=Mt(a),c=n.gridSize**3;if(c>W(a.webgpuMaxSamples,ut,1,262144))throw new Error(`quantum-orbital-grid sample count ${c} exceeds configured maximum`);const f=Et(n),u=pt;let m=null,d=null,e=null,p=null,o=null,h=null,y=null,g=null,i=null,s=null,P=null;if(!(a.enableWebGPU!==!1&&a.webgpu!==!1))return Fe({resolved:r,normalized:n,sampleCount:c,reason:"quantum-orbital-grid requires WebGPU; enableWebGPU=false is blocked by webgpu-only-no-cpu-fallback policy"});if(se.has(l))return Fe({resolved:r,normalized:n,sampleCount:c,reason:`${se.get(l)}; no CPU fallback is available for quantum-orbital-grid`});try{P=Ae.get(l),P||(P=new Ut(l),Ae.set(l,P));const b=await P.evaluate(f,n);m=b.moments,d={...b.status,liveBackendPolicy:K,fallback:!1}}catch(b){return e=b instanceof Error?b.message:String(b),se.set(l,e),Fe({resolved:r,normalized:n,sampleCount:c,reason:`${e}; no CPU fallback is available for quantum-orbital-grid`,status:"blocked-webgpu-execution-error",backend:"webgpu-execution-error"})}if(P&&u.startsWith("webgpu-")){try{const b=await P.evaluateEigenResidual(f,n);o=b.report,d={...d||{},eigenResidual:{...b.status,liveBackendPolicy:K,fallback:!1}}}catch(b){h=b instanceof Error?b.message:String(b),d=d&&{...d,eigenResidualError:h}}try{const b=await P.evaluateWavefunctionEvolution(f,n);y=b.report,d={...d||{},wavefunctionEvolution:{...b.status,liveBackendPolicy:K,fallback:!1}}}catch(b){g=b instanceof Error?b.message:String(b),d=d&&{...d,wavefunctionEvolutionError:g}}try{i=await rt({element:n.element,atomicNumber:n.element.Z,n:n.principalN,l:n.angularL,zEff:f.zEff,options:n.options,gridPointCount:W(a.radialGridPointCount??a.gridPointCount,Math.max(192,n.gridSize*12),96,768),radialExtentBohr:a.radialExtentBohr??Math.max(f.extentBohr,f.extentBohr*1.2),gpuDevice:P.device}),d={...d||{},radialEigenstate:{schema:i.schema,backend:i.backend,status:i.status,kernelMode:((T=i.webgpuStatus)==null?void 0:T.kernelMode)||"webgpu-radial-hamiltonian",reductionMode:((R=i.webgpuStatus)==null?void 0:R.reductionMode)||"webgpu-workgroup-partials-js-final-sum",gridPointCount:i.gridPointCount,workgroupSize:((F=i.webgpuStatus)==null?void 0:F.workgroupSize)||null,partialCount:((E=i.webgpuStatus)==null?void 0:E.partialCount)||null,liveBackendPolicy:K,fallback:!1}}}catch(b){s=b instanceof Error?b.message:String(b),d=d&&{...d,radialEigenstateError:s}}}const S=(oe.get(l)||{sequence:0}).sequence+1;oe.set(l,{sequence:S,inputKey:n.inputKey,backend:u});const x=kt({normalized:n,grid:f,moments:m,backend:u,webgpuStatus:d,webgpuError:e,reference:null,parity:p,webgpuEigenResidual:o,webgpuEigenResidualError:h,webgpuWavefunctionEvolution:y,webgpuWavefunctionEvolutionError:g,webgpuRadialEigenstate:i,webgpuRadialEigenstateError:s}),U={schema:"peercompute.multiscale.quantum-orbital-grid.diagnostics.v0",inputKey:n.inputKey,elementSymbol:n.element.symbol,atomicNumber:n.element.Z,gridSize:n.gridSize,sampleCount:c,probabilityMass:x.probabilityMass,normalizationError:x.normalizationError,meanRadiusBohr:x.meanRadiusBohr,rmsRadiusBohr:x.rmsRadiusBohr,boundaryMass:x.boundaryMass,reductionMode:x.reductionMode,parity:p,radialEigenstateSchema:x.radialEigenstateSchema,radialEigenstateStatus:x.radialEigenstateStatus,radialEigenstateEnergyEv:x.radialEigenstateEnergyEv,radialEigenstateResidualRelativeL2:x.radialEigenstateResidualRelativeL2,radialEigenstateWebgpuError:x.radialEigenstateWebgpuError||null},v={ok:!0,schema:ve,executionContext:Te(),solverId:((C=t.solver)==null?void 0:C.id)||"quantum-orbital-grid",stateKey:l,status:"webgpu-executed",backend:u,liveBackendPolicy:K,sequence:S,elapsedTime:S,inputKey:n.inputKey,finiteGrid:x,diagnostics:U,conservation:{probabilityMass:x.probabilityMass,normalizationError:x.normalizationError,mode:"webgpu-normalized-probability-grid"},webgpuStatus:d,webgpuError:e,parameters:{elementSymbol:n.element.symbol,principalN:n.principalN,angularL:n.angularL,magneticM:n.magneticM,gridSize:n.gridSize,options:n.options}};return r.emitCommitDelta?{value:v,commitDelta:{taskId:r.taskId,scope:r.scope,version:S,timestamp:Date.now(),payload:He({payload:t,input:a,stateKey:l,sequence:S,summary:x,diagnostics:U,backend:u,webgpuStatus:d,webgpuError:e,status:"webgpu-executed",normalized:n})}}:v}export{it as QUANTUM_ORBITAL_GRID_DELTA_SCHEMA,nt as QUANTUM_ORBITAL_GRID_EIGEN_RESIDUAL_WEBGPU_SCHEMA,ot as QUANTUM_ORBITAL_GRID_FIELD_RESPONSE_WEBGPU_SCHEMA,st as QUANTUM_ORBITAL_GRID_HAMILTONIAN_COMPONENTS_WEBGPU_SCHEMA,K as QUANTUM_ORBITAL_GRID_LIVE_BACKEND_POLICY,ct as QUANTUM_ORBITAL_GRID_MAGNETIC_RESPONSE_WEBGPU_SCHEMA,ut as QUANTUM_ORBITAL_GRID_MAX_SAMPLES,Rt as QUANTUM_ORBITAL_GRID_PARITY_SCHEMA,Nt as QUANTUM_ORBITAL_GRID_RADIAL_WEBGPU_SCHEMA,ve as QUANTUM_ORBITAL_GRID_RESULT_SCHEMA,dt as QUANTUM_ORBITAL_GRID_STATISTICAL_BRIDGE_SCHEMA,lt as QUANTUM_ORBITAL_GRID_WAVEFUNCTION_EVOLUTION_WEBGPU_SCHEMA,Ee as QUANTUM_ORBITAL_GRID_WEBGPU_SCHEMA,Lt as resetQuantumOrbitalGrid,Dt as stepQuantumOrbitalGrid};
