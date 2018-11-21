const electron = require('electron'),
	_ = require('lodash'),
	{ BrowserWindow, app, globalShortcut } = electron,
	store = require('../lib/store');

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
	let position = store.get('control-window-position');
	delete position.width;
	delete position.height;
	controlWindow = exports.window = new BrowserWindow(_.defaults(position || {}, {
		alwaysOnTop: true,
		frame: false,
		toolbar: false,
		transparent: true,
		resizable: false,
		x: 200,
		y: 30,
		width: 240,
		height: 80
	}));
	controlWindow.on('resize', saveState);
	controlWindow.on('move', saveState);
	controlWindow.loadFile('control/index.html');
	// controlWindow.webContents.openDevTools();
	controlWindow.on('closed', () => controlWindow = null);
}

function saveState() {
	let bounds = controlWindow.getBounds();
	store.set('control-window-position', {
		x: bounds.x,
		y: bounds.y
	})
}