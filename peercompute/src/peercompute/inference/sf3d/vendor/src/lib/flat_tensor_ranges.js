// Flat-v1 source adapter. Kit 0.1.52 chunks upload unchanged bytes and its
// verified custody does not expose a conversion hook. Keep SF3D's existing
// mixed-F16/F32 conversion; do not mislabel packed F16 as an F32 kit bundle.
// Explicit reservations are not a bound on network, GC or driver backing.
const ENTRY_SIZE=160, MAGIC=0x33445346;

export function parseFlatWeightHeader(buffer, totalBytes=Infinity) {
  const view=new DataView(buffer);
  if(buffer.byteLength<16 || view.getUint32(0,true)!==MAGIC)throw Error('Invalid weight file magic/header');
  if(view.getUint32(4,true)!==1)throw Error('Unsupported weight file version');
  const count=view.getUint32(8,true),headerSize=view.getUint32(12,true);
  if(headerSize!==16+count*ENTRY_SIZE || headerSize!==buffer.byteLength || headerSize>totalBytes)
    throw Error('weight header exceeds or contradicts received bytes');
  const tensors=new Map(), intervals=[];
  for(let i=0;i<count;i++){
    const off=16+i*ENTRY_SIZE,bytes=new Uint8Array(buffer,off,128),end=bytes.indexOf(0);
    const name=new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(0,end<0?128:end));
    const dtype=view.getUint32(off+128,true),rank=view.getUint32(off+132,true);
    // The canonical converter records the full rank but stores four axes only.
    // Never read the offset/size fields as axes or invent the omitted axes.
    const shape=Array.from({length:Math.min(rank,4)},(_,d)=>view.getUint32(off+136+4*d,true));
    const offset=headerSize+view.getUint32(off+152,true),size=view.getUint32(off+156,true),width=dtype===0?4:2;
    if(!name || tensors.has(name) || (dtype!==0 && dtype!==1) || size===0 || size%width || offset%width || offset+size>totalBytes)
      throw Error('invalid/duplicate/out-of-bounds flat tensor: '+name);
    if(rank<=4 && shape.reduce((n,d)=>n*d,1)*width!==size)throw Error('tensor shape/size conflict: '+name);
    tensors.set(name,{dtype,shape,declaredRank:rank,shapeComplete:rank<=4,offset,size});
    intervals.push({name,offset,size});
  }
  intervals.sort((a,b)=>a.offset-b.offset);
  for(let i=1;i<intervals.length;i++)if(intervals[i].offset<intervals[i-1].offset+intervals[i-1].size)
    throw Error('overlapping flat tensors: '+intervals[i].name);
  return {tensors,headerSize};
}

export async function createFlatTensorRangeSource() { throw new Error('PeerCompute requires artifact-backed SF3D tensor ranges'); }
