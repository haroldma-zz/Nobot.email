var mongoose   = require('mongoose');
mongoose.connect(process.env.CUSTOMCONNSTR_MONGODB_CONN); // connect to the database

var Hashids = require("hashids"),
    hashids = new Hashids(process.env.SALT_HASHIDS),
Counter     = require('./models/counter'),
NobotEmail     = require('./models/email');

module.exports = {
  findBy: function (query, callback, errcallback) {
    NobotEmail.collection.findAndModify(query, [], { $inc: { views: 1 } },
      function(err, nobot) {
        if (err) return errcallback(err);
        callback(nobot);
    });
  },
  save: function(params, callback, errcallback) {
    //create a new email object
    var nobot = new NobotEmail();
    nobot.name = params.name;
    nobot.email = params.email;


    //first see if there is someone with that email
    //if yes, then return that url
    NobotEmail.findOne({ email : nobot.email }, function(err, existingNobot){
      if (!err && existingNobot){
        var id = hashids.encode(existingNobot._id);
        var path =  existingNobot.name || id;
        var url = 'http://nobot.email/' + (existingNobot.name ? 'n/' : 'h/') + path;
        var short_url = 'http://nbot.io/' + (existingNobot.name ? 'n/' : '') + path;
        callback({ link: url, short_link: short_url });
      }
      else {
        if (!nobot.name)
          saveNobot(nobot, callback, errcallback);

        //check if name is already taken
        else {
          NobotEmail.findOne({ name : nobot.name }, function(err, nobot){
            if (!err && !nobot)
            saveNobot(nobot, callback, errcallback);

            else
              errcallback({error: 'name already taken'});
          });
        }
      }
    });
  }
};

function saveNobot(nobot, callback, errcallback){
  //using auto inc ids to provide shorter urls
  //more overhead but works better for sharing on twt and whatnot
  Counter.increment('emails', function(err, id){
    if (err)
      errcallback(err);

    nobot._id = id.next;

    //save the nobot email
    nobot.save(function(err, nobot) {
      if (err)
        errcallback(err);

      var id = hashids.encode(nobot._id);
      var path =  nobot.name || id;

      // .io is a shorten url
      // .me is another one that will be use in the future for user
      var url = 'http://nobot.email/' + (nobot.name ? 'n/' : 'h/') + path;
      var short_url = 'http://nbot.io/' + (nobot.name ? 'n/' : '') + path;
      callback({ link: url, short_link: short_url });
    });
  });
}
