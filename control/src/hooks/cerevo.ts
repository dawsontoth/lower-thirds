import { BehaviorSubject } from 'rxjs';
import { useBehaviorSubject } from './base';

declare const io: any;

export type PossibleStates = 'start' | 'starting' | 'pause' | 'pausing' | 'stop' | 'stopping' | string;

const connecting = new BehaviorSubject<boolean>(false);
const connected = new BehaviorSubject<boolean>(false);
const error = new BehaviorSubject<string>('');
const state0 = new BehaviorSubject<PossibleStates>('');
const state1 = new BehaviorSubject<PossibleStates>('');
const still = new BehaviorSubject<string>('');

let deviceID: string;
let sessionID: string;
let socket: any;

export function connect(username: string, password: string) {
	if (!username || !password) {
		error.next('Please configure a username and password.');
		connecting.next(false);
		connected.next(false);
		return;
	}

	error.next('');
	connecting.next(true);
	post({ username, password, url: 'devices' })
		.then((response: any) => {
			if (response.result === 'ok'
				&& response.devices
				&& response.devices[0]) {
				deviceID = response.devices[0].deviceid;
			}
			else {
				console.error(response);
				error.next(response.message);
				connecting.next(false);
				connected.next(false);
			}
		})
		.then(() => {
			if (!deviceID) {
				return;
			}
			return post({ username, password, url: 'server', query: 'deviceid=' + deviceID });
		})
		.then((server: any) => {
			if (!server) {
				return;
			}
			if (server.result === 'ok'
				&& server.host
				&& server.port) {
				socket = io.connect('https://' + server.host, server);
				socket.on('connect', () => {
					sessionID = socket.socket.sessionid;
					post({
						username,
						password,
						url: 'connect',
						query: 'deviceid=' + deviceID + '&sessionid=' + encodeURIComponent(sessionID),
					})
						.then(resp => {
							// console.log(resp);
							error.next('');
							connecting.next(false);
							connected.next(true);
						});
				});
				socket.on('message', (data: string) => {
					const json = JSON.parse(data);
					// console.log(json);
					if (json['state,0'] !== undefined) {
						state0.next(json['state,0']);
					}
					if (json['state,1'] !== undefined) {
						state1.next(json['state,1']);
					}
					if (json['still'] !== undefined) {
						still.next(json['still']);
					}
					if (json['reason'] === 'override') {
						socket.disconnect();
						error.next('Control of device claimed elsewhere.');
						connecting.next(false);
						connected.next(false);
					}
				});
				socket.on('disconnect', () => {
					error.next('Socket disconnected!');
					connecting.next(false);
					connected.next(false);
				});
			}
			else {
				console.error(server);
				error.next(server.message);
				connecting.next(false);
				connected.next(false);
			}
		});
}

export function useConnected(): boolean {
	return useBehaviorSubject(connected)[0];
}

export function useConnecting(): boolean {
	return useBehaviorSubject(connecting)[0];
}

export function useError(): string {
	return useBehaviorSubject(error)[0];
}

export function useRecordingState(): string {
	return useBehaviorSubject(state0)[0];
}

export function useFacebookState(): string {
	return useBehaviorSubject(state1)[0];
}

export function usePauseImage(): string {
	return useBehaviorSubject(still)[0];
}

export function startRecording() {
	sendCommand('BOX_START', 0);
	state0.next('starting');
}

export function pauseRecording() {
	sendCommand('BOX_PAUSE', 0);
	state0.next('pausing');
}

export function stopRecording() {
	sendCommand('BOX_STOP', 0);
	state0.next('stopping');
}

export function startFacebook() {
	sendCommand('BOX_START', 1);
	state1.next('starting');
}

export function pauseFacebook() {
	sendCommand('BOX_PAUSE', 1);
	state1.next('pausing');
}

export function stopFacebook() {
	sendCommand('BOX_STOP', 1);
	state1.next('stopping');
}

export enum Image {
	SayingHi = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/LhilPMta6XiP/pause',
	Offering = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/7pDpLHfCDVhL/pause',
	TakingCommunion = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/TtzPtKGOe2jt/pause',
	WatchingAClip = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/HHoy-LZ0MvC-/pause',
	ThanksForTuningIn = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/uD5ccIyoxOAc/pause'
}

export function setPause(image: Image) {
	socket.send(JSON.stringify({
		command: 'BOX_SET_STILL',
		uid: deviceID,
		device_channel: 'all',
		value: null,
		url: image,
		x: 0,
		y: 0,
		p: 0,
		protocol: 'tcp',
		product: 'ub250',
		cmd_type: 'pause',
		_dst: sessionID,
		_channel: 'send_command',
	}));
	still.next(image);
}

function post({ username, password, url, query }:
				  { username: string, password: string, url: string, query?: string }) {
	return fetch('https://shell.cerevo.com/api/web/socket/' + url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		},
		body: 'mailaddr=' + encodeURIComponent(username)
			+ '&password=' + encodeURIComponent(password)
			+ (query ? '&' + query : ''),
	}).then((response) => response.json());
}

function sendCommand(command: string, value: number) {
	socket.send(JSON.stringify({
		command,
		device_channel: String(value),
		value: '',
		uid: deviceID,
		_dst: sessionID,
		_channel: 'send_command',
		product: 'ub250',
		protocol: 'tcp',
		cmd_type: 'basic',
	}));
}
