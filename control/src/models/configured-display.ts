export enum DisplayMode {
	None = '',
	Key = 'key',
	Fill = 'fill'
}

export function boxesAreEqual(a: IBox, b: IBox) {
	return a.x === b.x
		&& a.y === b.y
		&& a.width === b.width
		&& a.height === b.height;
}

export interface IConfiguredDisplay extends IBox {
	mode: DisplayMode;
}


export interface IDisplay {
	id: number;
	bounds: IBox;
	workArea: IBox; // subtracts menu space
	size: IDimensions;
	workAreaSize: IDimensions;
	scaleFactor: number;
	rotation: number;
	internal: boolean;
	touchSupport: string;
}

export interface IBox extends IDimensions, IPosition {
}

export interface IDimensions {
	width: number;
	height: number;
}

export interface IPosition {
	x: number;
	y: number;
}
