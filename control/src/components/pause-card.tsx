import React from 'react';
import { Image, setPause, usePauseImage } from '../hooks/cerevo';
import './cards.scss';

export function PauseCard({ image, text }:{ image:Image, text:string }) {
	const pauseImage = usePauseImage();
	return (
		<div className={ 'card' + (pauseImage === image ? ' showing' : '') }
			 onClick={ () => setPause(image) }>
			<div className="click-to-show narrow">
				<img src={ image } alt={ text }/>
				{ text }
			</div>
		</div>
	);
}
