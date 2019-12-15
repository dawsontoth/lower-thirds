import React from 'react';
import { SuggestionMode } from '../models/suggestion-mode';
import { useInput } from '../hooks/input';
import { useSuggestion } from '../hooks/suggestion';
import { useSuggestionMode } from '../hooks/suggestion-mode';
import './live-entry.scss';

export function LiveEntry({ line }:{ line:'primary' | 'secondary' }) {
	const [currentInput, changeInput] = useInput();
	const [currentMode] = useSuggestionMode();
	const [currentSuggestion] = useSuggestion();

	const suggestion = currentMode !== SuggestionMode.Custom
		&& currentSuggestion[line] !== currentInput[line]
		&& currentSuggestion[line];

	return (
		<div className={ `live-entry ${ line }-line` }>
			<input placeholder={ `${ line } line` }
				   id={ `${ line }-line` }
				   type="text"
				   value={ currentInput[line] }
				   onChange={ e => changeInput({ ...currentInput, [line]: e.target.value }) }/>
			<span className="suggestion">{ suggestion }</span>
		</div>
	);
}
