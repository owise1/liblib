var nano = require('nano');
var Q    = require('q');


function setup(config){
  var d = Q.defer();

  nano = nano(config.couchdbUrl);

  nano.db.get('liblib', function(err, body){
    if(err){
      nano.db.create('liblib', function(err, body){
        if(err){
          d.reject(new Error("couchDB problem: " + err));
        } else {
          d.resolve(config);
        }
      });
    } else {
      d.resolve(config);
    }
  });
  return d.promise;
}


module.exports = {
  setup : setup,
  nano : nano
}



