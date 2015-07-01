/**
 * Scans networks for liblibs. Connects to them
 */
var Q = require('q')
var Wireless = require('wireless')

module.exports = function (configObj) {
  var d = Q.defer()
  
  try {
    var wireless = new Wireless({
      ifrace : 'wlan0',
      updateFrequency : 10,
    })
    wireless.enable(function (err) {
      wireless.start()
      console.log(wireless.list())
      d.resolve(configObj)
    })
    wireless.on('appear', function (network) {
      console.log('appear:' + network.ssid)
    })
    wireless.on('error', console.log) 

  } catch(err) {
    console.log(err)
  }
  return d.promise
}
