let background = document.getElementById('background'),
	atem = require('./atem');

try {
	au = require('autoit');
	au.Init();
	background.onclick = backgroundClicked;
}
catch (err) {
	console.error(err);
}

function backgroundClicked(evt) {
	let dx = evt.x / background.offsetWidth,
		dy = evt.y / background.offsetHeight;
	// Did they click on the preview or program?
	if (dx > 0.5) {
		let fade = dy < 0.5;
		// Then we need to cut or fade.
		if (fade) {
			atem.fade();
		}
		else {
			atem.cut();
		}
	}
	else {
		let rowOffset = 1 + (dy * 4 | 0) * 2,
			columnOffset = dx > 0.25 ? 1 : 0;
		let source = rowOffset + columnOffset;
		atem.switchInput(source);
	}
}
