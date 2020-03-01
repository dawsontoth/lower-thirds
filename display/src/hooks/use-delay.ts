import { useEffect, useState } from 'react';

export function useDelay(delay: number): boolean {
	const [nextFrame, setNextFrame] = useState(false);

	useEffect(() => {
		let cleanedUp = false;
		const timeout = setTimeout(() => {
			if (!cleanedUp) {
				setNextFrame(true);
			}
		}, delay);
		return () => {
			cleanedUp = true;
			clearTimeout(timeout);
		};
	});

	return nextFrame;
}
