import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { useBehaviorSubject } from './base';

const subject = new BehaviorSubject({ primary: '', secondary: '' });

export function useInput(): [IPrimarySecondary, (newInput: IPrimarySecondary) => void] {
	return useBehaviorSubject(subject, (input: IPrimarySecondary) => {
		subject.next(input);
	});
}
