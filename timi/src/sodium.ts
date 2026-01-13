// src/sodium.ts
import libsodium from 'libsodium-wrappers';

// This promise will resolve with the fully initialized libsodium object
export const sodium = (async () => {
  await libsodium.ready;
  return libsodium;
})();
