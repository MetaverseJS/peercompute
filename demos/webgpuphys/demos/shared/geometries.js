export function createBoxGeometry() {
  const vertices = new Float32Array([
    // Front face
    -1, -1,  1,   0,  0,  1,
     1, -1,  1,   0,  0,  1,
     1,  1,  1,   0,  0,  1,
    -1,  1,  1,   0,  0,  1,
    // Back face
     1, -1, -1,   0,  0, -1,
    -1, -1, -1,   0,  0, -1,
    -1,  1, -1,   0,  0, -1,
     1,  1, -1,   0,  0, -1,
    // Top face
    -1,  1,  1,   0,  1,  0,
     1,  1,  1,   0,  1,  0,
     1,  1, -1,   0,  1,  0,
    -1,  1, -1,   0,  1,  0,
    // Bottom face
    -1, -1, -1,   0, -1,  0,
     1, -1, -1,   0, -1,  0,
     1, -1,  1,   0, -1,  0,
    -1, -1,  1,   0, -1,  0,
    // Right face
     1, -1,  1,   1,  0,  0,
     1, -1, -1,   1,  0,  0,
     1,  1, -1,   1,  0,  0,
     1,  1,  1,   1,  0,  0,
    // Left face
    -1, -1, -1,  -1,  0,  0,
    -1, -1,  1,  -1,  0,  0,
    -1,  1,  1,  -1,  0,  0,
    -1,  1, -1,  -1,  0,  0,
  ]);

  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23,
  ]);

  return { vertices, indices };
}

export function createSphereGeometry(radius = 1, widthSegments = 16, heightSegments = 12) {
  const vertices = [];
  const indices = [];

  for (let y = 0; y <= heightSegments; y++) {
    for (let x = 0; x <= widthSegments; x++) {
      const u = x / widthSegments;
      const v = y / heightSegments;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const px = -radius * Math.sin(phi) * Math.cos(theta);
      const py = radius * Math.cos(phi);
      const pz = radius * Math.sin(phi) * Math.sin(theta);
      
      const nx = px / radius;
      const ny = py / radius;
      const nz = pz / radius;
      
      vertices.push(px, py, pz, nx, ny, nz);
    }
  }

  const stride = widthSegments + 1;
  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const a = y * stride + x;
      const b = y * stride + x + 1;
      const c = (y + 1) * stride + x;
      const d = (y + 1) * stride + x + 1;
      
      // Winding order: CCW
      if (y !== 0) indices.push(a, d, b);
      if (y !== heightSegments - 1) indices.push(a, c, d);
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices)
  };
}

export function createCylinderGeometry(segments = 16) {
  const vertices = [];
  const indices = [];

  // Top cap
  vertices.push(0, 1, 0, 0, 1, 0); // Center top
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.sin(theta);
    const z = Math.cos(theta);
    vertices.push(x, 1, z, 0, 1, 0);
  }
  for (let i = 0; i < segments; i++) {
    indices.push(0, i + 1, (i + 1) % segments + 1);
  }

  // Bottom cap
  const offsetBottom = vertices.length / 6;
  vertices.push(0, -1, 0, 0, -1, 0); // Center bottom
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.sin(theta);
    const z = Math.cos(theta);
    vertices.push(x, -1, z, 0, -1, 0);
  }
  for (let i = 0; i < segments; i++) {
    indices.push(offsetBottom, offsetBottom + (i + 1) % segments + 1, offsetBottom + i + 1);
  }

  // Sides
  const offsetSide = vertices.length / 6;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.sin(theta);
    const z = Math.cos(theta);
    // Normal is (x, 0, z)
    vertices.push(x, 1, z, x, 0, z); // Top edge
    vertices.push(x, -1, z, x, 0, z); // Bottom edge
  }
  for (let i = 0; i < segments; i++) {
    const a = offsetSide + i * 2;
    const b = offsetSide + i * 2 + 1;
    const c = offsetSide + (i + 1) * 2;
    const d = offsetSide + (i + 1) * 2 + 1;
    indices.push(a, b, d);
    indices.push(a, d, c);
  }

  return { 
    vertices: new Float32Array(vertices), 
    indices: new Uint16Array(indices) 
  };
}

