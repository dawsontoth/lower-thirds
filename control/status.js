let cp = require('mz/child_process'),
    fetch = require('node-fetch'),
    async = require('async'),
    store = require('../lib/store'),
    ip = require('ip'),
    os = require('os'),
    net = require('net');

let options = {
    maxBuffer: 1024 * 1024 * 10,
    timeout: 60 * 1000
};

let status = document.getElementById('status'),
    cerevoIP = store.get('last-cerevo-ip', null),
    scanning = false,
    recording = false;

Promise.all(getServers().map(pingServer));
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
            const ips = String(data).match(/10\.3\.\d{1,3}\.\d{1,3}/g).sort().reverse();
            console.log(ips);
            async.eachLimit(
                ips,
                10,
                async ip => {
                    if (await test(ip)) {
                        // No error thrown? Then we connected!
                        cerevoIP = ip;
                        store.set('last-cerevo-ip', cerevoIP);
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

function getServers() {
    var interfaces = os.networkInterfaces();
    var result = [];

    for (var key in interfaces) {
        var addresses = interfaces[key];
        for (var i = addresses.length; i--;) {
            var address = addresses[i];
            if (address.family === 'IPv4' && !address.internal) {
                var subnet = ip.subnet(address.address, address.netmask);
                var current = ip.toLong(subnet.firstAddress);
                var last = ip.toLong(subnet.lastAddress) - 1;
                while (current++ < last) {
                    result.push(ip.fromLong(current));
                }
            }
        }
    }

    return result
}

function pingServers() {
    return Promise.all(servers.map(pingServer));
}

function pingServer(address) {
    return new Promise(function (resolve) {
        var socket = new net.Socket();
        socket.setTimeout(1000, close);
        socket.connect(80, address, close);
        socket.once('error', close);

        function close() {
            socket.destroy();
            resolve(address);
        }
    });
}
