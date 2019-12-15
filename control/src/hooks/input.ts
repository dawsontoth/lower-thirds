import { useLayoutEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { persistentStore } from '../utils/store';
import { StoreKeys } from '../models/keys';

const storeKey = StoreKeys.Input;

const subject = new BehaviorSubject(persistentStore.get<IPrimarySecondary>(storeKey, { primary: '', secondary: '' }));

const change = (input:IPrimarySecondary) => {
	persistentStore.set(storeKey, input);
	subject.next(input);
};

export function useInput():[IPrimarySecondary, (newInput:IPrimarySecondary) => void] {
	const [current, setCurrent] = useState(subject.value);

	useLayoutEffect(() => {
		subject.subscribe(setCurrent);
	}, []);

	return [current, change];
}
