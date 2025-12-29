const DEFAULT_STATE = () => ({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    run: false,
    rollLeft: false,
    rollRight: false
});

const ONE_SHOT_ACTIONS = new Set(['flyToggle', 'jump', 'exit', 'surface']);

export class InputRouter {
    constructor(target = document) {
        this.target = target;
        this.state = DEFAULT_STATE();
        this.once = new Set();
        this.lookDelta = { x: 0, y: 0 };
        this.mode = 'desktop';
        this.lookMode = 'orbit'; // 'orbit' or 'surface'
    }

    setMode(mode) {
        this.mode = mode;
    }

    setLookMode(mode) {
        this.lookMode = mode;
    }

    consume(name) {
        if (!ONE_SHOT_ACTIONS.has(name)) return false;
        const hit = this.once.has(name);
        if (hit) this.once.delete(name);
        return hit;
    }

    setAction(action, pressed) {
        if (action in this.state) {
            this.state[action] = !!pressed;
        } else if (ONE_SHOT_ACTIONS.has(action) && pressed) {
            this.once.add(action);
        }
    }

    trigger(action) {
        if (ONE_SHOT_ACTIONS.has(action)) {
            this.once.add(action);
        }
    }

    addLookDelta(dx, dy) {
        this.lookDelta.x += dx;
        this.lookDelta.y += dy;
    }

    consumeLookDelta() {
        const { x, y } = this.lookDelta;
        this.lookDelta.x = 0;
        this.lookDelta.y = 0;
        return { x, y };
    }

    getState() {
        return this.state;
    }

    clear() {
        this.state = DEFAULT_STATE();
        this.once.clear();
        this.lookDelta = { x: 0, y: 0 };
    }

    dispose() {
    }
}
