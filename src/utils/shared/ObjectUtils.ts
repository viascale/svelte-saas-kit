import { derived, writable } from "svelte/store";
import type { Readable } from "svelte/store";

export function useState<TState>(initialState: TState): [Readable<TState>, (val: any) => void] {
  const state = writable(initialState);

  const update = (val: any) => state.update((currentState) => (typeof val === "function" ? val(currentState) : val));

  const readableState = derived(state, ($state) => $state);

  return [readableState, update];
}
