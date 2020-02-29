import React from 'react';
import {
    connect,
    pauseFacebook,
    pauseRecording,
    PossibleStates,
    startFacebook,
    startRecording,
    stopFacebook,
    stopRecording,
    useConnected,
    useConnecting,
    useError,
    useFacebookState,
    useRecordingState,
} from '../hooks/cerevo';
import { usePassword, useUsername } from '../hooks/credentials';
import './footer.scss';

export function Footer() {
    const connecting = useConnecting();
    const connected = useConnected();
    const error = useError();
    return (
        <footer>
            { !connected && !connecting && !error && <ConnectFooter/> }
            { connecting && <span className="connecting"><i className="fas fa-sync fa-spin"/></span> }
            { connected && <ConnectedFooter/> }
            { error && <span className="error">
				<i className="fal fa-exclamation-triangle"/>
                { error }
              <button className="inline" onClick={ () => window.location.reload() }>Reload</button>
			</span> }
        </footer>
    );
}

function ConnectFooter() {
    const [username, setUsername] = useUsername();
    const [password, setPassword] = usePassword();
    return (
        <>
            <input placeholder="Username" type="email" name="username" value={ username }
                   onChange={ e => setUsername(e.target.value) }/>
            <input placeholder="Password" type="password" name="password" value={ password }
                   onChange={ e => setPassword(e.target.value) }/>
            <button type="button"
                    className="connect"
                    onClick={ e => connect(username, password) }
                    disabled={ !username || !password }>
                <i className="fad fa-power-off"/> Connect
            </button>
        </>
    );
}

function ConnectedFooter() {
    const recordingState = useRecordingState();
    const facebookState = useFacebookState();
    return (
        <>
            <dt className={ 'first ' + recordingState }>SD Card</dt>
            <dd className={ 'first ' + recordingState }>{ translateState(recordingState) }</dd>
            <button type="button" className="start"
                    onClick={ startRecording }
                    disabled={ recordingState !== 'pause' && recordingState !== 'stop' }><i
                className="fad fa-play-circle"/></button>
            <button type="button" className="pause"
                    onClick={ pauseRecording }
                    disabled={ recordingState !== 'start' }><i
                className="fad fa-pause-circle"/></button>
            <button type="button" className="stop"
                    onClick={ stopRecording }
                    disabled={ recordingState !== 'pause' && recordingState !== 'start' }><i
                className="fad fa-stop-circle"/></button>

            <dt className={ 'second ' + facebookState }>Facebook</dt>
            <dd className={ 'second ' + facebookState }>{ translateState(facebookState) }</dd>
            <button type="button" className="start"
                    onClick={ startFacebook }
                    disabled={ facebookState !== 'pause' && facebookState !== 'stop' }><i
                className="fad fa-play-circle"/>
            </button>
            <button type="button" className="pause"
                    onClick={ pauseFacebook }
                    disabled={ facebookState !== 'start' }><i
                className="fad fa-pause-circle"/></button>
            <button type="button" className="stop"
                    onClick={ stopFacebook }
                    disabled={ facebookState !== 'pause' && facebookState !== 'start' }><i
                className="fad fa-stop-circle"/>
            </button>
        </>
    );
}

function translateState(val: PossibleStates): string {
    switch (val) {
        case 'start':
            return 'started';
        case 'pause':
            return 'paused';
        case 'stop':
            return 'stopped';
        default:
            return val;
    }
}