export function getTetrisBlocks(type) {
  const blocks = {
    I: [[-1.5,0.5,0.5], [-0.5,0.5,0.5], [0.5,0.5,0.5], [1.5,0.5,0.5]],
    J: [[-1.5,1.5,0.5], [-1.5,0.5,0.5], [-0.5,0.5,0.5], [0.5,0.5,0.5]],
    L: [[1.5,1.5,0.5], [1.5,0.5,0.5], [0.5,0.5,0.5], [-0.5,0.5,0.5]],
    O: [[-0.5,1.5,0.5], [0.5,1.5,0.5], [-0.5,0.5,0.5], [0.5,0.5,0.5]],
    S: [[0.5,1.5,0.5], [-0.5,1.5,0.5], [-0.5,0.5,0.5], [-1.5,0.5,0.5]],
    T: [[-0.5,1.5,0.5], [-1.5,0.5,0.5], [-0.5,0.5,0.5], [0.5,0.5,0.5]],
    Z: [[-1.5,1.5,0.5], [-0.5,1.5,0.5], [-0.5,0.5,0.5], [0.5,0.5,0.5]],
  };
  return blocks[type];
}

export function createTetrisGeometry(type) {
  const offsets = getTetrisBlocks(type);
  if (!offsets) throw new Error("Unknown tetris type");
  // Let's assume standard grid coords 0,1,2,3.
  // And center the shape around (0,0,0).
  // Cube is 1x1x1. Extents -0.5 to 0.5 relative to center.
  
  // Center of mass adjustments? We'll assume the provided coordinates are relative to body center.
  // We'll normalize coordinates later in physics. For rendering, we just place 4 cubes.
  
  // Create geometry by merging 4 cubes
  const baseBox = createBoxGeometry();
  const vPerBox = baseBox.vertices.length / 6; // floats per box
  const numVerts = vPerBox * 4; // 4 blocks
  const vertices = new Float32Array(numVerts * 6);
  
  const iPerBox = baseBox.indices.length;
  const indices = new Uint16Array(iPerBox * 4);

  // Center of the shape (average of block centers)
  let cx=0, cy=0, cz=0;
  for(let p of offsets) { cx+=p[0]; cy+=p[1]; cz+=p[2]; }
  cx/=4; cy/=4; cz/=4;

  for (let i = 0; i < 4; i++) {
    const off = offsets[i];
    const dx = (off[0] - cx) * 1.0; // Scale? We assume scale=1.0 for unit blocks
    const dy = (off[1] - cy) * 1.0;
    const dz = (off[2] - cz) * 1.0;

    // Vertices
    // Each vertex is 6 floats: x,y,z, nx,ny,nz
    for (let j = 0; j < vPerBox; j++) { // j is vertex index
        // Base box is size 2 (-1 to 1). We want size 1. So scale by 0.5.
        // Wait, standard unit cube is usually size 1. createBoxGeometry is size 2.
        // Let's scale base box by 0.5 to make it unit size 1.
        let bx = baseBox.vertices[j*6+0] * 0.5;
        let by = baseBox.vertices[j*6+1] * 0.5;
        let bz = baseBox.vertices[j*6+2] * 0.5;
        
        vertices[(i*vPerBox + j)*6 + 0] = bx + dx;
        vertices[(i*vPerBox + j)*6 + 1] = by + dy;
        vertices[(i*vPerBox + j)*6 + 2] = bz + dz;
        // Normals
        vertices[(i*vPerBox + j)*6 + 3] = baseBox.vertices[j*6+3];
        vertices[(i*vPerBox + j)*6 + 4] = baseBox.vertices[j*6+4];
        vertices[(i*vPerBox + j)*6 + 5] = baseBox.vertices[j*6+5];
    }

    // Indices
    for (let j = 0; j < iPerBox; j++) {
        indices[i*iPerBox + j] = baseBox.indices[j] + (i * vPerBox); // Offset index by vertex count
    }
  }

  return { vertices, indices };
}
