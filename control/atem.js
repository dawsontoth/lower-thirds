let au;

let title = 'ATEM Production Studio 4K',
    text = '',
    control = null;

try {
	au = require('autoit');
	au.Init();
}
catch (err) {
	console.error(err);
}

exports.switchInput = switchInput;
exports.cut = cut;
exports.fade = fade;

function switchInput(source) {
    au.ControlSend(title, text, control, String(source));
}

function cut() {
    au.ControlSend(title, text, control, '{SPACE}');
}

function fade() {
    au.ControlSend(title, text, control, '{ENTER}');
}
