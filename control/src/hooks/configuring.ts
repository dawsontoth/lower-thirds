import { BehaviorSubject } from 'rxjs';
import { useBehaviorSubject } from './base';

const subject = new BehaviorSubject(false);

export function useConfiguring(): [boolean, (newValue: boolean) => void] {
	return useBehaviorSubject(subject, (mode: boolean) => {
		subject.next(mode);
	});
}
