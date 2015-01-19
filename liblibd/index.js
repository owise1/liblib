var fs   = require('fs');
var path = require('path');

var R      = require('ramda');
var bouncy = require('bouncy');
var nano   = require('nano');

var config = {
  couchdbPort : 5984,
  liblibdPort : 3000,
  couchdbUrl  : 'http://localhost:5984'
}

// config.js need not exist
fs.stat(path.normalize(__dirname + '/config.js'), function(err, stat){
  if(!err){
    config = R.mixin(config, require('./config.js'));  
  } 
  nano = nano(config.couchdbUrl);

  function bounce(){
    bouncy(function(req, res, bounce){
      bounce(config.couchdbPort);
    }).listen(config.liblibdPort);
    console.log('liblibd listening on port ' + config.liblibdPort);
  }

  nano.db.get('liblib', function(err, body){
    if(err){
      nano.db.create('liblib', function(err, body){
        if(err){
          throw new Error("couchDB problem: " + err);
        } else {
          bounce();
        }
      });
    } else {
      bounce();
    }
  });
});




