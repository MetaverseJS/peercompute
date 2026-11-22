// Called from a ULG host with its own v0.5 createSimulationArtifact export.
// Keep the solver resident across successive capsules on the host's GPU lease.
export async function runNBodyCapsule(capsule, { simulation, createSimulationArtifact }) {
  if (capsule?.serviceId !== 'ulg-runtime' || capsule.taskKind !== 'simulation.step') {
    throw new TypeError('Expected a ULG simulation.step capsule for ulg-runtime.');
  }
  if (!capsule.taskId || !capsule.inputHash || !capsule.methodHash || !capsule.provenance ||
      typeof createSimulationArtifact !== 'function') {
    throw new TypeError('The ULG capsule needs identity, provenance and the v0.5 artifact factory.');
  }
  if (capsule.validation?.mode && !['none', 'self'].includes(capsule.validation.mode)) {
    throw new RangeError('This adapter supports self or none validation.');
  }
  const { stepIndex, parameters } = capsule.input ?? {};
  if (!Number.isSafeInteger(stepIndex) || stepIndex < 0 || stepIndex !== simulation.stepIndex) {
    throw new RangeError('The requested step does not match the resident simulation state.');
  }
  if (!parameters || typeof parameters !== 'object') {
    throw new TypeError('Expected capsule.input.parameters for the Eshkol gravity step.');
  }

  const bodies = await simulation.step(parameters);
  const toStep = stepIndex + 1;
  const finite = bodies.every(Number.isFinite);
  if (!finite) throw new Error('The simulation produced a non-finite body state.');
  return createSimulationArtifact({
    artifactId: capsule.taskId + ':nbody:' + toStep,
    closureRef: { module: 'physics/nbody.esk', entryPoint: 'step-world', kernelEntryPoint: 'main' },
    representation: 'nbody-interleaved-f32',
    outputs: {
      deltas: [{ operation: 'replace', tensorId: 'bodies', fromStep: stepIndex, toStep }],
      finalState: {
        tensorId: 'bodies', dtype: 'f32', layout: 'interleaved', shape: [simulation.count, 8],
        stepIndex: toStep, values: Array.from(bodies)
      }
    },
    execution: { backend: 'webgpu', stage: 'eshkol.nbody.step', placement: 'local', gravityMode: simulation.gravityMode },
    validity: { finite, bodyCount: simulation.activeCount, slotCount: simulation.count },
    validation: { status: 'pass', validationMode: 'finite-output', scientificValidation: false, fullPhysicsValidation: false },
    provenance: {
      ...capsule.provenance,
      sourceService: 'ulg-runtime', methodHash: capsule.methodHash, inputHash: capsule.inputHash
    }
  });
}
