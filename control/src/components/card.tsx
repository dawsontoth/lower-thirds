import React from 'react';
import { useDisplayed } from '../hooks/displayed';
import { usePresets } from '../hooks/presets';
import { bindLatestShortcut } from '../hooks/shortcut';
import { areDifferent, areEqual, IPrimarySecondary } from '../models/primary-secondary';
import './card.scss';

export function Card({ pair, index }:{ pair:IPrimarySecondary, index:number }) {
	const [displayed, setDisplayed] = useDisplayed();
	const [presets, setPresets] = usePresets();

	const showing = areEqual(displayed, pair);

	const del = () => {
		setPresets(presets.filter(p => areDifferent(p, pair)));
	};
	const onClick = () => setDisplayed(showing ? null : pair);

	if (index < 10) {
		bindLatestShortcut(String(index < 9 ? index + 1 : 0), onClick);
	}

	return (
		<div className={ `card ${ showing ? ' showing' : '' }` }>
			<div className="click-to-show"
				 onClick={ onClick }
				 onDoubleClick={ onClick }>
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
