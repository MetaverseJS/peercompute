export function createStepTelemetry() {
  return {
    step: 0,
    simulationTime: 0,
    bodyCount: 0,
    particleCount: 0,
    jointCount: 0,
    surfaceCount: 0,
    contactCount: 0,
    particleContactCount: 0,
    surfaceContactCount: 0,
    solverIterations: 0,
    surfaceQueries: 0,
    maximumPenetration: 0,
    maximumLinearSpeed: 0,
    maximumAngularSpeed: 0,
    kineticEnergy: 0,
    sleepingBodies: 0,
    accumulator: 0,
    interpolationAlpha: 0,
    frameSubsteps: 0,
    droppedFrameTime: 0,
    overflows: {
      gridCells: 0,
      gridReferences: 0,
      candidatePairs: 0,
      contacts: 0,
      surfaceQueries: 0,
      overflowed: false,
    },
  };
}

export function cloneTelemetry(telemetry) {
  return {
    ...telemetry,
    overflows: { ...telemetry.overflows },
  };
}
