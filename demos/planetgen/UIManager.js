import { clamp } from './utils.js';
import { BASE_RADIUS_UNITS, DEFAULT_DIAMETER_KM, PRESETS } from './constants.js';

export class UIManager {
    constructor(callbacks) {
        this.callbacks = callbacks || {};
        
        // References to DOM elements
        this.els = {
            hud: document.getElementById('hud'),
            hudToggle: document.getElementById('hudToggle'),
            hudContent: document.getElementById('hudContent'),
            status: document.getElementById('status'),
            preset: document.getElementById('preset'),
            regenBtn: document.getElementById('regen'),
            // Sliders
            resolution: document.getElementById('resolution'),
            plates: document.getElementById('plates'),
            plateSizeVariance: document.getElementById('plateSizeVariance'),
            jitter: document.getElementById('jitter'),
            heightScale: document.getElementById('heightScale'),
            iterations: document.getElementById('iterations'),
            erosionRate: document.getElementById('erosionRate'),
            evaporation: document.getElementById('evaporation'),
            seaLevel: document.getElementById('seaLevel'),
            smoothPasses: document.getElementById('smoothPasses'),
            subdivisions: document.getElementById('subdivisions'),
            iceCap: document.getElementById('iceCap'),
            plateDelta: document.getElementById('plateDelta'),
            faultType: document.getElementById('faultType'),
            desymmetrizeTiling: document.getElementById('desymmetrizeTiling'),
            atmosphere: document.getElementById('atmosphere'),
            waterShader: document.getElementById('waterShader'),
            waterShader: document.getElementById('waterShader'),
            // Labels
            jitterValue: document.getElementById('jitterValue'),
            heightScaleValue: document.getElementById('heightScaleValue'),
            erosionRateValue: document.getElementById('erosionRateValue'),
            evaporationValue: document.getElementById('evaporationValue'),
            seaLevelValue: document.getElementById('seaLevelValue'),
            smoothPassesValue: document.getElementById('smoothPassesValue'),
            subdivisionsValue: document.getElementById('subdivisionsValue'),
            iceCapValue: document.getElementById('iceCapValue'),
            plateDeltaValue: document.getElementById('plateDeltaValue'),
            plateSizeVarianceValue: document.getElementById('plateSizeVarianceValue'),
            atmosphereValue: document.getElementById('atmosphereValue'),
            atmosphereHeight: document.getElementById('atmosphereHeight'),
            atmosphereHeightValue: document.getElementById('atmosphereHeightValue'),
            atmosphereToggle: document.getElementById('atmosphereToggle'),
            atmosphereAlpha: document.getElementById('atmosphereAlpha'),
            atmosphereAlphaValue: document.getElementById('atmosphereAlphaValue'),
            atmosphereColor: document.getElementById('atmosphereColor'),
            // Clouds
            cloudToggle: document.getElementById('cloudToggle'),
            cloudAlpha: document.getElementById('cloudAlpha'),
            cloudAlphaValue: document.getElementById('cloudAlphaValue'),
            cloudSpeed: document.getElementById('cloudSpeed'),
            cloudSpeedValue: document.getElementById('cloudSpeedValue'),
            cloudQuantity: document.getElementById('cloudQuantity'),
            cloudQuantityValue: document.getElementById('cloudQuantityValue'),
            cloudHeight: document.getElementById('cloudHeight'),
            cloudHeightValue: document.getElementById('cloudHeightValue'),
            cloudColor: document.getElementById('cloudColor'),
            cloudResolution: document.getElementById('cloudResolution'),
            cloudResolutionValue: document.getElementById('cloudResolutionValue'),
            cloudShader: document.getElementById('cloudShader'),
            cloudLayers: document.getElementById('cloudLayers'),
            addCloudLayerBtn: document.getElementById('addCloudLayer'),
            // Mobile
            movePad: document.getElementById('movePad'),
            lookPad: document.getElementById('lookPad'),
            mobileControls: document.getElementById('mobileControls'),
            surfaceOnlyBtn: document.getElementById('surfaceOnly'),
            // Config
            configToggle: document.getElementById('configToggle'),
            configPanel: document.getElementById('configPanel'),
            vrToggle: document.getElementById('vrToggle'),
            reticle: document.getElementById('reticle'),
            leftStickSensitivity: document.getElementById('leftStickSensitivity'),
            leftStickSensitivityValue: document.getElementById('leftStickSensitivityValue'),
            lookSensitivityX: document.getElementById('lookSensitivityX'),
            lookSensitivityXValue: document.getElementById('lookSensitivityXValue'),
            lookSensitivityY: document.getElementById('lookSensitivityY'),
            lookSensitivityYValue: document.getElementById('lookSensitivityYValue'),
            invertLook: document.getElementById('invertLook'),
            planetDiameter: document.getElementById('planetDiameter'),
            planetDiameterValue: document.getElementById('planetDiameterValue')
        };

        // State
        this.cloudLayerSettings = [];

        this.setStatus = this.setStatus.bind(this);
        this.bindEvents();
        this.updateRangeLabels();
        this.renderCloudLayerControls();
    }

