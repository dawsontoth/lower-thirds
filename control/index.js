let userTyped = document.getElementById('user-typed'),
	fs = require('fs'),
	Fuse = require('fuse.js'),
	ipc = require('electron').ipcRenderer;

let names = fs.readFileSync('data/names.txt', 'UTF-8').split('\n'),
	chapters = fs.readFileSync('data/chapters.txt', 'UTF-8').split('\n'),
	allPossibilities = names.concat(chapters).map(l => l.trim()).filter(l => l);

let fuse = new Fuse(
	allPossibilities,
	{
		shouldSort: true,
		includeMatches: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1
	}
);

let isOn = false,
	entry = '',
	parsed = '';

window.onkeydown = onKeyDown;
window.onkeypress = onKeyPress;

function onKeyDown(evt) {
	if (evt.key === 'Escape') {
		if (entry) {
			entry = '';
		}
		else if (isOn) {
			isOn = false;
			ipc.send('out');
		}
	}
	else if (evt.key === 'Backspace' && entry) {
		entry = entry.slice(0, -1);
	}
	parse();
}

function onKeyPress(evt) {
	if ((evt.key === 'Enter' || evt.key === 'Return') && entry) {
		entry = '';
		isOn = true;
		let parts = parsed && parsed.split('/');
		ipc.send('change', {
			title: (parts[0] || '').trim(),
			subtitle: (parts[1] || '').trim()
		});
		ipc.send('in');
	}
	else if (evt.key.length === 1 && /[-,: \/A-Z\d]/i.test(evt.key)) {
		entry += evt.key;
	}
	parse();
	return false;
}

function parse() {
	if (!entry) {
		parsed = '';
		userTyped.innerHTML = '';
		return '';
	}
	let search = entry,
		reference = '',
		// TODO: Need to support complex references like 2:1, 3:1
		referenceFinder = / ?(\d+):?([-,\da-h ]*)$/i;
	if (referenceFinder.test(search)) {
		reference = search.match(referenceFinder);
		search = search.replace(referenceFinder, '');
	}
	let results = fuse.search(search);
	if (results.length) {
		let match = results[0].matches[0],
			value = match.value,
			html = value;
		for (let i = match.indices.length - 1; i >= 0; i--) {
			let index = match.indices[i];
			html = `${html.slice(0, index[0]) || ''}<em>${html.slice(index[0], index[1] + 1)}</em>${html.slice(index[1] + 1) || ''}`
		}
		let suffix = (value && reference ? ' / ' : '')
			+ (reference ? reference[1] + (reference[2] ? ':' : '') + reference[2] : '');
		parsed = value + suffix;
		userTyped.innerHTML = html + suffix;
	}
	else {
		parsed = entry;
		userTyped.innerHTML = entry;
	}
}