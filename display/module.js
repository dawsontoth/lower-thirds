const electron = require('electron'),
	_ = require('lodash'),
	{ BrowserWindow } = electron;

let displayWindow;
exports.init = createDisplayWindow;

function createDisplayWindow() {
	let screen = electron.screen,
		secondaryDisplay = screen
			.getAllDisplays()
			.find(display => display.bounds.x || display.bounds.y),
		position = secondaryDisplay
			? {
				x: secondaryDisplay.bounds.x,
				y: secondaryDisplay.bounds.y,
				width: secondaryDisplay.bounds.width,
				height: secondaryDisplay.bounds.height
			}
			: {
				x: 200,
				y: 30,
				width: 192 * 2,
				height: 108 * 2
			};
	displayWindow = exports.window = new BrowserWindow(_.defaults(position, {
		frame: false,
		alwaysOnTop: true,
		// fullscreen: true,
		title: 'Lower Thirds',
		backgroundColor: '#000000',
		// titleBarStyle: 'customButtonsOnHover'
	}));
	displayWindow.loadFile('display/index.html');
	// displayWindow.webContents.openDevTools();
	displayWindow.on('closed', () => displayWindow = null);
}
