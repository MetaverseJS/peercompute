export class ShapeRenderer {
  constructor(device, geometry, format) {
    this.device = device;
    this.format = format || navigator.gpu.getPreferredCanvasFormat();

    this.vertexBuffer = device.createBuffer({
      size: geometry.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, geometry.vertices);

    this.indexBuffer = device.createBuffer({
      size: geometry.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, geometry.indices);
    this.indexCount = geometry.indices.length;

    this.uniformBuffer = device.createBuffer({
      size: 80, // mat4x4<f32> (64) + vec3<f32> (12) + pad (4)
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
        
        // Apply scale then rotate then translate
        let scaledPos = localPos * uniforms.scale;
        let worldPos = bodyPos + quatRotate(bodyQuat, scaledPos);
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

  // NOTE: This render method does NOT create a pass. It records into an existing pass.
  // This is better for composition.
  record(pass, instanceCount, firstInstance = 0, { viewProj, scale = [1, 1, 1] } = {}) {
    if (!this.bindGroup) return;
    
    // We update the uniform buffer every draw. This is inefficient if we draw multiple batches with same uniforms,
    // but efficient if we change uniforms per batch.
    // However, we can't writeBuffer inside a render pass!
    // So we must update uniforms BEFORE pass starts.
    // This design is tricky for single pass with multiple shapes if they need different uniforms.
    // Solution: The caller should manage uniforms or we assume one draw per frame per renderer.
    // OR we use dynamic offsets.
    // For simplicity, let's assume we call updateUniforms() before the pass.
    
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, 'uint16');
    pass.drawIndexed(this.indexCount, instanceCount, 0, 0, firstInstance);
  }

  updateUniforms(viewProj, scale = [1, 1, 1]) {
    const data = new Float32Array(20);
    data.set(viewProj, 0);
    data.set(scale, 16);
    this.device.queue.writeBuffer(this.uniformBuffer, 0, data);
  }
}
