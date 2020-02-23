import React from 'react';
import { useHeaderConfiguring } from '../hooks/header-configuring';
import { useBooks, useNames } from '../hooks/suggestion';
import './header-config.scss';

export function HeaderConfig() {
	const [configuring] = useHeaderConfiguring();
	const [names, setNames] = useNames();
	const [books, setBooks] = useBooks();
	return (
		<div className={'take-over ' + (!configuring ? 'is-hidden' : '')}>
			<textarea onChange={e => setNames(e.target.value)}>{names}</textarea>
			<textarea onChange={e => setBooks(e.target.value)}>{books}</textarea>
		</div>
	);
}
