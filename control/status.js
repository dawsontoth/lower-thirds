let cp = require('mz/child_process'),
    fetch = require('node-fetch'),
    async = require('async');

const TEN_MEGA_BYTE = 1024 * 1024 * 10;
const ONE_MINUTE = 60 * 1000;
const options = {
    maxBuffer: TEN_MEGA_BYTE,
    timeout: ONE_MINUTE
};

let status = document.getElementById('status');
let cerevoIP;
let scanning = false;
let recording = false;
status.onclick = onToggleStatus;
setInterval(ensureConnected, 2000);

function ensureConnected() {
    if (cerevoIP) {
        hit(cerevoIP).catch(err => {
            status.classList.remove('connected');
            status.classList.remove('recording');
            cerevoIP = null;
        });
    }
    else if (!scanning) {
        scan();
    }
}

function scan() {
    scanning = true;
    cp.exec('arp -a', options)
        .then(data => {
            const ips = String(data).match(/10\.3\.\d{1,3}\.\d{1,3}/g);
            async.eachLimit(
                ips,
                10,
                async ip => {
                    if (await test(ip)) {
                        // No error thrown? Then we connected!
                        cerevoIP = ip;
                        status.classList.add('connected');
                        throw new Error('Stop trying to connect to others');
                    }
                },
                () => {
                    return scanning = false;
                });
        })
        .catch(err => {
            scanning = false;
        });
}

function onToggleStatus() {
    if (!recording) {
        status.classList.add('recording');
        hit(cerevoIP, '?start,0');
    }
    else {
        hit(cerevoIP, '?stop,0');
    }
}

function test(ip) {
    return hit(ip)
        .then(json => json && json.uid)
        .catch(err => false);
}

function hit(ip, payload) {
    return fetch(`http://${ip}:11250/status${payload || ''}`)
        .then(res => res && res.json && res.json())
        .then(json => {
            recording = !!json && !!json['bitrate,0'];
            if (recording) {
                status.classList.add('recording');
            }
            else {
                status.classList.remove('recording');  
            }
            return json;
        });
}