const { app, ipcMain } = require('electron'),
	control = require('./control/module'),
	display = require('./display/module');

app.on('ready', init);
app.on('window-all-closed', cleanUp);

ipcMain.on('in', pumpMessage('in'));
ipcMain.on('out', pumpMessage('out'));
ipcMain.on('change', pumpMessage('change'));

function init() {
	control.init();
	display.init();
}

function cleanUp() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
}

function pumpMessage(key) {
	return function(evt, args) {
		display.window.webContents.send(key, args);
	};
}