    getPlanetDiameterKm() {
        const value = parseFloat(this.els.planetDiameter?.value);
        return clamp(Number.isFinite(value) ? value : DEFAULT_DIAMETER_KM, 1, 1000);
    }

    applyPreset(key) {
        const preset = PRESETS[key] || PRESETS.balanced;
        if (this.els.preset) this.els.preset.value = key;
        if (this.els.atmosphereToggle && preset.atmosphereEnabled !== undefined) {
            this.els.atmosphereToggle.checked = !!preset.atmosphereEnabled;
        }
        if (this.els.cloudToggle) {
            const enabled = preset.cloudEnabled !== undefined ? !!preset.cloudEnabled : false;
            this.els.cloudToggle.checked = enabled;
        }
        if (this.els.resolution) this.els.resolution.value = preset.resolution;
        if (this.els.plates) this.els.plates.value = preset.numPlates;
        if (this.els.plateSizeVariance) this.els.plateSizeVariance.value = preset.plateSizeVariance ?? 0.35;
        if (this.els.desymmetrizeTiling) this.els.desymmetrizeTiling.checked = preset.desymmetrizeTiling ?? true;
        if (this.els.jitter) this.els.jitter.value = preset.jitter;
        if (this.els.heightScale) this.els.heightScale.value = preset.heightScale;
        if (this.els.iterations) this.els.iterations.value = preset.iterations;
        if (this.els.erosionRate) this.els.erosionRate.value = preset.erosionRate;
        if (this.els.evaporation) this.els.evaporation.value = preset.evaporation;
        if (this.els.seaLevel) this.els.seaLevel.value = preset.seaLevel ?? 0.53;
        if (this.els.atmosphere) this.els.atmosphere.value = preset.atmosphere ?? 0.35;
        if (this.els.atmosphereHeight) this.els.atmosphereHeight.value = preset.atmosphereHeight ?? 0.5;
        if (this.els.atmosphereAlpha) this.els.atmosphereAlpha.value = preset.atmosphereAlpha ?? 1.0;
        if (this.els.atmosphereColor) this.els.atmosphereColor.value = preset.atmosphereColor || '#4da8ff';
        if (this.els.smoothPasses) this.els.smoothPasses.value = preset.smoothPasses ?? 20;
        if (this.els.subdivisions) this.els.subdivisions.value = preset.subdivisions ?? 60;
        if (this.els.iceCap) this.els.iceCap.value = preset.iceCap ?? 0.15;
        if (this.els.plateDelta) this.els.plateDelta.value = preset.plateDelta ?? 1.25;
        if (this.els.faultType) this.els.faultType.value = preset.faultType || 'ridge';
        if (this.els.cloudAlpha && preset.cloudAlpha !== undefined) this.els.cloudAlpha.value = preset.cloudAlpha;
        if (this.els.cloudSpeed && preset.cloudSpeed !== undefined) this.els.cloudSpeed.value = preset.cloudSpeed;
        if (this.els.cloudQuantity && preset.cloudQuantity !== undefined) this.els.cloudQuantity.value = preset.cloudQuantity;
        if (this.els.cloudHeight && preset.cloudHeight !== undefined) this.els.cloudHeight.value = preset.cloudHeight;
        if (this.els.cloudColor && preset.cloudColor !== undefined) this.els.cloudColor.value = preset.cloudColor;
        if (this.els.cloudResolution && preset.cloudResolution !== undefined) this.els.cloudResolution.value = preset.cloudResolution;
        if (this.els.cloudShader && preset.cloudShader !== undefined) this.els.cloudShader.value = preset.cloudShader;
        if (this.els.waterShader) this.els.waterShader.value = preset.waterShader || (key === 'fast' ? 'fast' : 'balanced');
        this.updateRangeLabels();
    }

