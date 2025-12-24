class GridRenderer {
  constructor(device, format, opts = {}) {
    this.device = device;
    this.format = format || navigator.gpu.getPreferredCanvasFormat();

    const size = opts.size || 40;
    const y = opts.height || 0;
    const vertices = new Float32Array([
      -size, y, -size,
       size, y, -size,
       size, y,  size,
      -size, y,  size,
    ]);
    // Fix winding order to face up (CCW)
    const indices = new Uint16Array([0, 2, 1, 0, 3, 2]);

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
      size: 64 + 16, // viewProj (64) + params (16)
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const shader = `
      struct Uniforms {
        viewProj: mat4x4<f32>,
        planeHeight: f32,
        gridSize: f32,
        lineWidth: f32,
        pad: f32,
      };
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;

      struct VSOut {
        @builtin(position) position: vec4<f32>,
        @location(0) worldPos: vec3<f32>,
      };

      @vertex
      fn vs_main(@location(0) pos: vec3<f32>) -> VSOut {
        var out: VSOut;
        out.worldPos = pos;
        out.position = uniforms.viewProj * vec4(pos, 1.0);
        return out;
      }

      fn gridMask(p: vec3<f32>, grid: f32, width: f32) -> f32 {
        let gx = abs(fract(p.x / grid) - 0.5) * grid;
        let gz = abs(fract(p.z / grid) - 0.5) * grid;
        let d = min(gx, gz);
        return smoothstep(width, width * 0.2, d);
      }

      @fragment
      fn fs_main(in: VSOut) -> @location(0) vec4<f32> {
        let line = 1.0 - gridMask(in.worldPos, uniforms.gridSize, uniforms.lineWidth);
        let base = vec3(0.08, 0.09, 0.1);
        let color = mix(base, vec3(0.35, 0.4, 0.45), line);
        return vec4(color, 1.0);
      }
    `;

    const module = device.createShaderModule({ code: shader });
    const bgl = device.createBindGroupLayout({
      entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } }],
    });
    this.pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [bgl] }),
      vertex: {
        module,
        entryPoint: 'vs_main',
        buffers: [{
          arrayStride: 12,
          attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
        }],
      },
      fragment: {
        module,
        entryPoint: 'fs_main',
        targets: [{ format: this.format }],
      },
      primitive: { topology: 'triangle-list', cullMode: 'back' },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: false,
        depthCompare: 'less-equal',
      },
    });

    this.bindGroup = device.createBindGroup({
      layout: bgl,
      entries: [{ binding: 0, resource: { buffer: this.uniformBuffer } }],
    });
  }

  update(viewProj, { gridSize = 1, lineWidth = 0.04, height = 0 } = {}) {
    const data = new Float32Array(20);
    data.set(viewProj, 0);
    data[16] = height;
    data[17] = gridSize;
    data[18] = lineWidth;
    data[19] = 0;
    this.device.queue.writeBuffer(this.uniformBuffer, 0, data);
  }

  record(passEncoder) {
    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, this.bindGroup);
    passEncoder.setVertexBuffer(0, this.vertexBuffer);
    passEncoder.setIndexBuffer(this.indexBuffer, 'uint16');
    passEncoder.drawIndexed(this.indexCount, 1);
  }
}

export { GridRenderer };
