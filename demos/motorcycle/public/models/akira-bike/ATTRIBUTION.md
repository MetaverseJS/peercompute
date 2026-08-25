# Akira Bike model attribution

This work is based on ["Akira Bike"](https://sketchfab.com/3d-models/akira-bike-a5b1dc49808b40a9b94f9a4a3073d548) by [Ryanwill679](https://sketchfab.com/Ryanwill679), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The local `LICENSE.txt` is the attribution and license record included with the authenticated Sketchfab download.

## Changes made by Peercompute

- Flattened, joined, welded, and pruned the downloaded glTF scene.
- Reduced the mesh from 116,412 to 58,870 triangles with meshoptimizer-based simplification.
- Quantized and Meshopt-compressed geometry.
- Converted referenced textures to GPU-compressed KTX2 (ETC1S or UASTC), generated mipmaps, and capped their longest edge at 1024 pixels.
- Packaged the derivative as a self-contained GLB and calibrated it at runtime to a 1.67 m wheelbase with Peercompute's +Y-up, +Z-forward, +X-axle convention.
- Applied a 0.12573690675938365-metre presentation-only downward grounding offset so the visible model minimum aligns with the physics tire-bottom midpoint; physics and collision geometry are unchanged.
- The derivative is an unrigged, chassis-only presentation mesh. It does not supply collision shapes or physics; Peercompute's six-body particle-rigid motorcycle remains authoritative.

"Akira Bike" and its source author are not affiliated with or endorsing Peercompute.

## Local texture transcoder

The `basis/` directory contains the Basis Universal transcoder distributed with three.js r182. Basis Universal is licensed under Apache License 2.0; the local `basis/APACHE-2.0.txt` contains that license. These files are local runtime dependencies and are not part of the CC BY model.
