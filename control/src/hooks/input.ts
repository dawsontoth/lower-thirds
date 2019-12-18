import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { useBehaviorSubject } from './base';

const subject = new BehaviorSubject({ primary: '', secondary: '' });

const change = (input:IPrimarySecondary) => {
	subject.next(input);
};

export function useInput():[IPrimarySecondary, (newInput:IPrimarySecondary) => void] {
	return useBehaviorSubject(subject, change);
}
