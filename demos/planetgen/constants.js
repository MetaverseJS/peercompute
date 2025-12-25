/**
 * Shared constants for worldgen
 * Consolidated from index.js, UIManager.js, PlanetManager.js
 */

// Planet scaling constants
export const BASE_RADIUS_UNITS = 10;
export const DEFAULT_DIAMETER_KM = 1000;
export const DEFAULT_RADIUS_M = (DEFAULT_DIAMETER_KM * 1000) * 0.5; // 500,000 meters

// Player constants
export const PERSON_HEIGHT_M = 2;

// Atmosphere defaults
export const DEFAULT_ATMOSPHERE_ALPHA = 1.0;
export const DEFAULT_ATMOSPHERE_DENSITY = 6.0;
export const DEFAULT_ATMOSPHERE_COLOR = '#4da8ff';

// Cloud defaults
export const DEFAULT_CLOUD_ALPHA = 0.74;
export const DEFAULT_CLOUD_SPEED = 0.9;
export const DEFAULT_CLOUD_QUANTITY = 0.76;
export const DEFAULT_CLOUD_HEIGHT = -2.4;
export const DEFAULT_CLOUD_COLOR = '#ffffff';
export const DEFAULT_CLOUD_RESOLUTION = 256;

// Physics defaults
export const DEFAULT_WALK_SPEED = 3.5;
export const DEFAULT_RUN_SPEED = 6.5;
export const DEFAULT_FLY_SPEED = 8.0;
export const DEFAULT_SWIM_SPEED = 2.5;
export const DEFAULT_JUMP_FORCE = 6.0;
export const DEFAULT_GRAVITY = 30.0;
export const DEFAULT_PLAYER_HEIGHT = 0.04;

// Generation defaults
export const DEFAULT_RESOLUTION = 384;
export const DEFAULT_NUM_PLATES = 9;
export const DEFAULT_JITTER = 0.6;
export const DEFAULT_ITERATIONS = 80000;
export const DEFAULT_EROSION_RATE = 0.36;
export const DEFAULT_EVAPORATION = 0.5;
export const DEFAULT_HEIGHT_SCALE = 18.2;
export const DEFAULT_SEA_LEVEL = 0.53;
export const DEFAULT_SMOOTH_PASSES = 20;
export const DEFAULT_SUBDIVISIONS = 16;
export const DEFAULT_ICE_CAP = 0.15;
export const DEFAULT_PLATE_DELTA = 1.25;
export const DEFAULT_PLATE_SIZE_VARIANCE = 0.35;

// Weather defaults
export const DEFAULT_WEATHER_SPEED_MINUTES_PER_SEC = 1;
export const DEFAULT_WEATHER_UPDATE_HZ = 6;
export const DEFAULT_WEATHER_MOISTURE_LAYERS = 2;
export const DEFAULT_WEATHER_EVAP_STRENGTH = 1.0;
export const DEFAULT_WEATHER_PRECIP_STRENGTH = 1.0;
export const DEFAULT_WEATHER_WIND_STRENGTH = 1.0;
export const DEFAULT_WEATHER_WETNESS_STRENGTH = 0.75;
export const DEFAULT_WEATHER_OCEAN_INERTIA = 0.25;
export const DEFAULT_WEATHER_RAIN_HAZE = 0.9;
export const DEFAULT_ATMO_THICKNESS_KM = 20;

// Axial tilt and seasons
export const DEFAULT_AXIAL_TILT_DEG = 23.4;
export const DEFAULT_SEASON_PHASE = 0;

// Render constants
export const MAX_DELTA_TIME = 0.25; // Cap delta time to avoid huge jumps after tab inactivity

// Presets
export const PRESETS = {
    fast: {
        resolution: 384,
        numPlates: 9,
        jitter: 0.6,
        iterations: 80000,
        erosionRate: 0.36,
        evaporation: 0.5,
        radius: BASE_RADIUS_UNITS,
        heightScale: 18.2,
        seaLevel: 0.53,
        smoothPasses: 20,
        subdivisions: 16,
        iceCap: 0.15,
        plateDelta: 1.25,
        plateSizeVariance: 0.35,
        desymmetrizeTiling: true,
        atmosphere: 0.35,
        atmosphereHeight: 0.5,
        atmosphereAlpha: 1.0,
        atmosphereColor: '#4da8ff',
        faultType: 'ridge',
        atmosphereEnabled: true,
        cloudEnabled: false,
        cloudAlpha: DEFAULT_CLOUD_ALPHA,
        cloudSpeed: DEFAULT_CLOUD_SPEED,
        cloudQuantity: DEFAULT_CLOUD_QUANTITY,
        cloudHeight: DEFAULT_CLOUD_HEIGHT,
        cloudColor: DEFAULT_CLOUD_COLOR,
        cloudResolution: DEFAULT_CLOUD_RESOLUTION,
        cloudShader: 'billow',
        waterCycleEnabled: true,
        waterCycleCloudEnabled: true,
        waterCycleRun: true,
        weatherAutoScale: false,
        weatherSimMode: '3d',
        weatherVolumeRes: 8,
        weatherRayStepsMin: 4,
        weatherRayStepsMax: 6,
        weatherRayBundle: 8,
        weatherAtmoThickness: 60,
        axialTilt: DEFAULT_AXIAL_TILT_DEG,
        seasonProgress: DEFAULT_SEASON_PHASE,
        weatherDebug: 'off',
        weatherSpeed: DEFAULT_WEATHER_SPEED_MINUTES_PER_SEC,
        weatherUpdateHz: 1,
        weatherMoistureLayers: DEFAULT_WEATHER_MOISTURE_LAYERS,
        weatherEvap: DEFAULT_WEATHER_EVAP_STRENGTH,
        weatherPrecip: DEFAULT_WEATHER_PRECIP_STRENGTH,
        weatherWind: DEFAULT_WEATHER_WIND_STRENGTH,
        weatherWetness: DEFAULT_WEATHER_WETNESS_STRENGTH,
        weatherOceanInertia: DEFAULT_WEATHER_OCEAN_INERTIA,
        weatherRainFxEnabled: true,
        weatherRainFx: 1,
        weatherRainHaze: DEFAULT_WEATHER_RAIN_HAZE
    },
    balanced: {
        resolution: 384,
        numPlates: 9,
        jitter: 0.6,
        iterations: 80000,
        erosionRate: 0.36,
        evaporation: 0.5,
        radius: BASE_RADIUS_UNITS,
        heightScale: 18.2,
        seaLevel: 0.53,
        smoothPasses: 20,
        subdivisions: 128,
        iceCap: 0.12,
        plateDelta: 1.25,
        plateSizeVariance: 0.35,
        desymmetrizeTiling: true,
        atmosphere: 0.35,
        atmosphereHeight: 0.5,
        atmosphereAlpha: 1.0,
        atmosphereColor: '#4da8ff',
        faultType: 'mixed',
        weatherAutoScale: true
    },
    high: {
        resolution: 384,
        numPlates: 9,
        jitter: 0.6,
        iterations: 80000,
        erosionRate: 0.36,
        evaporation: 0.5,
        radius: BASE_RADIUS_UNITS,
        heightScale: 18.2,
        seaLevel: 0.53,
        smoothPasses: 20,
        subdivisions: 128,
        iceCap: 0.15,
        plateDelta: 1.25,
        plateSizeVariance: 0.45,
        desymmetrizeTiling: true,
        atmosphere: 0.35,
        atmosphereHeight: 0.5,
        atmosphereAlpha: 1.0,
        atmosphereColor: '#4da8ff',
        faultType: 'ridge',
        weatherAutoScale: true
    }
};
