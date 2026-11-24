# ExoPute

Browser-native P2P networking, CRDT state, spatial tile coordination, and managed CPU/WASM/WebGPU compute mesh.

`exopute` is the upcoming brand package for [PeerCompute](https://github.com/MetaverseJS/peercompute) and currently re-exports the complete PeerCompute runtime:

- `exopute` — full library (core + optional inference & agent runtimes)
- `exopute/core` — slim core entrypoint (`NodeKernel`, `ComputeManager`, `StateManager`, `ReservationLedger`, `SpatialTileLeaseBroker`, `NetworkManager`, `GPUHubManager`, `GpuResidentLaneManager`, `SolverRegistry`, `PlacementAdmissionPolicy`, `RemoteResultQuorumValidator`, `serviceOrchestration`) with zero ONNX/Transformers/WASM inference import edges
- `exopute/inference` — optional model, peer inference, artifact, and embodied agent runtimes

## Usage

```js
import { NodeKernel, SpatialTileLeaseBroker } from 'exopute/core';
```

## Links

- Website: https://exopute.com
- Source & Demos: https://github.com/MetaverseJS/peercompute

## License

MIT
