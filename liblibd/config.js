var fs   = require('fs');
var path = require('path');

var Q = require('q');
var R = require('ramda');

var couchdbPort = 5984;

var config = {
  couchdbPort : couchdbPort,
  liblibdPort : 3000,
  couchdbUrl  : 'http://localhost:' + couchdbPort,
  dbName      : 'liblib'
}

var d = Q.defer();

// config-local.js need not exist
fs.stat(path.normalize(__dirname + '/config-local.js'), function(err, stat){
  if(!err){
    config = R.mixin(config, require('./config-local.js'));  
  } 
  d.resolve(config);
});


module.exports = d.promise;
