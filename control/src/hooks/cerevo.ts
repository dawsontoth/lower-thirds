import { BehaviorSubject } from 'rxjs';
import { password, username } from '../credentials';
import { useBehaviorSubject } from './base';

declare const io: any;

export type PossibleStates = 'start' | 'starting' | 'pause' | 'pausing' | 'stop' | 'stopping' | string;

const connected = new BehaviorSubject<boolean>(false);
const state0 = new BehaviorSubject<PossibleStates>('');
const state1 = new BehaviorSubject<PossibleStates>('');
const still = new BehaviorSubject<string>('');

let deviceID: string;
let sessionID: string;
let socket: any;

function post(url: string, query?: string) {
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

if (username && password) {
	post('devices')
		.then((response: any) => {
			if (response.result === 'ok'
				&& response.devices
				&& response.devices[0]) {
				deviceID = response.devices[0].deviceid;
			} else {
				console.error(response);
			}
		})
		.then(() => {
			if (!deviceID) {
				return;
			}
			return post('server', 'deviceid=' + deviceID);
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
					post('connect', 'deviceid=' + deviceID +
						'&sessionid=' + encodeURIComponent(sessionID))
						.then(resp => {
							// console.log(resp);
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
				});
				socket.on('disconnect', () => console.error('disconnected'));
			} else {
				console.error(server);
			}
		});
}

export function useConnected(): boolean {
	return useBehaviorSubject(connected)[0];
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

function sendCommand(command: string, value: number) {
	socket.send(JSON.stringify({
		command,
		value,
		uid: deviceID,
		_dst: sessionID,
		_channel: 'send_command',
		protocol: 'tcp',
		cmd_type: 'basic',
	}));
}

export enum Image {
	SayingHi = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/jqdkhKXG5wgh/pause',
	TakingCommunion = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/4EX3QJDgMIBQ/pause',
	WatchingAClip = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/zht6_Hv6efh_/pause',
	ThanksForTuningIn = 'http://s3-ap-northeast-1.amazonaws.com/live-shell/pause/HLkNuGYUwnCu/pause'
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
