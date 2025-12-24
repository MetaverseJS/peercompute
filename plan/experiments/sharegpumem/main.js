// main.js
const worker = new Worker('worker.js', { type: 'module' });

worker.onmessage = (event) => {
    if (event.data.type === 'RESULT') {
        const results = new Float32Array(event.data.data);
        console.log('Main Thread: Received final result from worker:', results);
    }
};

async function run() {
    if (!navigator.gpu) {
        console.error("WebGPU not supported on main thread.");
        return;
    }
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    console.log("Main Thread: GPU device ready.");

    // Input data for [1.0, 2.0, 3.0, 4.0]
    const inputData = new Float32Array([1.0, 2.0, 3.0, 4.0]);
    console.log('Main Thread: Sending initial data to worker.');
    
    // Transfer ownership of the ArrayBuffer to the worker
    worker.postMessage({
        type: 'START_COMPUTE',
        dataBuffer: inputData.buffer
    }, [inputData.buffer]); 
}

run();
