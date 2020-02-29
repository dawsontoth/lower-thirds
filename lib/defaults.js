module.exports = function shallowDefaults() {
	const retVal = {};
	for (let i = 0; i < arguments.length; i++) {
		const argument = arguments[i];
		for (const key in argument) {
			if (argument.hasOwnProperty(key)) {
				if (retVal[key] === undefined) {
					retVal[key] = argument[key];
				}
			}
		}
	}
	return retVal;
};
