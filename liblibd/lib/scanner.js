/**
 * Scans networks for liblibs. Connects to them
 */
var exec = require('child_process').exec

var qexec = function (command) {
  var d = Q.defer()
  exec(command, function (err, stdout) {
    if (err) return d.reject(err)
    d.resolve(stdout)
  })
  return d.promise
}

var Q = require('q')
var R = require('ramda')
var Wireless = require('wireless')

var thereIsOne = R.compose(R.lt(0), R.length) 

function shutdownAP () {
  var d = Q.defer()


  exec("sudo service hostapd stop", function (err) {
    exec("sudo service dnsmasq stop", function (err) {
      exec("sudo ifconfig wlan0 0.0.0.0 0.0.0.0", function (err) {
        d.resolve()
      })
    })
  })
  return d.promise
}

function startAP () {
  return qexec("sudo service dnsmasq start")
  .then(function () {
    return qexec("sudo service hostapd start")
  })
  .then(function () {
    return qexec("sudo ifconfig wlan0 192.168.42.1 255.255.255.0")
  })
}

module.exports = function (configObj) {
  var d = Q.defer()
  var isConnected = false
  
  var wireless = new Wireless({
    ifrace : 'wlan0',
    updateFrequency : 10,
  })
  wireless.enable(function (err) {
    wireless.start()
    d.resolve(configObj)
  })
  wireless.on('appear', function (network) {
    function isLiblib (network) {
      return(/lib/.test(network.ssid) && !network.encryption_any)
    }
    var liblibs = R.compose(R.filter(isLiblib), R.values)(wireless.list())
    if (!isConnected && thereIsOne(liblibs)) {
      isConnected = true
      shutdownAP()
      .then(function () {
        console.log('connecting to...' + network.ssid)
        wireless.join(liblibs[0], '', function (err, what){
          wireless.dhcp()
        })
      })
    }
  })
  wireless.on('command', function (what) {
    //console.log('command: ' + what)
  })
  wireless.on('join', function (network) {
    console.log('join')
    console.log(network)
    wireless.stop()
  })
  wireless.on('leave', function (network) {
    wireless.dhcpStop()

    startAP()
    .then(wireless.start)
  })
  wireless.on('error', console.log) 

  return d.promise
}
