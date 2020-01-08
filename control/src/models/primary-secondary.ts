export interface IPrimarySecondary {
	primary: string;
	secondary: string;

	[key: string]: string;
}


export function areEqual(a: IPrimarySecondary | null, b: IPrimarySecondary | null) {
	return !a === !b
		&& !!a
		&& !!b
		&& a.primary === b.primary
		&& a.secondary === b.secondary;
}

export function areDifferent(a: IPrimarySecondary | null, b: IPrimarySecondary | null) {
	return !areEqual(a, b);
}
