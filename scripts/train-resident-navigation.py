#!/usr/bin/env python3
"""Offline NumPy behavioral cloning. Live browser inference never imports this."""
import argparse
import json
import numpy as np
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--data', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--initial')
parser.add_argument('--epochs', type=int, default=35)
parser.add_argument('--seed', type=int, default=20261109)
args = parser.parse_args()
shape = [40, 64, 64, 2]
data = np.fromfile(args.data, dtype=np.float32).reshape(-1, 42)
x, y = data[:, :40], data[:, 40:]
rng = np.random.default_rng(args.seed)
weights, biases = [], []
flat = json.loads(Path(args.initial).read_text()) if args.initial else None
offset = 0
for n, m in zip(shape[:-1], shape[1:]):
    weights.append(np.array(flat[offset:offset + n*m], dtype=np.float32).reshape(m,n).T.copy() if flat else
                   rng.uniform(-np.sqrt(6/(n+m)), np.sqrt(6/(n+m)), (n,m)).astype(np.float32))
    offset += n*m
    biases.append(np.array(flat[offset:offset+m], dtype=np.float32) if flat else np.zeros(m, dtype=np.float32))
    offset += m
params = [p for pair in zip(weights, biases) for p in pair]
means = [np.zeros_like(p) for p in params]
variances = [np.zeros_like(p) for p in params]
updates, losses = 0, []
for epoch in range(args.epochs):
    order = rng.permutation(len(x)); total = 0
    rate = 0.0015 * (0.4 + 0.6 * (1 - epoch / args.epochs))
    for start in range(0, len(x), 128):
        indices = order[start:start+128]; inputs, expected = x[indices], y[indices]
        activations = [inputs]
        for w, b in zip(weights, biases): activations.append(np.tanh(activations[-1] @ w + b))
        error = activations[-1] - expected; total += np.square(error).sum()
        delta = error * (1 - activations[-1] ** 2) / len(indices)
        gradients = []
        for layer in range(2, -1, -1):
            gradients[0:0] = [activations[layer].T @ delta, delta.sum(axis=0)]
            if layer: delta = (delta @ weights[layer].T) * (1 - activations[layer] ** 2)
        updates += 1
        for p, m, v, g in zip(params, means, variances, gradients):
            m *= .9; m += .1*g; v *= .999; v += .001*g*g
            p -= rate * (m/(1-.9**updates)) / (np.sqrt(v/(1-.999**updates)) + 1e-8)
    losses.append(float(total / len(x) / 2))
    if epoch % 5 == 0 or epoch == args.epochs-1: print(f'Epoch {epoch+1}/{args.epochs}: MSE {losses[-1]:.6f}', flush=True)
flat = []
for w,b in zip(weights,biases): flat.extend(w.T.ravel().tolist()); flat.extend(b.tolist())
Path(args.output).write_text(json.dumps({'weights':flat, 'losses':losses, 'updates':updates, 'samples':len(x), 'seed':args.seed}))
