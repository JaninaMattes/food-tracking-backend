const fetch = require('node-fetch');

var startupCheck = {};

function checkAvailable(services, callback) {
    callback = callback;
    services.forEach(url => {
        startupCheck[url] = false;
    });
    services.forEach(url => {
        check(url, callback);
    });
}

function check(url, callback) {
    fetch(url + "/.well-known/apollo/server-health")
        .then(response => {
            if (response.status == 200) {
                setHealthy(url, callback);
            } else {
                setTimeout(() => check(url, callback), 4000);
            }
        }).catch(err => {
            setTimeout(() => check(url, callback), 4000);
        })
}

function setHealthy(url, callback) {
    startupCheck[url] = true;
    let result = true;
    for (service in startupCheck) {
        if (startupCheck[service] == false) {
            result = false;
            break;
        }
    }
    if (result) {
        console.log("All services are ready!")
        callback();
        startupCheck = { 1: false }
    } else {
        console.log("waiting", startupCheck);
    }
}

module.exports = checkAvailable;