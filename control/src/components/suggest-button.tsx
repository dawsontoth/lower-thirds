import React from 'react';
import { useSuggestionMode } from '../hooks/suggestion-mode';
import { SuggestionMode } from '../models/suggestion-mode';
import { focusPrimary } from '../utils/focus-primary';

export function SuggestButton({ mode, label, icon }: { mode: SuggestionMode, label: string, icon: string }) {
	const [currentMode, changeMode] = useSuggestionMode();
	const active = currentMode === mode;

	return (
		// eslint-disable-next-line jsx-a11y/no-access-key
		<button className={'suggest suggest-' + label.toLowerCase() + (active ? ' active' : '')}
		        accessKey={label.toLowerCase()[0]}
		        type="button"
		        onClick={() => changeMode(mode)}
		        onFocus={focusPrimary}>
			<i className={'icon-status fal ' + (active ? 'fa-check-circle' : 'fa-circle')} />
			<u>{label[0]}</u>{label.substr(1)}
			<i className={'icon-depict ' + icon} />
		</button>
	);
}
