import React from 'react';
import { useDisplayed } from '../hooks/displayed';
import { useInput } from '../hooks/input';
import { usePresets } from '../hooks/presets';
import { bindLatestShortcut } from '../hooks/shortcut';
import { useSuggestion } from '../hooks/suggestion';
import { Action } from '../models/action';
import { areDifferent, areEqual } from '../models/primary-secondary';
import { Shortcut } from '../models/shortcut';
import { focusPrimary } from '../utils/focus-primary';
import './action-button.scss';

export function ActionButton({ action, icon, shortcut }:{ action:Action, icon:string, shortcut:Shortcut }) {
	const [currentSuggestion] = useSuggestion();
	const [, setInput] = useInput();
	const [displayed, setDisplayed] = useDisplayed();
	const [presets, setPresets] = usePresets();

	let enabled = true;
	let onClick = undefined;
	const emptyInput = { primary: '', secondary: '' };

	// TODO: This feels a bit dirty...
	switch (action) {
		case Action.Show:
			enabled = Boolean((currentSuggestion.primary || currentSuggestion.secondary)
				&& (!displayed || areDifferent(displayed, currentSuggestion)));
			onClick = enabled
				? () => {
					setDisplayed({ ...currentSuggestion });
					focusPrimary();
				}
				: focusPrimary;
			break;
		case Action.Hide:
			enabled = Boolean(displayed?.primary || displayed?.secondary);
			onClick = enabled
				? () => {
					setDisplayed(null);
					focusPrimary();
				}
				: currentSuggestion
					? () => {
						setInput(emptyInput);
						focusPrimary();
					}
					: focusPrimary;
			break;
		case Action.Save:
			enabled = Boolean((currentSuggestion.primary || currentSuggestion.secondary)
				&& !presets.find(p => areEqual(currentSuggestion, p)));
			onClick = enabled
				? () => {
					setPresets([...presets, { ...currentSuggestion }]);
					setInput(emptyInput);
					focusPrimary();
				}
				: focusPrimary;
			break;
	}

	bindLatestShortcut(shortcut, onClick);

	return (
		<button className={ `action action-${ action.toLowerCase() } ${ enabled ? '' : ' disabled' }` }
				onClick={ onClick }
				type="button">
			{ action }
			<i className={ 'icon-depict ' + icon }/>
			<div className="key-hint">{ shortcut }</div>
		</button>
	);
}
