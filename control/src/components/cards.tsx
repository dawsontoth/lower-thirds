import React from 'react';
import { usePresets } from '../hooks/presets';
import { Card } from './card';
import './cards.scss';

export function Cards() {
	const [presets] = usePresets();
	return (
		<div className="cards">
			{ presets.map((p, i) => <Card key={ p.primary + p.secondary } pair={ p } index={ i }/>) }
		</div>
	);
}
