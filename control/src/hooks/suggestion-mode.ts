import { useLayoutEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { SuggestionMode } from '../models/suggestion-mode';
import { persistentStore } from '../utils/store';
import { StoreKeys } from '../models/keys';

const storeKey = StoreKeys.SuggestionMode;
const subject = new BehaviorSubject(persistentStore.get(storeKey, SuggestionMode.Verse));

const change = (mode:SuggestionMode) => {
	persistentStore.set(storeKey, mode);
	subject.next(mode);
};

export function useSuggestionMode():[SuggestionMode, (newMode:SuggestionMode) => void] {
	const [current, setCurrent] = useState(subject.value);

	useLayoutEffect(() => {
		subject.subscribe(setCurrent);
	}, []);

	return [current, change];
}
