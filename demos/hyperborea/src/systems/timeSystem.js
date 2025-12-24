import { CONFIG } from '../config.js';

export class TimeSystem {
  constructor() {
    this.startTime = Date.now();
    this.timeMultiplier = 1;
    this.timeOffset = CONFIG.DAY_DURATION * 0.5 + CONFIG.YEAR_DURATION * 0.125;
  }

  getTime() {
    return (Date.now() - this.startTime) * this.timeMultiplier + this.timeOffset;
  }

  setTimeMultiplier(newMultiplier) {
    const currentTime = this.getTime();
    this.startTime = Date.now();
    this.timeOffset = currentTime;
    this.timeMultiplier = newMultiplier;
  }

  applyRemoteSync({ multiplier, time, sentAt }) {
    const now = Date.now();
    const base = typeof time === 'number' ? time : this.getTime();
    const m = typeof multiplier === 'number' ? multiplier : this.timeMultiplier;
    const elapsed = sentAt ? (now - sentAt) : 0;
    this.startTime = now;
    this.timeOffset = base + elapsed * m;
    this.timeMultiplier = m;
  }

  getDayProgress() {
    return (this.getTime() % CONFIG.DAY_DURATION) / CONFIG.DAY_DURATION;
  }

  getYearProgress() {
    return (this.getTime() % CONFIG.YEAR_DURATION) / CONFIG.YEAR_DURATION;
  }

  getSeason() {
    const p = this.getYearProgress();
    if (p < 0.25) return 'Winter';
    if (p < 0.5) return 'Spring';
    if (p < 0.75) return 'Summer';
    return 'Fall';
  }

  getDayNumber() {
    return Math.floor(this.getTime() / CONFIG.DAY_DURATION) + 1;
  }

  getSunPosition() {
    const dayProgress = this.getDayProgress();
    const yearProgress = this.getYearProgress();
    const daylightRatio = 0.5 + Math.cos(yearProgress * Math.PI * 2) * 0.33;
    let adjustedProgress;
    if (dayProgress < daylightRatio) {
      adjustedProgress = dayProgress / daylightRatio * 0.5;
    } else {
      adjustedProgress = 0.5 + (dayProgress - daylightRatio) / (1 - daylightRatio) * 0.5;
    }
    return adjustedProgress;
  }

  getMoonPhase() {
    return this.getYearProgress();
  }

  getTemperature() {
    return -5 + Math.cos(this.getYearProgress() * Math.PI * 2) * 25;
  }
}
