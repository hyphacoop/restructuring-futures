import { writable } from 'svelte/store';

const showUserSettingsStore = writable(false);

export { showUserSettingsStore };