import { easing, IEasingMap } from '../models/easing';
import { useAnimationTimer } from './animation-timer';

export function useAnimation(
	duration = 500,
	easingName:keyof IEasingMap = 'inOutQuad',
	delay = 0,
):[number, boolean, (value:boolean) => void] {
	const [elapsed, reversed, setReversed] = useAnimationTimer(duration, delay);
	const n = Math.min(1, elapsed / duration);
	return [easing[easingName](n), reversed, setReversed];
}
