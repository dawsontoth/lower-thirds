import { useLayoutEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

export function useBehaviorSubject<T>(subject: BehaviorSubject<T>): [T];
export function useBehaviorSubject<T>(subject: BehaviorSubject<T>, change: (t: T) => void): [T, (t: T) => void];
export function useBehaviorSubject<T>(subject: BehaviorSubject<T>, change?: (t: T) => void) {
	const [current, setCurrent] = useState(subject.value);

	useLayoutEffect(() => {
		const subscription = subject.subscribe(setCurrent);
		return () => {
			subscription.unsubscribe();
		};
	}, [subject]);

	return [current, change];
}
