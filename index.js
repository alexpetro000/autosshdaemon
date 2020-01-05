#!/usr/bin/env node

const request = require('request');
const autossh = require('autossh');
const fs = require('fs');

const port = +fs.readFileSync('/boot/port', 'utf8').trim() || Math.floor(Math.random() * 950 + 40050);
console.log('PORT: ', port);

let postPublicKey_once = false;

autossh({
    host: 'd.qtech.pw',
    username: 'sshtun',
    localPort: 22,
    remotePort: port,
    reverse: true,
    serverAliveInterval: 10,
    serverAliveCountMax: 2
})
.on('error', err => {
    console.log('ERROR: ', err);

    if(!postPublicKey_once) {
        postPublicKey_once = true;

        console.log('Trying to post public key to server...');
        postPublicKey();
    }
})
.on('connect', connection => {
    console.log('connection pid: ' + connection.pid);
});

function postPublicKey() {
    var req = request.post('http://d.qtech.pw/remote', (err, resp, body) => {
        if (err) {
            console.log('Error!');
        } else {
            console.log('URL: ' + body);
        }
    });
    var form = req.form();
    form.append('file', '<FILE_DATA>', {
        filename: '/home/pi/.ssh/id_rsa/id_rsa.pub',
        contentType: 'text/plain'
    });
}
