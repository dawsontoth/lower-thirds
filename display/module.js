const electron = require('electron'),
	_ = require('lodash'),
	{ BrowserWindow } = electron;

exports.windows = [];
exports.init = createDisplayWindow;

function createDisplayWindow(alphaChannel) {
	let screen = electron.screen,
		secondaryDisplay = screen
			.getAllDisplays()
			.find(display => display.bounds.x || display.bounds.y),
		tertiaryDisplay = secondaryDisplay && screen
			.getAllDisplays()
			.find(display => (display.bounds.x || display.bounds.y) && display !== secondaryDisplay),
		displayOn = alphaChannel ? tertiaryDisplay : secondaryDisplay,
		position = displayOn
			? {
				x: displayOn.bounds.x,
				y: displayOn.bounds.y,
				width: displayOn.bounds.width,
				height: displayOn.bounds.height
			}
			: {
				x: 200 + (!alphaChannel ? 0 : 192 * 2),
				y: 30,
				width: 192 * 2,
				height: 108 * 2
			};
	if (alphaChannel && secondaryDisplay && !tertiaryDisplay) {
		return;
	}
	let displayWindow = new BrowserWindow(_.defaults(position, {
		frame: false,
		alwaysOnTop: true,
		focusable: false,
		// fullscreen: true,
		title: 'Titles - ' + (alphaChannel ? 'Alpha' : 'Display'),
		backgroundColor: '#000000',
		// titleBarStyle: 'customButtonsOnHover'
	}));
	displayWindow.loadFile('display/index.html');
	displayWindow.webContents.executeJavaScript(
		`document.body.classList.add("${alphaChannel ? 'for' : 'not'}-alpha-channel")`
	);
	exports.windows.push(displayWindow);
	// displayWindow.webContents.openDevTools();
}
