// worker.js

// A simple pass-through compute shader (for demonstration of usage)
const computeShaderCode = `
@group(0) @binding(0) var<storage, read_write> data: array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    // A placeholder operation: just read and write the same data back.
    // data[id.x] = data[id.x] * 2.0; 
    // Since we don't have a multiplier here, the result will just be the input data read back correctly.
}
`;


self.onmessage = async (event) => {
    if (event.data.type === 'START_COMPUTE') {
        const inputBuffer = event.data.dataBuffer;
        const bufferSize = inputBuffer.byteLength;
        console.log('Worker: Received data buffer. Size:', bufferSize, 'bytes');
        
        // --- WebGPU Initialization in the Worker ---
        if (!navigator.gpu) {
            self.postMessage({ type: 'ERROR', data: 'WebGPU not supported in worker.' });
            return;
        }
        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter.requestDevice();
        console.log("Worker: GPU device ready in worker.");

        // --- FIXED: Create the primary GPU buffer without MAP_READ ---
        const gpuBuffer = device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
        });
        
        // Write the received CPU data into the GPU buffer using the queue
        device.queue.writeBuffer(gpuBuffer, 0, inputBuffer);
        console.log("Worker: Wrote data to gpuBuffer.");


        // --- Create a separate staging buffer for reading back to CPU ---
        const stagingBuffer = device.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        });
        
        // Setup a dummy pipeline to show commands run without errors
        const commandEncoder = device.createCommandEncoder();
        
        // 1. (Optional) Run compute if we had a real shader
        // const computePipeline = device.createComputePipeline({ ... }); 
        // const passEncoder = commandEncoder.beginComputePass();
        // passEncoder.setPipeline(computePipeline);
        // passEncoder.dispatchWorkgroups(1);
        // passEncoder.end();

        // 2. Copy the (unchanged) data from gpuBuffer to the stagingBuffer
        commandEncoder.copyBufferToBuffer(gpuBuffer, 0, stagingBuffer, 0, bufferSize);
        device.queue.submit([commandEncoder.finish()]);
        console.log("Worker: Submitted copy commands successfully (no validation errors!).");


        // --- Read the result back to a CPU-accessible staging buffer ---
        await stagingBuffer.mapAsync(GPUMapMode.READ);
        const resultData = stagingBuffer.getMappedRange();
        
        // Copy the result to a *new* ArrayBuffer to send back to the main thread
        const finalResult = new Float32Array(resultData).slice();
        
        // Cleanup
        stagingBuffer.unmap();
        gpuBuffer.destroy();
        stagingBuffer.destroy();

        // Send the result ArrayBuffer back to the main thread
        self.postMessage({
            type: 'RESULT',
            data: finalResult.buffer 
        }, [finalResult.buffer]);
    }
};
