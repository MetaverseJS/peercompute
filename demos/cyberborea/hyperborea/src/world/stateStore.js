/**
 * Minimal implementation-agnostic adapter over PeerCompute's StateManager.
 * Keeps the interface generic so it can be reused for other data types.
 */
export class StateStore {
  constructor(stateManager, namespace) {
    this.stateManager = stateManager;
    this.namespace = namespace;
  }

  read(key) {
    return this.stateManager?.readScoped?.(this.namespace, key);
  }

  write(key, value) {
    this.stateManager?.writeScoped?.(this.namespace, key, value);
  }

  delete(key) {
    this.stateManager?.deleteScoped?.(this.namespace, key);
  }

  listKeys() {
    return this.stateManager?.listNamespaceKeys?.(this.namespace) || [];
  }

  clear() {
    this.stateManager?.clearNamespace?.(this.namespace);
  }

  clearPersistence() {
    // Clears the underlying IndexedDB/Yjs persistence (document-wide)
    return this.stateManager?.clearPersistence?.();
  }

  clearAllPersistenceByPrefix(prefix, excludeNames) {
    return this.stateManager?.clearAllPersistenceByPrefix?.(prefix, excludeNames);
  }

  getDocName() {
    return this.stateManager?.getDocName?.();
  }

  has(key) {
    return this.stateManager?.hasScoped?.(this.namespace, key) || false;
  }
}
