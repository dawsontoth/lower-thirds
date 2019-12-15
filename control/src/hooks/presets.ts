import { useLayoutEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { persistentStore } from '../utils/store';
import { StoreKeys } from '../models/keys';

const storeKey = StoreKeys.Presets;

const subject = new BehaviorSubject(persistentStore.get<IPrimarySecondary[]>(storeKey, []));

const change = (presets:IPrimarySecondary[]) => {
	persistentStore.set(storeKey, presets);
	subject.next(presets);
};

export function usePresets():[IPrimarySecondary[], (newLines:IPrimarySecondary[]) => void] {
	const [current, setCurrent] = useState(subject.value);

	useLayoutEffect(() => {
		subject.subscribe(setCurrent);
	}, []);

	return [current, change];
}
