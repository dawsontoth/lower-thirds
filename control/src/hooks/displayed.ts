import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { useBehaviorSubject } from './base';

type Displayed = IPrimarySecondary | null;
declare const ipc:any;

const subject = new BehaviorSubject<Displayed>(null);

const change = (displayed:Displayed) => {
	if (displayed?.primary || displayed?.secondary) {
		ipc.send('change', {
			title: (displayed?.primary || '').trim(),
			subtitle: (displayed?.secondary || '').trim(),
		});
		ipc.send('in');
	}
	else {
		ipc.send('out');
	}
	subject.next(displayed);
};

export function useDisplayed():[Displayed, (newDisplayed:Displayed) => void] {
	return useBehaviorSubject(subject, change);
}
