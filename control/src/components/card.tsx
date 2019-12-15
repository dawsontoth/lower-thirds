import React from 'react';
import { areDifferent, areEqual, IPrimarySecondary } from '../models/primary-secondary';
import { useDisplayed } from '../hooks/displayed';
import { usePresets } from '../hooks/presets';
import './card.scss';

export function Card({ pair, index }:{ pair:IPrimarySecondary, index:number }) {
	const [displayed, setDisplayed] = useDisplayed();
	const [presets, setPresets] = usePresets();

	const showing = areEqual(displayed, pair);

	const del = () => {
		setPresets(presets.filter(p => areDifferent(p, pair)));
	};

	return (
		<div className={ `card ${ showing ? ' showing' : '' }` }>
			<div className="click-to-show"
				 onClick={ () => setDisplayed(showing ? null : pair) }>
				<div className="primary">{ pair.primary }</div>
				<div className="secondary">{ pair.secondary }</div>

				<div className="action">
					{ showing ? 'Hide' : 'Show' }
					<span className="key-hint">{ index + 1 }</span>
				</div>
			</div>
			<div className="footer">
				<button onDoubleClick={ del } className="action action-delete" type="button">
					Delete
					<i className="icon-depict fad fa-trash"/>
				</button>
			</div>
		</div>
	);
}
