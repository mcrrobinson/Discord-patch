'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
exports.update = update;
exports.isInstalled = isInstalled;
exports.uninstall = uninstall;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _electron = require('electron');

var _buildInfo = require('../buildInfo');

var _buildInfo2 = _interopRequireDefault(_buildInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: We should use Constant's APP_NAME, but only once
//       we set up backwards compat with this.
const appName = _path2.default.basename(process.execPath, '.exe');
const exePath = _electron.app.getPath('exe');
const exeDir = _path2.default.dirname(exePath);
const iconPath = _path2.default.join(exeDir, 'discord.png');
const autostartDir = _path2.default.join(_electron.app.getPath('appData'), 'autostart');
const electronAppName = _electron.app.name ? _electron.app.name : _electron.app.getName();
const autostartFileName = _path2.default.join(autostartDir, electronAppName + '-' + _buildInfo2.default.releaseChannel + '.desktop');
const desktopFile = `[Desktop Entry]
Type=Application
Exec=${exePath}
Hidden=false
NoDisplay=false
Name=${appName}
Icon=${iconPath}
Comment=Text and voice chat for gamers.
X-GNOME-Autostart-enabled=true
`;

function ensureDir() {
  try {
    _fs2.default.mkdirSync(autostartDir);
    return true;
  } catch (e) {
    // catch for when it already exists.
  }
  return false;
}

function install(callback) {
  // TODO: This could fail. We should read its return value
  ensureDir();
  try {
    return _fs2.default.writeFile(autostartFileName, desktopFile, callback);
  } catch (e) {
    // I guess we don't autostart then
    return callback();
  }
}

function update(callback) {
  // TODO: We might need to implement this later on
  return callback();
}

function isInstalled(callback) {
  try {
    _fs2.default.stat(autostartFileName, (err, stats) => {
      if (err) {
        return callback(false);
      }
      return callback(stats.isFile());
    });
  } catch (e) {
    return callback(false);
  }
}

function uninstall(callback) {
  return _fs2.default.unlink(autostartFileName, callback);
}