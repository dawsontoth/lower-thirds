import { useEffect, useState } from 'react';

export function useAnimationTimer(duration = 1000, delay = 0)
	: [number, boolean, (value: boolean) => void] {
	const [elapsed, setTime] = useState(0);
	const [reversed, setReversed] = useState(false);

	useEffect(
		() => {
			const interrupted = elapsed !== 0 && elapsed !== duration;
			let animationFrame: number;
			let timerStop: any;
			let start: number;
			let relativeDuration = duration - (interrupted ? elapsed : 0);

			// Function to be executed on each animation frame
			function onFrame() {
				setTime(reversed
					? (start + relativeDuration - Date.now())
					: (Date.now() - start));
				loop();
			}

			// Call onFrame() on next animation frame
			function loop() {
				animationFrame = requestAnimationFrame(onFrame);
			}

			function onStart() {
				// Set a timeout to stop things when duration time elapses
				timerStop = setTimeout(() => {
					cancelAnimationFrame(animationFrame);
					setTime(reversed ? 0 : duration);
				}, relativeDuration);

				// Start the loop
				start = Date.now() - (interrupted ? elapsed : 0);
				loop();
			}

			// Start after specified delay (defaults to 0)
			const timerDelay = setTimeout(onStart, delay);

			// Clean things up
			return () => {
				clearTimeout(timerStop);
				clearTimeout(timerDelay);
				cancelAnimationFrame(animationFrame);
			};
		},
		[duration, delay, reversed], // Only re-run effect if duration or delay changes
	);

	return [elapsed, reversed, setReversed];
}
