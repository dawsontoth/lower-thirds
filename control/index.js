let userTyped = document.getElementById('user-typed'),
	fs = require('fs'),
	Fuse = require('fuse.js'),
	ipc = require('electron').ipcRenderer,
	au = require('autoit');

au.Init();

let names = fs.readFileSync('data/names.txt', 'UTF-8').split('\n'),
	chapters = fs.readFileSync('data/chapters.txt', 'UTF-8').split('\n'),
	allPossibilities = names.concat(chapters).map(l => l.trim()).filter(l => l);

let fuse = new Fuse(
	allPossibilities,
	{
		shouldSort: true,
		includeMatches: true,
		threshold: 0.7,
		location: 0,
		distance: 50,
		maxPatternLength: 32,
		minMatchCharLength: 1
	}
);

let isOn = false,
	showWebCam = true,
	entry = '',
	parsed = '',
	background = document.getElementById('background'),
	video = document.getElementsByTagName('video')[0];

background.onclick = backgroundClicked;
window.onkeydown = onKeyDown;
window.onkeypress = onKeyPress;

if (showWebCam && navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices.enumerateDevices()
		.then(devices => {
			for (let i = 0; i < devices.length; i++) {
				let device = devices[i];
				if (device.kind === 'videoinput'
					&& device.label.indexOf('MiraBox Video Capture') === 0) {
					return device.deviceId;
				}
			}
		})
		.then(deviceId => {
			if (deviceId) {
				return navigator.mediaDevices.getUserMedia({
					video: {
						deviceId: {
							exact: deviceId
						},
						width: { ideal: 1920 },
						height: { ideal: 1080 }
					}
				});
			}
		})
		.then(stream => {
			if (stream) {
				video.srcObject = stream;
			}
		})
		.catch(err => {
			console.error(err);
		});
}

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
		bookNumberFinder = /^(\d)([a-z])/i,
		// TODO: Need to support complex references like 2:1, 3:1
		referenceFinder = / ?(\d+):?([-,\da-h ]*)$/i;
	if (referenceFinder.test(search)) {
		reference = search.match(referenceFinder);
		search = search.replace(referenceFinder, '');
	}
	if (bookNumberFinder.test(search)) {
		search = search.replace(bookNumberFinder, '$1 $2');
	}
	let results = fuse.search(search);
	if (search.indexOf('/') === -1 && results.length) {
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

function backgroundClicked(evt) {
	let dx = evt.x / background.offsetWidth,
		dy = evt.y / background.offsetHeight,
		title = 'ATEM',
		control = '';
	// Did they click on the preview or program?
	if (dx > 0.5) {
		let fade = dy < 0.5;
		// Then we need to cut or fade.
		au.ControlSend(title, '', control, fade ? '{ENTER}' : '{SPACE}');
	}
	else {
		let rowOffset = 1 + (dy * 4 | 0) * 2,
			columnOffset = dx > 0.25 ? 1 : 0;
		let source = rowOffset + columnOffset;
		au.ControlSend(title, '', control, String(source));
	}
}