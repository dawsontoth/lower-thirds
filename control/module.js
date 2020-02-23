const electron = require('electron'),
    path = require('path'),
    testing = require('../config').testing,
    {BrowserWindow, app, globalShortcut} = electron,
    shallowDefaults = require('../lib/defaults'),
    store = new (require('../lib/store'))('control');

let controlWindow;
exports.init = createControlWindow;
app.on('ready', registerHotKey);
app.on('activate', activate);

function registerHotKey() {
    let ret = globalShortcut.register('CommandOrControl+D', hotKeyPressed);
    if (!ret) {
        console.error('registration failed');
    }
}

function hotKeyPressed() {
    if (controlWindow) {
        controlWindow.focus();
    }
}

function activate() {
    if (controlWindow === null) {
        createControlWindow();
    }
}

function createControlWindow() {
    let defaults = {
            autoHideMenuBar: true,
            x: 200,
            y: 30,
            width: 400,
            height: 200,
            title: 'Lower Thirds',
            backgroundColor: '#000000',
            acceptFirstMouse: true,
            webPreferences: {
                nodeIntegration: true,
            },
        },
        position = store.get('control-window-position') || defaults;
    if (position.width < defaults.width) {
        position.width = defaults.width;
    }
    if (position.height < defaults.height) {
        position.height = defaults.height;
    }
    controlWindow = exports.window = new BrowserWindow(shallowDefaults(position, defaults));
    controlWindow.on('resize', saveState);
    controlWindow.on('move', saveState);
    if (testing) {
        controlWindow.loadURL('http://localhost:3000?userData=' + encodeURIComponent(app.getPath('userData')));
    } else {
        const local = path.resolve(path.join(__dirname, 'build/index.html'));
        controlWindow.loadURL('file://' + local + '?userData=' + encodeURIComponent(app.getPath('userData')));
    }

    // controlWindow.maximize();
    // controlWindow.setFullScreen(true);
    controlWindow.on('closed', () => electron.app.quit());
}

function saveState() {
    let bounds = controlWindow.getBounds();
    store.set('control-window-position', {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
    });
}