    readSettings() {
        return {
            resolution: clamp(parseInt(this.els.resolution?.value, 10) || 256, 64, 4096),
            numPlates: clamp(parseInt(this.els.plates?.value, 10) || 7, 1, 30),
            plateSizeVariance: clamp(parseFloat(this.els.plateSizeVariance?.value) || 0, 0, 2),
            desymmetrizeTiling: Boolean(this.els.desymmetrizeTiling?.checked),
            jitter: clamp(parseFloat(this.els.jitter?.value) || 0.5, 0, 1),
            iterations: clamp(parseInt(this.els.iterations?.value, 10) || 50000, 1000, 2000000),
            erosionRate: clamp(parseFloat(this.els.erosionRate?.value) || 0.1, 0.001, 2),
            evaporation: clamp(parseFloat(this.els.evaporation?.value) || 0.02, 0, 2),
            heightScale: clamp(parseFloat(this.els.heightScale?.value) || 2, 0, 80),
            seaLevel: clamp(parseFloat(this.els.seaLevel?.value) || 0.5, 0, 1),
            atmosphere: clamp(parseFloat(this.els.atmosphere?.value) || 0.35, 0.05, 1.5),
            atmosphereHeight: clamp(parseFloat(this.els.atmosphereHeight?.value) || 0.5, 0, 5),
            atmosphereAlpha: clamp(parseFloat(this.els.atmosphereAlpha?.value) || 1.0, 0, 1),
            atmosphereColor: this.els.atmosphereColor?.value || '#4da8ff',
            smoothPasses: Math.round(clamp(parseFloat(this.els.smoothPasses?.value) || 0, 0, 40)),
            subdivisions: Math.round(clamp(parseFloat(this.els.subdivisions?.value) || 128, 0, 512)),
            iceCap: clamp(parseFloat(this.els.iceCap?.value) || 0.1, 0, 1),
            plateDelta: clamp(parseFloat(this.els.plateDelta?.value) || 1.25, 0, 2),
            faultType: this.els.faultType?.value || 'ridge',
            radius: BASE_RADIUS_UNITS,
            waterShader: this.els.waterShader?.value || 'balanced'
        };
    }

    writeSettings(settings) {
        if (!settings) return;
        if (this.els.resolution) this.els.resolution.value = settings.resolution;
        if (this.els.plates) this.els.plates.value = settings.numPlates;
        if (this.els.plateSizeVariance) this.els.plateSizeVariance.value = settings.plateSizeVariance;
        if (this.els.desymmetrizeTiling) this.els.desymmetrizeTiling.checked = !!settings.desymmetrizeTiling;
        if (this.els.jitter) this.els.jitter.value = settings.jitter;
        if (this.els.iterations) this.els.iterations.value = settings.iterations;
        if (this.els.erosionRate) this.els.erosionRate.value = settings.erosionRate;
        if (this.els.evaporation) this.els.evaporation.value = settings.evaporation;
        if (this.els.heightScale) this.els.heightScale.value = settings.heightScale;
        if (this.els.seaLevel) this.els.seaLevel.value = settings.seaLevel;
        if (this.els.atmosphere) this.els.atmosphere.value = settings.atmosphere;
        if (this.els.atmosphereHeight) this.els.atmosphereHeight.value = settings.atmosphereHeight;
        if (this.els.atmosphereAlpha) this.els.atmosphereAlpha.value = settings.atmosphereAlpha;
        if (this.els.atmosphereColor) this.els.atmosphereColor.value = settings.atmosphereColor;
        if (this.els.smoothPasses) this.els.smoothPasses.value = settings.smoothPasses;
        if (this.els.subdivisions) this.els.subdivisions.value = settings.subdivisions;
        if (this.els.iceCap) this.els.iceCap.value = settings.iceCap;
        if (this.els.plateDelta) this.els.plateDelta.value = settings.plateDelta;
        if (this.els.faultType) this.els.faultType.value = settings.faultType;
        if (this.els.waterShader) this.els.waterShader.value = settings.waterShader || 'balanced';
        this.updateRangeLabels();
    }

