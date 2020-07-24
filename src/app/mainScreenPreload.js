'use strict';

// App preload script, used to provide a replacement native API now that
// we turned off node integration.

const DiscordNative = {
  isRenderer: process.type === 'renderer',

  nativeModules: require('./discord_native/renderer/nativeModules'),
  process: require('./discord_native/renderer/process'),
  os: require('./discord_native/renderer/os'),
  app: require('./discord_native/renderer/app'),
  clipboard: require('./discord_native/renderer/clipboard'),
  ipc: require('./discord_native/renderer/ipc'),
  gpuSettings: require('./discord_native/renderer/gpuSettings'),
  window: require('./discord_native/renderer/window'),
  powerMonitor: require('./discord_native/renderer/powerMonitor'),
  spellCheck: require('./discord_native/renderer/spellCheck'),
  crashReporter: require('./discord_native/renderer/crashReporter'),
  desktopCapture: require('./discord_native/renderer/desktopCapture'),
  fileManager: require('./discord_native/renderer/fileManager'),
  processUtils: require('./discord_native/renderer/processUtils'),
  powerSaveBlocker: require('./discord_native/renderer/powerSaveBlocker'),
  http: require('./discord_native/renderer/http'),
  accessibility: require('./discord_native/renderer/accessibility'),
  features: require('./discord_native/renderer/features'),
  settings: require('./discord_native/renderer/settings')
};

// TODO: remove these once web no longer uses them
DiscordNative.remoteApp = DiscordNative.app;
DiscordNative.remotePowerMonitor = DiscordNative.powerMonitor;

const _setImmediate = setImmediate;
const _clearImmediate = clearImmediate;
process.once('loaded', () => {
  global.DiscordNative = DiscordNative;

  // We keep these two functions in global because electron doesn't put these
  // nodejs APIs in the module scope, and these two functions
  // aren't harmful at all.
  global.setImmediate = _setImmediate;
  global.clearImmediate = _clearImmediate;
});