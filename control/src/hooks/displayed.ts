import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { useBehaviorSubject } from './base';

type Displayed = IPrimarySecondary | null;
declare const ipc:any;

const subject = new BehaviorSubject<Displayed>(null);

const change = (displayed:Displayed) => {
	ipc.send('change-lower-third', {
		primary: (displayed?.primary || '').trim(),
		secondary: (displayed?.secondary || '').trim(),
	});
	subject.next(displayed);
};

export function useDisplayed():[Displayed, (newDisplayed:Displayed) => void] {
	return useBehaviorSubject(subject, change);
}
