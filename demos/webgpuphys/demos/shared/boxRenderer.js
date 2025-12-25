class BoxRenderer {
  constructor(device, canvas) {
    this.device = device;
    this.canvas = canvas;

    this.context = canvas.getContext('webgpu');
    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device,
      format: this.format,
      alphaMode: 'premultiplied',
    });

    const { vertices, indices } = this.createBoxGeometry();
    this.vertexBuffer = device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, vertices);

    this.indexBuffer = device.createBuffer({
      size: indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, indices);
    this.indexCount = indices.length;

    this.uniformBuffer = device.createBuffer({
      size: 80, // mat4x4<f32> (64) + vec3<f32> (12) + pad (4) = 80
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const shaderCode = `
      struct Uniforms {
        viewProj: mat4x4<f32>,
        scale: vec3<f32>,
      }
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      @group(0) @binding(1) var<storage, read> positions: array<vec4<f32>>;
      @group(0) @binding(2) var<storage, read> quaternions: array<vec4<f32>>;

      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) normal: vec3<f32>,
        @location(1) @interpolate(flat) instanceId: u32
      }

      fn quatRotate(q: vec4<f32>, v: vec3<f32>) -> vec3<f32> {
        let t = 2.0 * cross(q.xyz, v);
        return v + q.w * t + cross(q.xyz, t);
      }

      @vertex
      fn vs_main(
        @location(0) localPos: vec3<f32>,
        @location(1) normal: vec3<f32>,
        @builtin(instance_index) instanceId: u32
      ) -> VertexOutput {
        let bodyPos = positions[instanceId].xyz;
        let bodyQuat = quaternions[instanceId];
        
        let worldPos = bodyPos + quatRotate(bodyQuat, localPos * uniforms.scale * 0.5);
        let worldNormal = quatRotate(bodyQuat, normal);
        
        var out: VertexOutput;
        out.position = uniforms.viewProj * vec4(worldPos, 1.0);
        out.normal = worldNormal;
        out.instanceId = instanceId;
        return out;
      }

      @fragment
      fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
        let lightDir = vec3(0.0, 1.0, 0.0); // Straight down
        let ambient = 0.3;
        let diffuse = max(dot(in.normal, lightDir), 0.0);
        let hue = f32(in.instanceId % 12u) / 12.0;
        let color = hsvToRgb(hue, 0.7, 0.9);
        let lighting = ambient + diffuse * 1.0;
        return vec4(color * lighting, 1.0);
      }

      fn hsvToRgb(h: f32, s: f32, v: f32) -> vec3<f32> {
        let c = v * s;
        let x = c * (1.0 - abs(fract(h * 6.0) * 2.0 - 1.0));
        let m = v - c;
        var rgb: vec3<f32>;
        let hi = u32(h * 6.0) % 6u;
        if (hi == 0u) { rgb = vec3(c, x, 0.0); }
        else if (hi == 1u) { rgb = vec3(x, c, 0.0); }
        else if (hi == 2u) { rgb = vec3(0.0, c, x); }
        else if (hi == 3u) { rgb = vec3(0.0, x, c); }
        else if (hi == 4u) { rgb = vec3(x, 0.0, c); }
        else { rgb = vec3(c, 0.0, x); }
        return rgb + vec3(m);
      }
    `;

    const shaderModule = device.createShaderModule({ code: shaderCode });
    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
        { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
        { binding: 2, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
      ],
    });

    this.pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: 24, // vec3 pos + vec3 normal
          attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32x3' },
          ],
        }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format: this.format }],
      },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
    });

    this.bindGroup = null;
  }

  updateBindGroup(positionBuffer, quaternionBuffer) {
    this.bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: positionBuffer } },
        { binding: 2, resource: { buffer: quaternionBuffer } },
      ],
    });
  }

  render(bodyCount, { viewProj, scale = [1, 1, 1], drawExtras } = {}) {
    if (!this.bindGroup) return;
    const aspect = this.canvas.width / this.canvas.height;
    const vp = viewProj || this.createViewProjMatrix(aspect);
    
    // Upload uniform buffer
    const data = new Float32Array(20); // 16 for matrix + 3 for scale + 1 pad
    data.set(vp, 0);
    data.set(scale, 16);
    this.device.queue.writeBuffer(this.uniformBuffer, 0, data);

    const depthTexture = this.device.createTexture({
      size: [this.canvas.width, this.canvas.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const commandEncoder = this.device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: this.context.getCurrentTexture().createView(),
        clearValue: { r: 0.07, g: 0.07, b: 0.1, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    });

    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, this.bindGroup);
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.setIndexBuffer(this.indexBuffer, 'uint16');
    renderPass.drawIndexed(this.indexCount, bodyCount);

    if (drawExtras) {
      drawExtras(renderPass);
    }
    renderPass.end();
    this.device.queue.submit([commandEncoder.finish()]);
    depthTexture.destroy();
  }

  // ---- math helpers for camera ----
  createViewProjMatrix(aspect) {
    const fov = Math.PI / 4;
    const near = 0.1;
    const far = 100;
    const f = 1 / Math.tan(fov / 2);
    const proj = new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, far / (near - far), -1,
      0, 0, far * near / (near - far), 0,
    ]);
    const eye = [0, 6, 16];
    const target = [0, 0.5, 0];
    const up = [0, 1, 0];
    const view = this.lookAt(eye, target, up);
    return this.multiplyMat4ColumnMajor(proj, view);
  }

  lookAt(eye, target, up) {
    const z = this.normalize([
      eye[0] - target[0],
      eye[1] - target[1],
      eye[2] - target[2],
    ]);
    const x = this.normalize(this.cross(up, z));
    const y = this.cross(z, x);
    return new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -this.dot(x, eye), -this.dot(y, eye), -this.dot(z, eye), 1,
    ]);
  }

  normalize(v) {
    const len = Math.hypot(v[0], v[1], v[2]);
    return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
  }
  cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }
  dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  multiplyMat4ColumnMajor(a, b) {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i + j * 4] =
          a[0 + j * 4] * b[i + 0 * 4] +
          a[1 + j * 4] * b[i + 1 * 4] +
          a[2 + j * 4] * b[i + 2 * 4] +
          a[3 + j * 4] * b[i + 3 * 4];
      }
    }
    return out;
  }

  createBoxGeometry() {
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
      // front
      0, 1, 2, 0, 2, 3,
      // back
      4, 5, 6, 4, 6, 7,
      // top
      8, 9, 10, 8, 10, 11,
      // bottom
      12, 13, 14, 12, 14, 15,
      // right
      16, 17, 18, 16, 18, 19,
      // left
      20, 21, 22, 20, 22, 23,
    ]);

    return { vertices, indices };
  }
}

export { BoxRenderer };
