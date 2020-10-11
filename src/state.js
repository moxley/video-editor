export let state = { edits: [] }

export function updateState(value) {
  state = { ...state, ...value }
}
