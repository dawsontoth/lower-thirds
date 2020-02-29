const {app} = require('electron');
const path = require('path');
const fs = require('fs');

const dataStore = app.getPath('userData');

class Store {
	subPath;
	path;
	data;

	constructor(subPath) {
		this.subPath = subPath;
		this.reload();
	}

	reload() {
		this.path = path.join(dataStore, this.subPath + '.json');
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
		// console.log('setting', key, val);
		try {
			fs.writeFileSync(this.path, JSON.stringify(this.data, null, '\t'), 'UTF-8');
		} catch (err) {
			console.error('Store save failure', err);
		}

	}
}

function parseDataFile(filePath, defaults) {
	try {
		if (!fs.existsSync(filePath)) {
			return {};
		}
		return JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
	} catch (err) {
		console.error('Store load failure', err);
		return defaults;
	}
}

module.exports = Store;
