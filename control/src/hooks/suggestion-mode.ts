import { BehaviorSubject } from 'rxjs';
import { SuggestionMode } from '../models/suggestion-mode';
import { useBehaviorSubject } from './base';

const subject = new BehaviorSubject(SuggestionMode.Verse);

export function useSuggestionMode(): [SuggestionMode, (newMode: SuggestionMode) => void] {
	return useBehaviorSubject(subject, (mode: SuggestionMode) => {
		subject.next(mode);
	});
}
