var path       = require('path'),
    utils      = require('../utils'),
    errors     = require('../errors'),
    custom     = require('../custom'),
    blacklist  = require('../blacklist'),
    scripts    = require('../../scripts.json'),
    Observable = utils.Observable;
module.exports = Observable.extend({
  constructor: function APIHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    this.helpers = sandbox.helpers;
    this.mailer = sandbox.mailer;

    // For now we bind all methods to the class scope. In reality only those
    // used as route callbacks need to be bound.
    var methods = Object.getOwnPropertyNames(APIHandler.prototype).filter(function (prop) {
      return typeof this[prop] === 'function';
    }, this);

    utils.bindAll(this, methods);
  },
  createUrl: function(req,res,next){
    this.models.bin.createUrl(function (err,result) {
      if (err) {
        return next(err);
      }
      res.json({bin_id:result.url});
    });
  },
  openUrl : function(req,res,next){

        this.models.bin.set_status(1,req.params.url,function(err){
            if(err){
                res.send("Unable to open the url");
            }
            else{
                res.send("Url opened");
            }
        });
  },

  closeUrl: function(req,res,next){
       this.models.bin.set_status('0',req.params.url,function(err){
        if(err){
            res.send("Unable to close the url");
            console.log(err);
        }else{
              res.send("Success");
            
        }
       });
  },
  is_edit_allowed: function(req,res,next){

    function notAllowed(){
      next(new errors.NotAuthorized());
    }
    this.models.bin.get_status(req.params.bin,function(err,result){
      if(err){
        next();
      }
      else if(result!='1'){
        return notAllowed();
      }
      next();
    });
  }
});