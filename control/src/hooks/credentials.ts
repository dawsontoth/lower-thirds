import { BehaviorSubject } from 'rxjs';
import { StoreKeys } from '../models/keys';
import { persistentStore } from '../utils/store';
import { useBehaviorSubject } from './base';

const usernameSubject = new BehaviorSubject(persistentStore.get<string>(StoreKeys.Username, ''));
const passwordSubject = new BehaviorSubject(persistentStore.get<string>(StoreKeys.Password, ''));

export function useUsername(): [string, (newValue: string) => void] {
	return useBehaviorSubject(usernameSubject, (value: string) => {
		persistentStore.set(StoreKeys.Username, value);
		usernameSubject.next(value);
	});
}

export function usePassword(): [string, (newValue: string) => void] {
	return useBehaviorSubject(passwordSubject, (value: string) => {
		persistentStore.set(StoreKeys.Password, value);
		passwordSubject.next(value);
	});
}
