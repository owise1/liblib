var nano = require('nano');
var Q    = require('q');

var exp = {
  setup : setup,
  nano : nano
}

function setup(config){
  var d = Q.defer();

  nano = nano(config.couchdbUrl);

  function fin(){
    design(config)
    .then(function (cfg) {
      var theDb = nano.db.use('liblib')
      var dbq = {
        view : function(view, params){
          var d = Q.defer();
          var design;
          if(/\//.test(view)){
            design = view.split('/')[0];
            view = view.split('/')[1];

          } else {
            design = designDocName;
          }
          theDb.view(design, view, params, function(err, data){
            if(err){
              d.reject(err);
            } else {
              d.resolve(data);
            }
          });
          return d.promise;
        },
        fetch : Q.nbind(theDb.fetch, theDb),
        insert : Q.nbind(theDb.insert, theDb),
        list : Q.nbind(theDb.list, theDb),
        get : Q.nbind(theDb.get, theDb),
        destroy : Q.nbind(theDb.destroy, theDb)
      }
      var ret = {
        config : cfg,
        q : dbq 
      }
      d.resolve(ret)
    })
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



module.exports = exp 

