const electron = require('electron'),
	shallowDefaults = require('../lib/defaults'),
	store = new (require('../lib/store'))('control-web'),
	{BrowserWindow, ipcMain, screen} = electron;

exports.windows = {
	key: null,
	fill: null,
};
exports.init = init;

const isMac = process.platform === 'darwin';

function init() {
	ipcMain.on('displays-configured', syncDisplays);
	screen.on('display-added', syncDisplays);
	screen.on('display-removed', syncDisplays);
	screen.on('display-metrics-changed', syncDisplays);
	syncDisplays();
}

function syncDisplays() {
	if ((process.env.DISPLAY_DISABLED || '').toLowerCase() === 'true') {
		return;
	}

	store.reload();
	const displaySettings = store.get('displays') || [];
	const displays = screen.getAllDisplays();

	const forFill = displaySettings.find(d => d.mode === 'fill');
	const forFillDisplay = forFill && displays.find(d => boxesAreEqual(d.bounds, forFill));
	syncDisplay('fill', forFillDisplay, true);

	const forKey = displaySettings.find(d => d.mode === 'key');
	const forKeyDisplay = forKey && displays.find(d => boxesAreEqual(d.bounds, forKey));
	syncDisplay('key', forKeyDisplay, false);
}

function syncDisplay(key, display, alphaChannel) {
	const isShowing = exports.windows[key];
	const shouldShow = display;
	if (isShowing && !shouldShow) {
		exports.windows[key].close();
		exports.windows[key] = null;
		return;
	}
	if (!isShowing && !shouldShow) {
		return;
	}
	if (!isShowing) {
		exports.windows[key] = createDisplayWindow(display, alphaChannel);
	} else if (isShowing && shouldShow) {
		moveDisplayWindow(exports.windows[key], display);
	}
}

function createDisplayWindow(display, alphaChannel) {
	// TODO: Ensure control is not covered...
	const position = getPositionFromDisplay(display);
	const displayWindow = new BrowserWindow(shallowDefaults(position, {
		frame: false,
		alwaysOnTop: true,
		focusable: true,
		fullscreen: isMac,
		title: 'Titles - ' + (alphaChannel ? 'Alpha' : 'Display'),
		backgroundColor: '#000',
		webPreferences: {
			nodeIntegration: true,
		},
	}));
	if (process.env.DISPLAY_HOST) {
		displayWindow.loadURL(process.env.DISPLAY_HOST);
	} else {
		displayWindow.loadFile('display/build/index.html');
	}
	displayWindow.webContents.executeJavaScript(
		`document.body.classList.add("${alphaChannel ? 'for' : 'not'}-alpha-channel")`,
	);
	return displayWindow;
}

function moveDisplayWindow(window, display) {
	const desiredPosition = getPositionFromDisplay(display);
	if (!boxesAreEqual(window.getBounds(), desiredPosition)) {
		if (isMac) {
			window.setFullScreen(false);
		}
		window.setBounds(desiredPosition);
		if (isMac) {
			window.setFullScreen(true);
		}
	}
}

function getPositionFromDisplay(display) {
	return {
		x: display.bounds.x,
		y: display.bounds.y,
		width: display.bounds.width,
		height: display.bounds.height,
	};
}

function boxesAreEqual(a, b) {
	return a.x === b.x
		&& a.y === b.y
		&& a.width === b.width
		&& a.height === b.height;
}
