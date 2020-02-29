const electron = require('electron'),
	shallowDefaults = require('../lib/defaults'),
	{BrowserWindow} = electron;

exports.windows = [];
exports.init = createDisplayWindow;

function createDisplayWindow(alphaChannel) {
	let screen = electron.screen,
		displays = screen.getAllDisplays().sort((a, b) => a.bounds.x - b.bounds.x),
		secondaryDisplay = displays.length > 2 && displays[displays.length - 2],
		tertiaryDisplay = displays.length > 2 && displays[displays.length - 1],
		displayOn = alphaChannel ? tertiaryDisplay : secondaryDisplay,
		position = displayOn
			? {
				x: displayOn.bounds.x,
				y: displayOn.bounds.y,
				width: displayOn.bounds.width,
				height: displayOn.bounds.height,
			}
			: {
				x: 200 + (!alphaChannel ? 0 : 192 * 2),
				y: 30,
				width: 192 * 2,
				height: 108 * 2,
			};
	let displayWindow = new BrowserWindow(shallowDefaults(position, {
		frame: false,
		alwaysOnTop: true,
		focusable: true,
		fullscreen: false,
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
	exports.windows.push(displayWindow);
}