    bindEvents() {
        // Regen Controls
        const regenControls = [
            this.els.resolution, this.els.plates, this.els.plateSizeVariance, 
            this.els.desymmetrizeTiling, this.els.jitter, this.els.heightScale, 
            this.els.iterations, this.els.erosionRate, this.els.evaporation, 
            this.els.seaLevel, this.els.atmosphere, this.els.smoothPasses, 
            this.els.subdivisions, this.els.iceCap, this.els.plateDelta, 
            this.els.faultType, this.els.waterShader
        ];

        regenControls.forEach(el => {
            if (!el) return;
            const handler = () => {
                this.updateRangeLabels();
                if (this.callbacks.onRegen) this.callbacks.onRegen();
            };
            el.addEventListener('input', handler);
            el.addEventListener('change', handler);
        });

        if (this.els.regenBtn) {
            this.els.regenBtn.addEventListener('click', () => {
                if (this.callbacks.onRegen) this.callbacks.onRegen();
            });
        }
        
        if (this.els.preset) {
            this.els.preset.addEventListener('change', () => {
                if (this.callbacks.onPreset) this.callbacks.onPreset(this.els.preset.value);
            });
        }

        if (this.els.planetDiameter) {
            const handler = () => {
                this.updateRangeLabels();
                if (this.callbacks.onDiameterChange) this.callbacks.onDiameterChange(this.getPlanetDiameterKm());
            };
            this.els.planetDiameter.addEventListener('input', handler);
            this.els.planetDiameter.addEventListener('change', handler);
        }

        // Atmosphere Updates
        const atmosControls = [this.els.atmosphere, this.els.atmosphereAlpha, this.els.atmosphereColor, this.els.atmosphereToggle];
        atmosControls.forEach(el => {
            if (!el) return;
            el.addEventListener(el.type === 'color' ? 'input' : 'change', () => {
                this.updateRangeLabels();
                if (this.callbacks.onAtmosphereUpdate) this.callbacks.onAtmosphereUpdate();
            });
            if (el.type === 'range') el.addEventListener('input', () => {
                this.updateRangeLabels();
                if (this.callbacks.onAtmosphereUpdate) this.callbacks.onAtmosphereUpdate();
            });
        });

        // Cloud Updates
        const cloudControls = [
            this.els.cloudToggle, this.els.cloudAlpha, this.els.cloudSpeed, 
            this.els.cloudQuantity, this.els.cloudHeight, this.els.cloudColor, 
            this.els.cloudResolution, this.els.cloudShader
        ];
        cloudControls.forEach(el => {
            if (!el) return;
            el.addEventListener(el.type === 'color' ? 'input' : 'change', () => {
                this.updateRangeLabels();
                if (this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
            });
            if (el.type === 'range') el.addEventListener('input', () => {
                this.updateRangeLabels();
                if (this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
            });
        });

        if (this.els.addCloudLayerBtn) {
            this.els.addCloudLayerBtn.addEventListener('click', () => {
                const base = this.getBaseCloudSettings();
                const bump = this.cloudLayerSettings.length ? this.cloudLayerSettings[this.cloudLayerSettings.length - 1].height : base.height;
                const newLayer = { ...base, id: `extra-${Date.now()}`, height: bump + 0.3 };
                this.cloudLayerSettings.push(newLayer);
                this.renderCloudLayerControls();
                if (this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
            });
        }

        // Toggles
        if (this.els.hudToggle) {
            this.els.hudToggle.addEventListener('click', () => {
                this.setHudCollapsed(!this.els.hud.classList.contains('collapsed'));
            });
        }
        if (this.els.configToggle) {
            this.els.configToggle.addEventListener('click', () => this.toggleConfigPanel());
        }
        if (this.els.vrToggle) {
            this.els.vrToggle.addEventListener('click', () => {
                if (this.callbacks.onVRToggle) this.callbacks.onVRToggle();
            });
        }

        // Config
        [this.els.leftStickSensitivity, this.els.lookSensitivityX, this.els.lookSensitivityY].forEach(el => {
            if (el) el.addEventListener('input', () => this.updateRangeLabels());
        });
        if (this.els.invertLook) this.els.invertLook.addEventListener('change', () => this.updateRangeLabels());
    }

    setStatus(text) {
        if (this.els?.status) this.els.status.textContent = text;
    }

    setHudCollapsed(collapsed) {
        if (!this.els.hud || !this.els.hudToggle || !this.els.hudContent) return;
        this.els.hud.classList.toggle('collapsed', collapsed);
        this.els.hudToggle.setAttribute('aria-expanded', (!collapsed).toString());
        this.els.hudContent.setAttribute('aria-hidden', collapsed.toString());
        this.els.hudToggle.textContent = collapsed ? 'Show controls' : 'Hide controls';
    }

    toggleConfigPanel(show) {
        if (!this.els.configPanel || !this.els.configToggle) return;
        const next = show ?? this.els.configPanel.style.display !== 'block';
        this.els.configPanel.style.display = next ? 'block' : 'none';
        this.els.configToggle.setAttribute('aria-expanded', next.toString());
        if (this.els.reticle && next) this.els.reticle.style.display = 'none';
    }

    syncMobileVisibility(isMobile, inTinyMode) {
        if (!this.els.mobileControls) return;
        if (!isMobile) {
            this.els.mobileControls.style.display = 'none';
            if (this.els.reticle) this.els.reticle.style.display = 'none';
            return;
        }
        this.els.mobileControls.style.display = 'block';
        if (this.els.movePad) this.els.movePad.style.display = inTinyMode ? 'grid' : 'none';
        if (this.els.lookPad) this.els.lookPad.style.display = inTinyMode ? 'grid' : 'none';
        const actionColumn = this.els.mobileControls.querySelector('.action-column');
        if (actionColumn) actionColumn.style.display = inTinyMode ? 'grid' : 'none';
        if (this.els.surfaceOnlyBtn) this.els.surfaceOnlyBtn.style.display = inTinyMode ? 'none' : 'inline-flex';
        if (this.els.reticle) this.els.reticle.style.display = 'block';
    }

    updateRangeLabels() {
        const els = this.els;
        if(els.jitterValue) els.jitterValue.textContent = Number(els.jitter.value).toFixed(2);
        if(els.heightScaleValue) els.heightScaleValue.textContent = Number(els.heightScale.value).toFixed(2);
        if(els.erosionRateValue) els.erosionRateValue.textContent = Number(els.erosionRate.value).toFixed(2);
        if(els.evaporationValue) els.evaporationValue.textContent = Number(els.evaporation.value).toFixed(3);
        if(els.seaLevelValue) els.seaLevelValue.textContent = Number(els.seaLevel.value).toFixed(2);
        if(els.atmosphereValue) els.atmosphereValue.textContent = Number(els.atmosphere.value).toFixed(2);
        if(els.atmosphereHeightValue) els.atmosphereHeightValue.textContent = Number(els.atmosphereHeight.value).toFixed(2);
        if(els.smoothPassesValue) els.smoothPassesValue.textContent = Number(els.smoothPasses.value).toFixed(0);
        if(els.subdivisionsValue) els.subdivisionsValue.textContent = Number(els.subdivisions.value).toFixed(0);
        if(els.iceCapValue) els.iceCapValue.textContent = Number(els.iceCap.value).toFixed(2);
        if(els.plateDeltaValue) els.plateDeltaValue.textContent = Number(els.plateDelta.value).toFixed(2);
        if(els.plateSizeVarianceValue) els.plateSizeVarianceValue.textContent = Number(els.plateSizeVariance.value).toFixed(2);
        if(els.atmosphereAlphaValue) els.atmosphereAlphaValue.textContent = Number(els.atmosphereAlpha.value).toFixed(2);
        if(els.cloudAlphaValue) els.cloudAlphaValue.textContent = Number(els.cloudAlpha.value).toFixed(2);
        if(els.cloudSpeedValue) els.cloudSpeedValue.textContent = Number(els.cloudSpeed.value).toFixed(2);
        if(els.cloudQuantityValue) els.cloudQuantityValue.textContent = Number(els.cloudQuantity.value).toFixed(2);
        if(els.cloudHeightValue) els.cloudHeightValue.textContent = Number(els.cloudHeight.value).toFixed(2);
        if(els.cloudResolutionValue) els.cloudResolutionValue.textContent = Number(els.cloudResolution.value).toFixed(0);
        if(els.planetDiameter && els.planetDiameterValue) {
            els.planetDiameterValue.textContent = Number(els.planetDiameter.value).toFixed(0);
        }
        if(els.leftStickSensitivity && els.leftStickSensitivityValue) els.leftStickSensitivityValue.textContent = Number(els.leftStickSensitivity.value).toFixed(1);
        if(els.lookSensitivityX && els.lookSensitivityXValue) els.lookSensitivityXValue.textContent = Number(els.lookSensitivityX.value).toFixed(1);
        if(els.lookSensitivityY && els.lookSensitivityYValue) els.lookSensitivityYValue.textContent = Number(els.lookSensitivityY.value).toFixed(1);
    }

    readSettings() {
        const els = this.els;
        return {
            resolution: clamp(parseInt(els.resolution.value, 10) || 256, 64, 4096),
            numPlates: clamp(parseInt(els.plates.value, 10) || 9, 4, 400),
            plateSizeVariance: clamp(parseFloat(els.plateSizeVariance.value) || 0, 0, 2),
            desymmetrizeTiling: Boolean(els.desymmetrizeTiling?.checked),
            jitter: clamp(parseFloat(els.jitter.value) || 0.5, 0, 1),
            iterations: clamp(parseInt(els.iterations.value, 10) || 50000, 1000, 2000000),
            erosionRate: clamp(parseFloat(els.erosionRate.value) || 0.1, 0.001, 2),
            evaporation: clamp(parseFloat(els.evaporation.value) || 0.02, 0, 2),
            heightScale: clamp(parseFloat(els.heightScale.value) || 2, 0, 80),
            seaLevel: clamp(parseFloat(els.seaLevel.value) || 0.5, 0, 1),
            atmosphere: clamp(parseFloat(els.atmosphere.value) || 0.35, 0.05, 1.5),
            atmosphereHeight: clamp(parseFloat(els.atmosphereHeight.value) || 0.5, 0, 5),
            atmosphereAlpha: clamp(parseFloat(els.atmosphereAlpha.value) || 1.0, 0, 1),
            atmosphereColor: els.atmosphereColor.value || '#4da8ff',
            atmosphereEnabled: els.atmosphereToggle.checked,
            smoothPasses: Math.round(clamp(parseFloat(els.smoothPasses.value) || 0, 0, 40)),
            subdivisions: Math.round(clamp(parseFloat(els.subdivisions.value) || 128, 0, 512)),
            iceCap: clamp(parseFloat(els.iceCap.value) || 0.1, 0, 1),
            plateDelta: clamp(parseFloat(els.plateDelta.value) || 1.25, 0, 2),
            faultType: els.faultType.value || 'ridge',
            radius: BASE_RADIUS_UNITS,
            planetDiameterKm: this.getPlanetDiameterKm()
        };
    }

    writeSettings(settings) {
        const els = this.els;
        els.resolution.value = settings.resolution;
        els.plates.value = settings.numPlates;
        els.plateSizeVariance.value = settings.plateSizeVariance;
        if (els.desymmetrizeTiling) els.desymmetrizeTiling.checked = !!settings.desymmetrizeTiling;
        els.jitter.value = settings.jitter;
        els.iterations.value = settings.iterations;
        els.erosionRate.value = settings.erosionRate;
        els.evaporation.value = settings.evaporation;
        els.heightScale.value = settings.heightScale;
        els.seaLevel.value = settings.seaLevel;
        els.atmosphere.value = settings.atmosphere;
        els.atmosphereHeight.value = settings.atmosphereHeight;
        els.atmosphereAlpha.value = settings.atmosphereAlpha;
        els.atmosphereColor.value = settings.atmosphereColor;
        els.smoothPasses.value = settings.smoothPasses;
        els.subdivisions.value = settings.subdivisions;
        els.iceCap.value = settings.iceCap;
        els.plateDelta.value = settings.plateDelta;
        els.faultType.value = settings.faultType;
        this.updateRangeLabels();
    }

    getPlanetDiameterKm() {
        if (!this.els.planetDiameter) return DEFAULT_DIAMETER_KM;
        const value = parseFloat(this.els.planetDiameter.value);
        return clamp(Number.isFinite(value) ? value : DEFAULT_DIAMETER_KM, 1, 1000);
    }

    getBaseCloudSettings() {
        return {
            id: 'base',
            enabled: this.els.cloudToggle.checked,
            alpha: clamp(parseFloat(this.els.cloudAlpha.value) || 0.74, 0, 1),
            speed: clamp(parseFloat(this.els.cloudSpeed.value) || 0.9, 0, 2),
            quantity: clamp(parseFloat(this.els.cloudQuantity.value) || 0.76, 0, 1),
            height: clamp(parseFloat(this.els.cloudHeight.value) || -2.4, -5, 5),
            color: this.els.cloudColor.value || '#ffffff',
            resolution: Math.max(1, Math.floor(parseFloat(this.els.cloudResolution.value) || 256)),
            mode: this.els.cloudShader.value || 'billow'
        };
    }

    createCloudLayerControls(layer) {
        const wrapper = document.createElement('div');
        wrapper.className = 'layer';
        wrapper.style.border = '1px solid var(--border)';
        wrapper.style.padding = '8px';
        wrapper.style.marginBottom = '8px';
        const tooltips = {
            alpha: 'Opacity of this cloud layer.',
            speed: 'Animation speed for this cloud layer.',
            quantity: 'Coverage and density for this cloud layer.',
            height: 'Altitude offset for this cloud layer.',
            resolution: 'Texture resolution for this cloud layer.'
        };
        const idLabel = document.createElement('div');
        idLabel.textContent = `Layer ${layer.label || this.cloudLayerSettings.length + 1}`;
        idLabel.style.fontSize = '12px';
        idLabel.style.color = 'var(--muted)';
        wrapper.appendChild(idLabel);
    
        const makeRange = (label, key, min, max, step) => {
            const field = document.createElement('div');
            field.className = 'field';
            const l = document.createElement('label');
            l.textContent = label;
            if (tooltips[key]) l.title = tooltips[key];
            const row = document.createElement('div');
            row.className = 'range-row';
            const input = document.createElement('input');
            input.type = 'range';
            input.min = min;
            input.max = max;
            input.step = step;
            input.value = layer[key];
            if (tooltips[key]) input.title = tooltips[key];
            const span = document.createElement('span');
            span.className = 'value';
            span.textContent = Number(layer[key]).toFixed(step < 1 ? 2 : 0);
            row.appendChild(input);
            row.appendChild(span);
            field.appendChild(l);
            field.appendChild(row);
            input.addEventListener('input', () => {
                layer[key] = parseFloat(input.value);
                span.textContent = Number(layer[key]).toFixed(step < 1 ? 2 : 0);
                if(this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
            });
            return field;
        };
    
        const enabled = document.createElement('label');
        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = layer.enabled;
        toggle.title = 'Enable this cloud layer.';
        toggle.addEventListener('change', () => {
            layer.enabled = toggle.checked;
            if(this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
        });
        enabled.appendChild(toggle);
        enabled.append(' Layer enabled');
        wrapper.appendChild(enabled);
    
        wrapper.appendChild(makeRange('Alpha', 'alpha', 0, 1, 0.01));
        wrapper.appendChild(makeRange('Speed', 'speed', 0, 2, 0.05));
        wrapper.appendChild(makeRange('Quantity', 'quantity', 0, 1, 0.01));
        wrapper.appendChild(makeRange('Height', 'height', -5, 5, 0.05));
        wrapper.appendChild(makeRange('Resolution', 'resolution', 1, 256, 1));
    
        const shaderField = document.createElement('div');
        shaderField.className = 'field';
        const shaderLabel = document.createElement('label');
        shaderLabel.textContent = 'Shader';
        const shaderSelect = document.createElement('select');
        shaderSelect.title = 'Noise type used to generate this layer.';
        ['fbm','billow','cellular'].forEach((m) => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = m.charAt(0).toUpperCase() + m.slice(1);
            if (layer.mode === m) opt.selected = true;
            shaderSelect.appendChild(opt);
        });
        shaderSelect.addEventListener('change', () => {
            layer.mode = shaderSelect.value;
            if(this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
        });
        shaderField.appendChild(shaderLabel);
        shaderField.appendChild(shaderSelect);
        wrapper.appendChild(shaderField);
    
        const colorField = document.createElement('div');
        colorField.className = 'field';
        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Color';
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = layer.color;
        colorInput.title = 'Tint for this cloud layer.';
        colorInput.addEventListener('input', () => {
            layer.color = colorInput.value;
            if(this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
        });
        colorField.appendChild(colorLabel);
        colorField.appendChild(colorInput);
        wrapper.appendChild(colorField);
    
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove layer';
        removeBtn.addEventListener('click', () => {
            this.cloudLayerSettings = this.cloudLayerSettings.filter((l) => l !== layer);
            this.renderCloudLayerControls();
            if(this.callbacks.onCloudUpdate) this.callbacks.onCloudUpdate();
        });
        wrapper.appendChild(removeBtn);
    
        return wrapper;
    }
    
    renderCloudLayerControls() {
        if (!this.els.cloudLayers) return;
        this.els.cloudLayers.innerHTML = '';
        for (const layer of this.cloudLayerSettings) {
            this.els.cloudLayers.appendChild(this.createCloudLayerControls(layer));
        }
    }

    // Input Config Getters
    getLeftStickSensitivity() {
        const v = parseFloat(this.els.leftStickSensitivity?.value);
        return Number.isFinite(v) ? v : 1;
    }
    getLookSensitivityX() {
        const v = parseFloat(this.els.lookSensitivityX?.value);
        return Number.isFinite(v) ? v : 0.4;
    }
    getLookSensitivityY() {
        const v = parseFloat(this.els.lookSensitivityY?.value);
        return Number.isFinite(v) ? v : 0.4;
    }
    isInvertLook() {
        return !!this.els.invertLook?.checked;
    }

    bindMobileControls(inputRouter, handleSurfaceAction) {
        if (!this.els.mobileControls || !this.els.movePad || !this.els.lookPad) return;
        const set = (action, pressed) => inputRouter?.setAction(action, pressed);
        const trigger = (name) => inputRouter?.trigger(name);
        const bindPad = (padEl, onMove, onRelease) => {
            let active = false;
            let rect = null;
            const updateRect = () => { rect = padEl.getBoundingClientRect(); };
            const handle = (e) => {
                if (!rect) updateRect();
                const point = e.touches ? e.touches[0] : e;
                const x = point.clientX - rect.left - rect.width / 2;
                const y = point.clientY - rect.top - rect.height / 2;
                const maxR = Math.min(rect.width, rect.height) / 2;
                const dx = Math.max(-maxR, Math.min(maxR, x));
                const dy = Math.max(-maxR, Math.min(maxR, y));
                const nx = dx / maxR;
                const ny = dy / maxR;
                onMove(nx, ny);
            };
            const stop = () => {
                active = false;
                onRelease();
            };
            padEl.addEventListener('pointerdown', (e) => { e.preventDefault(); active = true; updateRect(); handle(e); });
            window.addEventListener('pointermove', (e) => { if (active) { e.preventDefault(); handle(e); } });
            window.addEventListener('pointerup', (e) => { if (active) { e.preventDefault(); stop(); } });
            padEl.addEventListener('touchstart', (e) => { active = true; updateRect(); handle(e); }, { passive: false });
            padEl.addEventListener('touchmove', (e) => { if (active) handle(e); }, { passive: false });
            padEl.addEventListener('touchend', (e) => { if (active) { stop(); } }, { passive: false });
            padEl.addEventListener('touchcancel', (e) => { if (active) { stop(); } }, { passive: false });
        };
    
        bindPad(this.els.movePad, (nx, ny) => {
            const sens = Math.max(0.1, this.getLeftStickSensitivity());
            const threshold = Math.max(0.1, 0.25 / sens);
            set('forward', ny < -threshold);
            set('backward', ny > threshold);
            set('left', nx < -threshold);
            set('right', nx > threshold);
        }, () => {
            set('forward', false);
            set('backward', false);
            set('left', false);
            set('right', false);
        });
    
        bindPad(this.els.lookPad, (nx, ny) => {
            const sx = Math.max(0.1, this.getLookSensitivityX());
            const sy = Math.max(0.1, this.getLookSensitivityY());
            const invert = this.isInvertLook() ? -1 : 1;
            inputRouter?.addLookDelta(nx * 6 * sx, ny * 6 * sy * invert);
        }, () => {});
    
        this.els.mobileControls.querySelectorAll('[data-trigger]').forEach((btn) => {
            const action = btn.getAttribute('data-trigger');
            const fire = () => {
                trigger(action);
                if (action === 'surface' && handleSurfaceAction) handleSurfaceAction();
            };
            btn.addEventListener('pointerdown', (e) => { e.preventDefault(); fire(); });
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); fire(); }, { passive: false });
        });
        
        this.els.mobileControls.querySelectorAll('.action-btn[data-action]').forEach((btn) => {
            const action = btn.getAttribute('data-action');
            const down = () => set(action, true);
            const up = () => set(action, false);
            btn.addEventListener('pointerdown', (e) => { e.preventDefault(); down(); });
            btn.addEventListener('pointerup', (e) => { e.preventDefault(); up(); });
            btn.addEventListener('pointerleave', up);
            btn.addEventListener('pointercancel', up);
            btn.addEventListener('touchstart', (e) => { e.preventDefault(); down(); }, { passive: false });
            btn.addEventListener('touchend', (e) => { e.preventDefault(); up(); }, { passive: false });
            btn.addEventListener('touchcancel', (e) => { e.preventDefault(); up(); }, { passive: false });
        });
    
        if (this.els.surfaceOnlyBtn) {
            this.els.surfaceOnlyBtn.addEventListener('pointerdown', (e) => { 
                e.preventDefault(); 
                trigger('surface'); 
                if (handleSurfaceAction) handleSurfaceAction();
            });
            this.els.surfaceOnlyBtn.addEventListener('touchstart', (e) => { 
                e.preventDefault(); 
                trigger('surface'); 
                if (handleSurfaceAction) handleSurfaceAction();
            }, { passive: false });
        }
    }
}
