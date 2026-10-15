export type StateStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

/** Shared by the hook's hydration effect and injectable storage-boundary tests. */
export function readStoredState<T>(storage: Pick<StateStorage, "getItem">, key: string, parse: (raw: string | null) => T | null): T | null {
  return parse(storage.getItem(key));
}

/** Shared by the hook's post-hydration write effect and storage-boundary tests. */
export function writeStoredState<T>(storage: Pick<StateStorage, "setItem">, key: string, value: T): void {
  storage.setItem(key, JSON.stringify(value));
}
