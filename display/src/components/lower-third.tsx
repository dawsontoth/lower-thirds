import React from 'react';
import { useAnimation } from '../hooks/use-animation';
import { ILowerThird } from '../models/lower-third';

export function LowerThird({ data }:{ data:ILowerThird }) {
	const duration = 1000;
	const [progress, reversed, setReversed] = useAnimation(duration);
	if (data.out && !reversed) {
		setReversed(data.out);
	}
	const keyframe = progress * duration;
	return (
		<div className={ 'lower-third' + (data.secondary ? ' has-secondary' : '') }>
			<div
				className="slash"
				style={ {
					opacity: animate(keyframe, 0, 400, 1),
					transform: 'translateX(' + ranimate(keyframe, 0, 1000, 500) + 'px)',
				} }
			>/
			</div>
			<div
				className="primary"
				style={ {
					opacity: animate(keyframe, 400, 1000, 1),
					transform: 'translateX(' + ranimate(keyframe, 300, 1000, -30) + 'px)',
				} }
			>{ data.primary }</div>
			{ data.secondary && <div
				className="secondary"
				style={ {
					opacity: animate(keyframe, 600, 1000, 1),
					transform: 'translateX(' + ranimate(keyframe, 500, 1000, -30) + 'px)',
				} }
			>{ data.secondary }</div> }
		</div>
	);
}

function animate(keyframe:number, from:number, to:number, value:number) {
	return Math.min(Math.max(0, keyframe - from) / (to - from), 1) * value;
}

function ranimate(keyframe:number, from:number, to:number, value:number) {
	return value - animate(keyframe, from, to, value);
}
