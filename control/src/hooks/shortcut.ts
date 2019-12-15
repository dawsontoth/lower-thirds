import { Shortcut } from '../models/shortcut';

const latest:{ [key:string]:undefined | (() => void) } = {};

window.onkeydown = onKeyDown;
window.onkeypress = onKeyPress;

export function bindLatestShortcut(shortcut:Shortcut, triggers:undefined | (() => void)) {
	latest[shortcut] = triggers;
}

function onKeyDown(evt:{ key:string }) {
	if (evt.key === 'Escape') {
		tryInvoke(Shortcut.Escape);
		return false;
	}
}

function onKeyPress(evt:{ key:string, metaKey:boolean, ctrlKey:boolean }) {
	if (evt.key === 'Enter' || evt.key === 'Return') {
		tryInvoke(Shortcut.Enter);
		return false;
	}
	else if ((evt.metaKey || evt.ctrlKey) && evt.key === 's') {
		tryInvoke(Shortcut.CtrlS);
		return false;
	}
}

function tryInvoke(shortcut:Shortcut) {
	let toInvoke = latest[shortcut];
	if (toInvoke) {
		toInvoke();
	}
}
