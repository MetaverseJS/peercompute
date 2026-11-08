# Particle motorcycle physics

`createMotorcyclePhysics()` assembles six independently simulated particle-cloud
rigid components: chassis/rider cage, rear swingarm, rear wheel, upper
fork/handlebars, lower telescoping fork, and front wheel. Hinge, steering,
prismatic, spring/damper and axle constraints connect them.

The controller accepts only the shared normalized `ControlFrame`. Engine,
drivetrain, brakes, steering and optional bounded lean assist apply torques or
constraint impulses; none overwrite a dynamic pose. Tire contacts measure
longitudinal/lateral slip and solve a combined friction ellipse. Telemetry
publishes wheel loads, slips, impulses, powertrain state, speed and lean state.
