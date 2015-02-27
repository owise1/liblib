var http      = require('http');
var httpProxy = require('http-proxy');
var db        = require('./db.js');
var config    = require('./config.js');


config
.then(db.setup)
.then(function(cfg){
  var proxy = httpProxy.createProxyServer({});
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
  });
  var server = http.createServer(function(req, res) {
    proxy.web(req, res, {
      target: 'http://127.0.0.1:' + cfg.couchdbPort
    });
  }).listen(cfg.liblibdPort);
  console.log('liblibd listening on port ' + cfg.liblibdPort);
})
.fail(function(err){
  console.log(err);
});
