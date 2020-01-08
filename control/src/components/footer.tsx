import React from 'react';
import {
	pauseFacebook,
	pauseRecording,
	PossibleStates,
	startFacebook,
	startRecording,
	stopFacebook,
	stopRecording,
	useFacebookState,
	useRecordingState,
} from '../hooks/cerevo';
import './footer.scss';

export function Footer() {
	const recordingState = useRecordingState();
	const facebookState = useFacebookState();
	return (
		<footer>
			<dt className={'first ' + facebookState}>Stream</dt>
			<dd className={'first ' + facebookState}>{translateState(facebookState, 'Connecting...')}</dd>
			<button type="button" className="start"
			        onClick={startFacebook}
			        disabled={facebookState !== 'pause' && facebookState !== 'stop'}><i className="fad fa-play-circle"/>
			</button>
			<button type="button" className="pause"
			        onClick={pauseFacebook}
			        disabled={facebookState !== 'start'}><i
				className="fad fa-pause-circle"/></button>
			<button type="button" className="stop"
			        onClick={stopFacebook}
			        disabled={facebookState !== 'pause' && facebookState !== 'start'}><i
				className="fad fa-stop-circle"/>
			</button>

			<dt className={'second ' + recordingState}>Recording</dt>
			<dd className={'second ' + recordingState}>{translateState(recordingState, '... to Cerevo!')}</dd>
			<button type="button" className="start"
			        onClick={startRecording}
			        disabled={recordingState !== 'pause' && recordingState !== 'stop'}><i
				className="fad fa-play-circle"/></button>
			<button type="button" className="pause"
			        onClick={pauseRecording}
			        disabled={recordingState !== 'start'}><i
				className="fad fa-pause-circle"/></button>
			<button type="button" className="stop"
			        onClick={stopRecording}
			        disabled={recordingState !== 'pause' && recordingState !== 'start'}><i
				className="fad fa-stop-circle"/></button>
		</footer>
	);
}

function translateState(val: PossibleStates, def: string): string {
	switch (val) {
		case 'start':
			return 'started';
		case 'pause':
			return 'paused';
		case 'stop':
			return 'stopped';
		default:
			return val || def;
	}
}
