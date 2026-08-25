# RoadVector Data And Software Notices

- Three.js is distributed under the MIT license in `three-LICENSE.txt`.
- CesiumJS is distributed under the Apache License 2.0. The production build
  includes its exact `cesium/LICENSE.md` and `cesium/ThirdParty.json` notices.
- Road and building data is © OpenStreetMap contributors and is used under the
  Open Database License 1.0: https://www.openstreetmap.org/copyright
- Terrain relief is sourced from NOAA/NCEI ETOPO 2022. It is display/game data
  and is not for navigation.
- Nationwide overview roads are the Federal Highway Administration National
  Highway System snapshot published by the U.S. DOT Bureau of Transportation
  Statistics. The derived display tiles retain only the NHS class and are
  generalized; they are not navigation geometry. The original upstream
  metadata is redistributed unmodified at
  `../data/fhwa-nhs/2025.08.08/source-metadata.xml`, with the exact derivation
  and source hashes in that directory's `manifest.json`.
- Simulated street traffic is application-generated, synthetic, and is not a
  live traffic feed.
- “Akira Bike” by Ryanwill679, distributed through Sketchfab under
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). RoadVector's
  derivative converts the source to glTF, simplifies its mesh, compresses and
  limits textures, and calibrates scale/orientation for the physics chassis.
  The model is presentation-only; it supplies no collision or dynamics
  authority. See `../models/akira-bike/ATTRIBUTION.md` and `LICENSE.txt` for
  the retained attribution, source link, license text, hashes, and change
  notice. Third-party fictional designs, names, and marks remain the property
  of their respective owners; no affiliation or endorsement is claimed.
