let lowerThirds = document.getElementById('lower-thirds'),
	titleContents = document.getElementById('title-contents'),
	subtitleContents = document.getElementById('subtitle-contents'),
	ipc = require('electron').ipcRenderer,
	classList = lowerThirds.classList;

ipc
	.on('change', (evt, args) => {
		titleContents.innerText = args.title || '';
		subtitleContents.innerText = args.subtitle || '';
	})
	.on('in', () => {
		classList.remove('out');
		classList.add('in');
	})
	.on('out', () => {
		classList.remove('in');
		classList.add('out');
	})
;