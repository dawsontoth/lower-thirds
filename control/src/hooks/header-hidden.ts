import { BehaviorSubject } from 'rxjs';
import { useBehaviorSubject } from './base';

const subject = new BehaviorSubject(false);

const change = (mode: boolean) => {
	subject.next(mode);
};

export function useHeaderHidden(): [boolean, (newHidden: boolean) => void] {
	return useBehaviorSubject(subject, change);
}
