let background = document.getElementById('background'),
	au;

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
		dy = evt.y / background.offsetHeight,
		title = 'ATEM Production Studio 4K',
		text = '',
		control = null;
	// Did they click on the preview or program?
	if (dx > 0.5) {
		let fade = dy < 0.5;
		// Then we need to cut or fade.
		au.ControlSend(title, text, control, fade ? '{ENTER}' : '{SPACE}');
	}
	else {
		let rowOffset = 1 + (dy * 4 | 0) * 2,
			columnOffset = dx > 0.25 ? 1 : 0;
		let source = rowOffset + columnOffset;
		au.ControlSend(title, text, control, String(source));
	}
}
