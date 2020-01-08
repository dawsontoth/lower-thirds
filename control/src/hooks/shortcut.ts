import { Shortcut } from '../models/shortcut';

const latest: { [key: string]: undefined | (() => void) } = {};

window.onkeydown = onKeyDown;
window.onkeypress = onKeyPress;

export function bindLatestShortcut(shortcut: Shortcut | string, triggers: undefined | (() => void)) {
	latest[shortcut] = triggers;
}

function onKeyDown(evt: { key: string }) {
	if (evt.key === 'Escape') {
		tryInvoke(Shortcut.Escape);
		return false;
	}
}

function onKeyPress(evt: KeyboardEvent) {
	if (evt.key === 'Enter' || evt.key === 'Return') {
		tryInvoke(Shortcut.Enter);
		return false;
	}
	if (evt.altKey || evt.metaKey || evt.ctrlKey) {
		switch (evt.key) {
			case '':
			case 's':
				tryInvoke(Shortcut.CtrlS);
				return false;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				if (tryInvoke(evt.key)) {
					return false;
				}
				break;
			case '0':
				if (tryInvoke('10')) {
					return false;
				}
				break;
		}
	}
}

function tryInvoke(shortcut: Shortcut | string) {
	let toInvoke = latest[shortcut];
	if (toInvoke) {
		toInvoke();
		return true;
	}
	return false;
}
