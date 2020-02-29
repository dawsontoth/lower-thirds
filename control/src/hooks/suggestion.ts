import Fuse from 'fuse.js';
import { BehaviorSubject } from 'rxjs';
import { StoreKeys } from '../models/keys';
import { IPrimarySecondary } from '../models/primary-secondary';
import { SuggestionMode } from '../models/suggestion-mode';
import { persistentStore } from '../utils/store';
import { useBehaviorSubject } from './base';
import { DEFAULT_BOOKS, DEFAULT_NAMES } from './defaults';
import { useInput } from './input';
import { useSuggestionMode } from './suggestion-mode';

const booksSubject = new BehaviorSubject(persistentStore.get<string>(StoreKeys.Books, DEFAULT_BOOKS));
const namesSubject = new BehaviorSubject(persistentStore.get<string>(StoreKeys.Names, DEFAULT_NAMES));

export function useNames(): [string, (newValue: string) => void] {
	return useBehaviorSubject(namesSubject, (value: string) => {
		persistentStore.set(StoreKeys.Names, value);
		namesSubject.next(value);
	});
}

export function useBooks(): [string, (newValue: string) => void] {
	return useBehaviorSubject(booksSubject, (value: string) => {
		persistentStore.set(StoreKeys.Books, value);
		booksSubject.next(value);
	});
}

export function useSuggestion(): [IPrimarySecondary] {
	const [currentInput] = useInput();
	const [suggestionMode] = useSuggestionMode();
	const [rawNames] = useNames();
	const names = fuse(rawNames);
	const [rawBooks] = useBooks();
	const books = fuse(rawBooks);

	let matches;

	switch (suggestionMode) {
		case SuggestionMode.Person:
			matches = names.search<string>(currentInput.primary);
			if (matches.length) {
				const firstResult = matches[0];
				const parts = firstResult.matches[0].value.split('/');
				const result = { ...currentInput };
				result.primary = parts[0];
				if (parts[1]) {
					result.secondary = parts[1];
				}
				return [result];
			}
			break;
		case SuggestionMode.Verse:
			let search = currentInput.primary
				// Help the user if they accidentally hold shift a little too long.
				.replace(/!/, '1')
				.replace(/@/, '2')
				.replace(/#/, '3')
				.replace(/\$/, '4')
				.replace(/%/, '5')
				.replace(/\^/, '6');
			let reference = null;
			const bookNumberFinder = /^(\d)([a-z])/i;
			// TODO: Need to support complex references like 2:1, 3:1
			const referenceFinder = / ?(\d+):?([-,\da-h ]*)$/i;
			if (referenceFinder.test(search)) {
				reference = search.match(referenceFinder);
				search = search.replace(referenceFinder, '');
			}
			if (bookNumberFinder.test(search)) {
				search = search.replace(bookNumberFinder, '$1 $2');
			}
			matches = books.search<string>(search);
			if (matches.length) {
				const match = matches[0].matches[0];
				const value = match.value;
				const suffix = (value && reference ? ' ' : '')
					+ (reference ? reference.slice(1).join(':') : '');
				const result = { ...currentInput };
				result.primary = value + suffix;
				return [result];
			}
			break;
	}

	return [currentInput];
}

function fuse(storedValue: string) {
	return new Fuse(
		String(storedValue)
			.split('\n')
			.map((l: string) => l.trim())
			.filter(Boolean),
		{
			shouldSort: true,
			includeMatches: true,
			threshold: 0.7,
			location: 0,
			distance: 50,
			maxPatternLength: 32,
			minMatchCharLength: 1,
		},
	);
}
