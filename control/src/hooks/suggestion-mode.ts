import { BehaviorSubject } from 'rxjs';
import { SuggestionMode } from '../models/suggestion-mode';
import { useBehaviorSubject } from './base';

const subject = new BehaviorSubject(SuggestionMode.Verse);

const change = (mode:SuggestionMode) => {
	subject.next(mode);
};

export function useSuggestionMode():[SuggestionMode, (newMode:SuggestionMode) => void] {
	return useBehaviorSubject(subject, change);
}
