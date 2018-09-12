const electron = require('electron'),
	{ BrowserWindow } = electron;

let displayWindow;
exports.init = createDisplayWindow;

function createDisplayWindow() {
	let screen = electron.screen,
		secondaryDisplay = screen
			.getAllDisplays()
			.find(display => display.bounds.x || display.bounds.y);
	if (secondaryDisplay) {
		displayWindow = exports.window = new BrowserWindow({
			frame: false,
			alwaysOnTop: true,
			// fullscreen: true,
			title: 'Lower Thirds',
			backgroundColor: '#0000ff',
			// titleBarStyle: 'customButtonsOnHover',
			// x: 200,
			// y: 30,
			// width: 192 * 2,
			// height: 108 * 2
			x: secondaryDisplay.bounds.x,
			y: secondaryDisplay.bounds.y,
			width: secondaryDisplay.bounds.width,
			height: secondaryDisplay.bounds.height
		});
		displayWindow.loadFile('display/index.html');
		// displayWindow.webContents.openDevTools();
		displayWindow.on('closed', () => displayWindow = null);
	}
}
