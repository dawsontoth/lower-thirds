import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';
import { useBehaviorSubject } from './base';

type Displayed = IPrimarySecondary | null;
declare const ipc: any;

const subject = new BehaviorSubject<Displayed>(null);

export function useDisplayed(): [Displayed, (newDisplayed: Displayed) => void] {
	return useBehaviorSubject(subject, (displayed: Displayed) => {
		ipc.send('change-lower-third', {
			primary: (displayed?.primary || '').trim(),
			secondary: (displayed?.secondary || '').trim(),
		});
		subject.next(displayed);
	});
}
