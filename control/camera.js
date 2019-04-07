let video = document.getElementsByTagName('video')[0];

navigator.mediaDevices.enumerateDevices()
	.then(devices => {
		for (let i = 0; i < devices.length; i++) {
			let device = devices[i];
			if (device.kind === 'videoinput'
				&& device.label.indexOf('MiraBox Video Capture') === 0
			) {
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
