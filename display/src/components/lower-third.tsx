import React from 'react';
import { useDelay } from '../hooks/use-delay';
import { ILowerThird } from '../models/lower-third';
import { cx } from '../utils/cx';
import './lower-third.scss';

export function LowerThird({ data }: { data: ILowerThird }) {
	const nextFrame = useDelay(500);
	return (
		<div className={cx('lower-third', {
			'has-secondary': data.secondary,
			'in': nextFrame,
			'out': data.out,
		})}>
			<div className="primary">{data.primary}</div>
			{data.secondary && <div className="secondary">{data.secondary}</div>}
		</div>
	);
}
