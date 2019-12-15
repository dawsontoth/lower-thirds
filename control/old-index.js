let ipc = require('electron').ipcRenderer,
	suggest = require('./suggest'),
	store = new (require('../lib/store'))('presets');

let userTyped = document.getElementById('user-typed'),
	clear = document.getElementById('clear');

let isOn = false,
	showingPreset = null,
	editingPreset = null,
	editingPresetAt = null,
	presets = store.get('presets', {}),
	entry = '',
	parsed = '';

window.onkeydown = onKeyDown;
window.onkeypress = onKeyPress;
clear.onclick = onClear;

let input = document.getElementById('input');
for (let i = 0; i < 16 - 2; i++) {
	let savedPreset = document.createElement('div');
	savedPreset.classList.add('saved-preset');
	savedPreset.onclick = () => onShow(savedPreset, i);
	savedPreset.oncontextmenu = () => onEdit(savedPreset, i);
	savedPreset.innerHTML = presets[i] || '';
	input.appendChild(savedPreset);
}

function onKeyDown(evt) {
	if (evt.key === 'Escape') {
		onClear();
	}
	else if (evt.key === 'Backspace' && entry) {
		entry = entry.slice(0, -1);
	}
	parse();
}

function onKeyPress(evt) {
	if (evt.key === 'Enter' || evt.key === 'Return') {
		if (editingPreset) {
			let preset = editingPreset;
			if (!parsed) {
				delete presets[editingPresetAt];
			}
			else {
				presets[editingPresetAt] = parsed;
			}
			store.set('presets', presets);
			cancelEdit();
			cleanState();
			preset.classList.add('active');
			setTimeout(() => preset.classList.remove('active'), 100);
		}
		else if (entry) {
			showText(parsed);
		}
	}
	else if (evt.key.length === 1 && /[-,: \/A-Z\d]/i.test(evt.key)) {
		entry += evt.key;
	}
	parse();
	return false;
}

function showText(text) {
	isOn = true;
	let parts = text && text.split('/');
	ipc.send('change', {
		title: (parts[0] || '').trim(),
		subtitle: (parts[1] || '').trim(),
	});
	ipc.send('in');
	syncClearStyling();
}

function cleanState() {
	cancelEdit();
	if (isOn) {
		isOn = false;
		ipc.send('out');
	}
	if (entry) {
		entry = '';
		parse();
	}
	if (showingPreset) {
		showingPreset.classList.remove('active');
		showingPreset = null;
	}
	syncClearStyling();
}

function onClear() {
	cleanState();
	clear.classList.add('active');
	setTimeout(() => clear.classList.remove('active'), 100);
}

function cancelEdit() {
	if (editingPreset) {
		editingPreset.classList.remove('editing');
		editingPreset.innerHTML = presets[editingPresetAt] || '';
		parsed = '';
		editingPreset = null;
		editingPresetAt = null;
	}
}

function onShow(elem, i) {
	cleanState();
	if (presets[i]) {
		showingPreset = elem;
		showingPreset.classList.add('active');
		showText(presets[i]);
	}
	syncClearStyling();
}

function onEdit(elem, i) {
	cleanState();
	editingPreset = elem;
	editingPreset.classList.add('editing');
	editingPresetAt = i;
}

function syncClearStyling() {
	if (isOn) {
		clear.classList.add('on-deck');
	}
	else {
		clear.classList.remove('on-deck');
	}
}

function parse() {
	let response = suggest(entry);
	parsed = response.text;
	let target = editingPreset || userTyped;
	target.innerHTML = response.html;
}
