import { BehaviorSubject } from 'rxjs';
import { StoreKeys } from '../models/keys';
import { IPrimarySecondary } from '../models/primary-secondary';
import { persistentStore } from '../utils/store';
import { useBehaviorSubject } from './base';

const storeKey = StoreKeys.Presets;

const subject = new BehaviorSubject(persistentStore.get<IPrimarySecondary[]>(storeKey, []));

const change = (presets: IPrimarySecondary[]) => {
	persistentStore.set(storeKey, presets);
	subject.next(presets);
};

export function usePresets(): [IPrimarySecondary[], (newLines: IPrimarySecondary[]) => void] {
	return useBehaviorSubject(subject, change);
}
