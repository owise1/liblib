var nano = require('nano');
var Q    = require('q');


function setup(config){
  var d = Q.defer();

  nano = nano(config.couchdbUrl);

  function fin(){
    design(config)
    .then(d.resolve);
  }

  nano.db.get('liblib', function(err, body){
    if(err){
      nano.db.create('liblib', function(err, body){
        if(err){
          d.reject(new Error("couchDB problem: " + err));
        } else {
          fin();
        }
      });
    } else {
      fin();
    }
  });
  return d.promise;
}

function design(config){
  var d = Q.defer();
  nano.db.use(config.dbName).insert({
    views : {
      all : {
        map : function(doc){
          emit(doc.id);
        }
      }
    },
    lists : {
      ul : function (head, req) {
        provides('html', function(){
          html = "<html><body><ul>\n";
          while (row = getRow()) {
              html += "<li>" + row.key + ":" + row.value + "</li>\n";
          }   
          html += "</ul></body></head>";
          return html;
        });
      }
    }
  }, '_design/liblib', function (err, res) {
    d.resolve(config);
  });
  return d.promise;
}


module.exports = {
  setup : setup,
  nano : nano
}



