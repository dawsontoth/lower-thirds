export function cx(...params: (string | { [key: string]: any })[]): string {
	const classNames: string[] = [];
	for (const param of params) {
		if (!param) {
			continue;
		}
		if (typeof param === 'string') {
			classNames.push(param);
		}
		if (typeof param === 'object') {
			for (const paramKey in param) {
				if (param.hasOwnProperty(paramKey)) {
					if (param[paramKey]) {
						classNames.push(paramKey);
					}
				}
			}
		}
	}
	return classNames.join(' ');
}
