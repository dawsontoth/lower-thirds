const electron = require('electron'),
	_ = require('lodash'),
	{ BrowserWindow } = electron;

let testing = true;

exports.windows = [];
exports.init = createDisplayWindow;

function createDisplayWindow(alphaChannel) {
	let screen = electron.screen,
		displays = screen.getAllDisplays().sort((a, b) => a.bounds.x - b.bounds.x),
		secondaryDisplay = displays.find(display => display.bounds.x || display.bounds.y),
		tertiaryDisplay = secondaryDisplay && displays.find(display => (display.bounds.x || display.bounds.y) && display !== secondaryDisplay),
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
	if (!testing && alphaChannel && (!secondaryDisplay || !tertiaryDisplay)) {
		return;
	}
	let displayWindow = new BrowserWindow(_.defaults(position, {
		frame: testing,
		alwaysOnTop: !testing,
		focusable: testing,
		// fullscreen: true,
		title: 'Titles - ' + (alphaChannel ? 'Alpha' : 'Display'),
		backgroundColor: '#000000',
		webPreferences: {
			nodeIntegration: true,
		},
		// titleBarStyle: 'customButtonsOnHover'
	}));
	displayWindow.loadFile('display/index.html');
	displayWindow.webContents.executeJavaScript(
		`document.body.classList.add("${alphaChannel ? 'for' : 'not'}-alpha-channel")`,
	);
	exports.windows.push(displayWindow);
	// displayWindow.webContents.openDevTools();
}
