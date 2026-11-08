import * as THREE from 'three';

/** A bounded scene presenter: accepts text and an anchor, never owns chat or a body. */
export class SpeechBubbleLayer {
  constructor({ scene, getAnchor, camera = null, durationMs = 12_000, maximum = 64, offsetY = 6, now = () => performance.now() } = {}) {
    if (!scene?.isScene || typeof getAnchor !== 'function' || typeof now !== 'function'
        || !Number.isFinite(durationMs) || durationMs <= 0 || durationMs > 60_000
        || !Number.isInteger(maximum) || maximum < 1 || maximum > 256
        || !Number.isFinite(offsetY) || offsetY < 0 || offsetY > 100
        || (camera && !camera.isPerspectiveCamera)) throw new TypeError('Invalid speech bubble options');
    Object.assign(this, { scene, getAnchor, camera, durationMs, maximum, offsetY, now });
    this.viewPosition = new THREE.Vector3();
    this.entries = new Map(); this.closed = false;
    this.group = new THREE.Group(); this.group.name = 'World speech bubbles'; scene.add(this.group);
  }

  show(key, text) {
    if (this.closed || typeof key !== 'string' || !key || key.length > 300 || typeof text !== 'string' || !text.trim()) return false;
    this.remove(key);
    if (this.entries.size >= this.maximum) this.remove(this.entries.keys().next().value);
    const canvas = document.createElement('canvas'); canvas.width = 768;
    const context = canvas.getContext('2d'); if (!context) return false;
    context.font = '30px monospace';
    const lines = []; let line = '';
    for (const character of Array.from(text.replace(/\s+/g, ' ').slice(0, 512))) {
      if (context.measureText(line + character).width > 688) { lines.push(line); line = ''; }
      line += character;
    }
    if (line) lines.push(line);
    // Keep an overhead excerpt readable at the normal camera distance. The
    // complete message stays in the conversation transcript.
    if (lines.length > 3 || text.length > 512) lines[Math.min(lines.length, 3) - 1] = lines[Math.min(lines.length, 3) - 1].slice(0, -1) + '…';
    const shown = lines.slice(0, 3);
    canvas.height = shown.length * 40 + 64;
    context.fillStyle = '#061c26'; context.strokeStyle = '#6feeff'; context.lineWidth = 3;
    context.beginPath(); context.roundRect(2, 2, 764, canvas.height - 22, 16); context.fill(); context.stroke();
    context.beginPath(); context.moveTo(370, canvas.height - 22); context.lineTo(384, canvas.height - 3); context.lineTo(398, canvas.height - 22); context.fill(); context.stroke();
    context.font = '30px monospace'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillStyle = '#e8fcff';
    shown.forEach((value, index) => context.fillText(value, 384, 30 + index * 40));
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false }));
    // Speech is a world-anchored annotation: a nearby foreground cube must not
    // erase the words while the speaker is framed behind it.
    sprite.renderOrder = 1000;
    sprite.scale.set(19, 19 * canvas.height / canvas.width, 1);
    sprite.userData.speech = text.slice(0, 2048); sprite.userData.speaker = key;
    this.group.add(sprite); this.entries.set(key, { sprite, aspect: canvas.height / canvas.width, expires: this.now() + this.durationMs });
    this.update(); return true;
  }

  update() {
    if (this.closed) return;
    const now = this.now();
    this.camera?.updateWorldMatrix(true, false);
    for (const [key, entry] of this.entries) {
      if (entry.expires <= now) { this.remove(key); continue; }
      const anchor = this.getAnchor(key);
      entry.sprite.visible = Boolean(anchor);
      if (!anchor) continue; // A message may arrive before its avatar snapshot.
      if (anchor.isObject3D) anchor.getWorldPosition(entry.sprite.position);
      else if (Array.isArray(anchor)) entry.sprite.position.fromArray(anchor);
      else entry.sprite.position.copy(anchor);
      entry.sprite.position.y += this.offsetY;
      if (this.camera) {
        const depth = -this.viewPosition.copy(entry.sprite.position).applyMatrix4(this.camera.matrixWorldInverse).z;
        entry.sprite.visible = depth > this.camera.near;
        // Portrait screens and a close camera must not produce a screen-wide
        // world sprite. Preserve perspective at normal and far distances.
        const width = Math.min(19, Math.max(0.1, depth * 2 / this.camera.projectionMatrix.elements[0] * 0.8));
        entry.sprite.scale.set(width, width * entry.aspect, 1);
      }
      entry.sprite.position.y += entry.sprite.scale.y / 2;
    }
  }

  remove(key) {
    const entry = this.entries.get(key); if (!entry) return;
    entry.sprite.removeFromParent(); entry.sprite.material.map.dispose(); entry.sprite.material.dispose(); this.entries.delete(key);
  }
  clear() { for (const key of this.entries.keys()) this.remove(key); }
  dispose() { if (this.closed) return; this.clear(); this.group.removeFromParent(); this.closed = true; }
}
