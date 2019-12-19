declare const path:any;
declare const fs:any;

const dataStore = 'data/store';

class Store {
	private readonly path:string;
	private readonly data:any;

	constructor(subPath:string) {
		this.path = path.join(dataStore, subPath + '.json');
		this.data = parseDataFile(this.path, {});
	}

	/**
	 * Retrieves a value from the persistent data store.
	 * @param key
	 * @param [defaultValue]
	 * @returns {*}
	 */
	get<T>(key:string, defaultValue?:T) {
		return this.data[key] === undefined
			? defaultValue
			: this.data[key];
	}

	/**
	 * Stores a value in the persistent data store.
	 * @param key
	 * @param val
	 */
	set<T>(key:string, val:T) {
		if (this.data[key] === val
			&& (!val || stringify(val) === stringify(this.data[key]))) {
			// Already saved!
			return;
		}
		this.data[key] = val;
		try {
			fs.writeFile(this.path, stringify(this.data), 'UTF-8', (err:Error) => null);
		}
		catch (err) {
			console.error('Store save failure', err);
		}

	}
}

export const persistentStore = new Store('control-web');

function stringify(data:any) {
	return JSON.stringify(data, null, '\t');
}

function parseDataFile(filePath:string, defaults:any) {
	try {
		if (!fs.existsSync(filePath)) {
			return {};
		}
		return JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
	}
	catch (err) {
		console.error('Store load failure', err);
		return defaults;
	}
}