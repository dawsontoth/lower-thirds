import { useLayoutEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { ILowerThird } from '../models/lower-third';

declare const ipc: any;

let nextID = 1;
const subject = new BehaviorSubject<ILowerThird[]>([]);

ipc.on('change-lower-third', (evt: any, lowerThird: ILowerThird) => {
	const lowerThirds = subject.value
		.filter(lt => lt.out < (Date.now() - 20000))
		.map(lt => ({ ...lt, out: Date.now() }));
	const newLowerThird: ILowerThird = {
		...lowerThird,
		id: String(nextID++),
		out: 0,
	};
	if (newLowerThird.primary) {
		lowerThirds.push(newLowerThird);
	}
	subject.next(lowerThirds);
});

export function useLowerThirds(): ILowerThird[] {
	const [current, setCurrent] = useState(subject.value);

	useLayoutEffect(() => {
		const subscription = subject.subscribe(setCurrent);
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return current;
}
