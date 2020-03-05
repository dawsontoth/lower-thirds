import React from 'react';
import { Image, useConnected } from '../hooks/cerevo';
import { usePresets } from '../hooks/presets';
import { Card } from './card';
import './cards.scss';
import { PauseCard } from './pause-card';

export function Cards() {
	const [presets] = usePresets();
	const connected = useConnected();
	return (
		<section>
			<div className="cards">
				{presets.map((p, i) => <Card key={p.primary + p.secondary} pair={p} index={i} />)}
			</div>
			{connected && <div className="pauses">
                <PauseCard image={Image.SayingHi} text="Saying Hi" />
                <PauseCard image={Image.Offering} text="Offering" />
                <PauseCard image={Image.TakingCommunion} text="Communion" />
                <PauseCard image={Image.WatchingAClip} text="Watching a Clip" />
                <PauseCard image={Image.ThanksForTuningIn} text="Bye!" />
            </div>}
		</section>
	);
}
