llm instructions for this file: this file contains the high level project plan. what we're building, tasks completed, tasks remaining, and roadmap. 

* add section for plate tectonic options
    expose more config options. 
    num plates
    plate activity
    volcanic activity
    alternate algorithm (other than voroni)

* add rocky areas. 

* add realistic weather (v0 implemented; iterate)
    * convection based on ocean and sun
    * high / low pressure systems
    * realistic wind
    * realistic moisture depositing resulting in dryer and wetter areas
    * v1: two-layer humidity + snow/rain phase + debug view + pause/step (implemented)
    * v1.1: aux weather map (temp/snow/wind) + snowpack accumulation/melt + temp/snow/wind debug overlays (implemented)
    * v1.2: visual rain FX + rain haze + wind-advected cloud detail (implemented)
    * v1.3: configurable moisture layers (1–4) (implemented)
    * v2: true 3D voxel atmosphere + volume-atlas clouds (in progress)
    * v2.x: raymarch budget bounds + ray bundling controls for volumetric cloud performance tuning (implemented)
    * v2+: seasons/moon: physical sun/moon with axial tilt/orbit for seasons + moon phases; couple precip to surface moisture/biomes/erosion/rivers/lakes; physical snow accumulation and glaciers

* solar system section:
    * material distribution
    * age of system
    * add star type/distance  binary/trinary
    * add moon section
    * add material composition section

* planet type
    * rocky/metal
    * gas giant
    * earthlike
    * iceworld
    * comet
    * asteroid belt
    * kupier belt
    * nebulae

* known regressions / blockers
    
