'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = require('electron');

var _events = require('events');

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _squirrelUpdate = require('./squirrelUpdate');

var squirrelUpdate = _interopRequireWildcard(_squirrelUpdate);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function versionParse(verString) {
  return verString.split('.').map(i => parseInt(i));
}

function versionNewer(verA, verB) {
  let i = 0;
  while (true) {
    const a = verA[i];
    const b = verB[i];
    i++;
    if (a === undefined) {
      return false;
    } else {
      if (b === undefined || a > b) {
        return true;
      }
      if (a < b) {
        return false;
      }
    }
  }
}

class AutoUpdaterWin32 extends _events.EventEmitter {
  constructor() {
    super();

    this.updateUrl = null;
    this.updateVersion = null;
  }

  setFeedURL(updateUrl) {
    this.updateUrl = updateUrl;
  }

  quitAndInstall() {
    if (squirrelUpdate.updateExistsSync()) {
      squirrelUpdate.restart(_electron.app, this.updateVersion || _electron.app.getVersion());
    } else {
      require('auto-updater').quitAndInstall();
    }
  }

  downloadAndInstallUpdate(callback) {
    squirrelUpdate.spawnUpdateInstall(this.updateUrl, progress => {
      this.emit('update-progress', progress);
    }).catch(err => callback(err)).then(() => callback());
  }

  checkForUpdates() {
    if (this.updateUrl == null) {
      throw new Error('Update URL is not set');
    }

    this.emit('checking-for-update');

    if (!squirrelUpdate.updateExistsSync()) {
      this.emit('update-not-available');
      return;
    }

    squirrelUpdate.spawnUpdate(['--check', this.updateUrl], (error, stdout) => {
      if (error != null) {
        this.emit('error', error);
        return;
      }

      try {
        // Last line of the output is JSON details about the releases
        const json = stdout.trim().split('\n').pop();
        const releasesFound = JSON.parse(json).releasesToApply;
        if (releasesFound == null || releasesFound.length == 0) {
          this.emit('update-not-available');
          return;
        }

        const update = releasesFound.pop();
        this.emit('update-available');
        this.downloadAndInstallUpdate(error => {
          if (error != null) {
            this.emit('error', error);
            return;
          }

          this.updateVersion = update.version;

          this.emit('update-downloaded', {}, update.release, update.version, new Date(), this.updateUrl, this.quitAndInstall.bind(this));
        });
      } catch (error) {
        error.stdout = stdout;
        this.emit('error', error);
      }
    });
  }
}

// todo
class AutoUpdaterLinux extends _events.EventEmitter {
  constructor() {
    super();
    this.updateUrl = null;
  }

  setFeedURL(url) {
    this.updateUrl = url;
  }

  quitAndInstall() {
    // Just restart. The splash screen will hit the update manually state and
    // prompt the user to download the new package.
    _electron.app.relaunch();
    _electron.app.quit();
  }

  checkForUpdates() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const currVersion = versionParse(_electron.app.getVersion());
      _this.emit('checking-for-update');

      try {
        const response = yield _request2.default.get(_this.updateUrl);

        if (response.statusCode === 204) {
          // you are up to date
          _this.emit('update-not-available');
          return;
        }

        let latestVerStr = '';
        let latestVersion = [];
        try {
          const latestMetadata = JSON.parse(response.body);
          latestVerStr = latestMetadata.name;
          latestVersion = versionParse(latestVerStr);
        } catch (_) {}

        if (versionNewer(latestVersion, currVersion)) {
          console.log('[Updates] You are out of date!');
          // you need to update
          _this.emit('update-manually', latestVerStr);
        } else {
          console.log('[Updates] You are living in the future!');
          _this.emit('update-not-available');
        }
      } catch (err) {
        console.error('[Updates] Error fetching ' + _this.updateUrl + ': ' + err.message);
        _this.emit('error', err);
      }
    })();
  }
}

let autoUpdater;

// TODO
// events: checking-for-update, update-available, update-not-available, update-manually, update-downloaded, error
// also, checkForUpdates, setFeedURL, quitAndInstall
// also, see electron.autoUpdater, and its API
switch (process.platform) {
  case 'darwin':
    autoUpdater = require('electron').autoUpdater;
    break;
  case 'win32':
    autoUpdater = new AutoUpdaterWin32();
    break;
  case 'linux':
    autoUpdater = new AutoUpdaterLinux();
    break;
}

exports.default = autoUpdater;
module.exports = exports.default;