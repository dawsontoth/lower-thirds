const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
	constructor() {
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		this.path = path.join(userDataPath, 'store.json');
		this.data = parseDataFile(this.path, {});
	}

	/**
	 * Retrieves a value from the persistent data store.
	 * @param key
	 * @param [defaultValue]
	 * @returns {*}
	 */
	get(key, defaultValue) {
		return this.data[key] === undefined
			? defaultValue
			: this.data[key];
	}

	/**
	 * Stores a value in the persistent data store.
	 * @param key
	 * @param val
	 */
	set(key, val) {
		this.data[key] = val;
		fs.writeFileSync(this.path, JSON.stringify(this.data), 'UTF-8');
	}
}

function parseDataFile(filePath, defaults) {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
	}
	catch (error) {
		return defaults;
	}
}

module.exports = new Store();
