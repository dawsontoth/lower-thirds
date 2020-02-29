process.on('uncaughtException', err => {
	console.error(err);
});
require('dotenv').config();

const {app, ipcMain} = require('electron'),
	control = require('./control/module'),
	display = require('./display/module');

app.on('ready', init);
app.on('window-all-closed', cleanUp);

ipcMain.on('change-lower-third', pumpMessage('change-lower-third'));

function init() {
	process.env.CONTROL_DISABLED !== 'true' && control.init();
	process.env.DISPLAY_DISABLED !== 'true' && display.init(true);
	process.env.DISPLAY_DISABLED !== 'true' && display.init(false);
}

function cleanUp() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
}

function pumpMessage(key) {
	return (evt, args) => {
		display.windows.forEach(window =>
			window.webContents.send(key, args),
		);
	};
}
