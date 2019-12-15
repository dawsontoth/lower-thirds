process.on('uncaughtException', err => {
	console.error(err);
});

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
	display.init(true);
	display.init(false);
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
