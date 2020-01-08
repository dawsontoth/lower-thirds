import React from 'react';
import { Image, setPause, useConnected, usePauseImage } from '../hooks/cerevo';
import { usePresets } from '../hooks/presets';
import { Card } from './card';
import './cards.scss';

export function Cards() {
	const [presets] = usePresets();
	const connected = useConnected();
	const pauseImage = usePauseImage();
	console.log(pauseImage);
	return (
		<section>
			<div className="cards">
				{presets.map((p, i) => <Card key={p.primary + p.secondary} pair={p} index={i}/>)}
			</div>
			{connected && <div className="pauses">
                <div className={'card' + (pauseImage === Image.SayingHi ? ' showing' : '')}
                     onClick={() => setPause(Image.SayingHi)}>
                    <div className="click-to-show narrow">
                        <img src={Image.SayingHi}/>
                    </div>
                </div>
                <div className={'card' + (pauseImage === Image.TakingCommunion ? ' showing' : '')}
                     onClick={() => setPause(Image.TakingCommunion)}>
                    <div className="click-to-show narrow">
                        <img src={Image.TakingCommunion}/>
                    </div>
                </div>
                <div className={'card' + (pauseImage === Image.WatchingAClip ? ' showing' : '')}
                     onClick={() => setPause(Image.WatchingAClip)}>
                    <div className="click-to-show narrow">
                        <img src={Image.WatchingAClip}/>
                    </div>
                </div>
                <div className={'card' + (pauseImage === Image.ThanksForTuningIn ? ' showing' : '')}
                     onClick={() => setPause(Image.ThanksForTuningIn)}>
                    <div className="click-to-show narrow">
                        <img src={Image.ThanksForTuningIn}/>
                    </div>
                </div>
            </div>}
		</section>
	);
}
