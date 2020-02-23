import { BehaviorSubject } from 'rxjs';
import { StoreKeys } from '../models/keys';
import { IPrimarySecondary } from '../models/primary-secondary';
import { persistentStore } from '../utils/store';
import { useBehaviorSubject } from './base';

const presetsSubject = new BehaviorSubject(persistentStore.get<IPrimarySecondary[]>(StoreKeys.Presets, []));

export function usePresets(): [IPrimarySecondary[], (newLines: IPrimarySecondary[]) => void] {
	return useBehaviorSubject(presetsSubject, (presets: IPrimarySecondary[]) => {
		persistentStore.set(StoreKeys.Presets, presets);
		presetsSubject.next(presets);
	});
}
