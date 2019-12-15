import { useLayoutEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { IPrimarySecondary } from '../models/primary-secondary';

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
	const [current, setCurrent] = useState(subject.value);

	useLayoutEffect(() => {
		subject.subscribe(setCurrent);
	}, []);

	return [current, change];
}
