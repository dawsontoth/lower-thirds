import { BehaviorSubject } from 'rxjs';
import { IConfiguredDisplay } from '../models/configured-display';
import { StoreKeys } from '../models/keys';
import { persistentStore } from '../utils/store';
import { useBehaviorSubject } from './base';

declare const ipc: any;

const displaysSettingsSubject = new BehaviorSubject(persistentStore.get<IConfiguredDisplay[]>(StoreKeys.Displays, []));

export type SetDisplaySettings = (newConfiguration: IConfiguredDisplay[]) => void;

export function useDisplaySettings(): [IConfiguredDisplay[], SetDisplaySettings] {
	return useBehaviorSubject(displaysSettingsSubject, (newConfiguration: IConfiguredDisplay[]) => {
		persistentStore.set(StoreKeys.Displays, newConfiguration, () => ipc.send('displays-configured'));
		displaysSettingsSubject.next(newConfiguration);
	});
}
