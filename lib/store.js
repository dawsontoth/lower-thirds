const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
	constructor() {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		this.path = path.join(userDataPath, 'store.json');
		this.data = parseDataFile(this.path, {});
	}

	// This will just return the property on the `data` object
	get(key) {
		return this.data[key];
	}

	// ...and this will set it
	set(key, val) {
		this.data[key] = val;
		fs.writeFileSync(this.path, JSON.stringify(this.data), 'UTF-8');
	}
}

function parseDataFile(filePath, defaults) {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
	} catch (error) {
		return defaults;
	}
}

module.exports = new Store();