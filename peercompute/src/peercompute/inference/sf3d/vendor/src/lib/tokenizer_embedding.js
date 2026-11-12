import {createEmptyBuffer,createStorageBuffer} from './gpu.js';

// Shared unchanged inference kernel: [3,1024,96,96] -> [1024,27648].
const code=`
              struct P { Np: u32, C: u32, H: u32, W: u32, numWgX: u32 }
              @group(0) @binding(0) var<uniform> p: P;
              @group(0) @binding(1) var<storage, read> src: array<f32>;
              @group(0) @binding(2) var<storage, read_write> dst: array<f32>;
              @compute @workgroup_size(256)
              fn main(@builtin(workgroup_id) wgid: vec3u, @builtin(local_invocation_id) lid: vec3u) {
                let idx = (wgid.x + wgid.y * p.numWgX) * 256u + lid.x;
                let total = p.Np * p.C * p.H * p.W;
                if (idx >= total) { return; }
                // idx iterates over destination [C, Np*H*W]
                let c = idx / (p.Np * p.H * p.W);
                let s = idx % (p.Np * p.H * p.W);
                let plane = s / (p.H * p.W);
                let hw = s % (p.H * p.W);
                // source layout: [Np, C, H, W]
                let srcIdx = plane * p.C * p.H * p.W + c * p.H * p.W + hw;
                dst[idx] = src[srcIdx];
              }
            `;
export function dispatchTokenizerEmbedding(encoder,device,pipelines,embedding){
  const Np=3,C=1024,H=96,W=96,total=Np*C*H*W;
  if(embedding?.size!==total*4)throw Error('complete tokenizer embedding dimensions required');
  if(!pipelines._rearrangePipeline)pipelines._rearrangePipeline=device.createComputePipeline({
    layout:'auto',compute:{module:device.createShaderModule({code}),entryPoint:'main'},
  });
  const totalWG=Math.ceil(total/256),wgX=Math.min(totalWG,65535),wgY=Math.ceil(totalWG/65535);
  const params=createStorageBuffer(device,new Uint32Array([Np,C,H,W,wgX]),GPUBufferUsage.UNIFORM,'tokenizer-rearrange-uniform');
  const output=createEmptyBuffer(device,total*4);
  const bg=device.createBindGroup({layout:pipelines._rearrangePipeline.getBindGroupLayout(0),entries:[
    {binding:0,resource:{buffer:params}},{binding:1,resource:{buffer:embedding}},{binding:2,resource:{buffer:output}},
  ]});
  const pass=encoder.beginComputePass();pass.setPipeline(pipelines._rearrangePipeline);pass.setBindGroup(0,bg);
  pass.dispatchWorkgroups(wgX,wgY);pass.end();
  // The command owner retains captured output/uniform through its queue fence.
  return output;
}
