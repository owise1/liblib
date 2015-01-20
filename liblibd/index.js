
var bouncy = require('bouncy');
var db     = require('./db.js');
var config = require('./config.js');

config
.then(db.setup)
.then(function(cfg){
  bouncy(function(req, res, bounce){
    bounce(cfg.couchdbPort);
  }).listen(cfg.liblibdPort);
  console.log('liblibd listening on port ' + cfg.liblibdPort);
})
.fail(function(err){
  console.log(err);
});
