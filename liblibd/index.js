var http            = require('http')
var Q               = require('q')
var httpProxy       = require('http-proxy')
var R               = require('ramda')
var db              = require('./db.js')
var config          = require('./config.js')
var isCaptivePortal = require('./lib/captive-portal.js')

var cfg, dbq

var proxy = httpProxy.createProxyServer({})
proxy.on('proxyReq', function(proxyReq, req, res, options) {
})

config
.then(db.setup)
.then(function (configObj) {
  return configObj.config.scan ? require('./lib/scanner.js')(configObj) : Q(configObj)
})
.then(function(configObj){
  cfg = configObj.config
  dbq = configObj.q

  /*
   * If a "liblib app" has a rewrite called dialog, then it wants
   * a captive portal dialog
   *
   * TODO:
   * Ideally, when the "app" is installed it could use a hook
   * to do this
   */
  return dbq.list({ startkey : '_design', endkey : '_design/{' })

})
.then(function (couchRes) {
  if (couchRes[0].rows.length > 0) {
    return dbq.fetch({ keys : R.pluck('id', couchRes[0].rows) })
    .then( function (couchRes) {
      return couchRes[0].rows.filter(function (row) {
        return row.doc.rewrites && R.contains('dialog', R.pluck('from', row.doc.rewrites))
      }).length > 0
    })
  } else {
    return Q.fcall(function () { return false })
  }
})
.then( function (hasDialog) {
  var server = http.createServer(function(req, res) {

    if (hasDialog && !/liblib/.test(req.headers.host) && isCaptivePortal(req)) {
      res.writeHead(301, { Location : 'http://liblib.com/dialog' })
      return res.end()
    }
    proxy.web(req, res, {
      target: 'http://127.0.0.1:' + cfg.couchdbPort
    })
  }).listen(cfg.liblibdPort)
  console.log('liblibd listening on port ' + cfg.liblibdPort)
})

.fail(function(err){
  console.log(err)
});
