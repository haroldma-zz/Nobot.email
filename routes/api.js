/*
 * Serve JSON to our AngularJS client
 */

var Hashids = require('hashids'),
hashids = new Hashids(process.env.SALT_HASHIDS),
emailRepository = require('../app/emailRepository'),
Recaptcha = require('recaptcha').Recaptcha;


//verify captcha
exports.captcha = function (req, res) {
  var data = req.body;

  var captcha = {
    remoteip : req.connection.remoteAddress,
    response : data.response,
    challenge : data.challenge
  };

  var recaptcha = new Recaptcha(process.env.CAPTCHA_PUBLIC, process.env.CAPTCHA_PRIVATE, captcha);

  recaptcha.verify(function(success, error_code) {
      if (success) {
        var query;

        //get email using id
        if (data.id) {
          //dehash id
          var emailId =  parseInt(hashids.decode(data.id));
          if (emailId)
            query = { _id : emailId };
          else
            res.status(400).send({error:'invalid id'});
        }

        //get email using the name
        else if (data.name) {
          query = { name : data.name };
        }

        //no id paseed
        else
          res.status(400).send({error : 'no id passed'});

        emailRepository.findBy(query, function (nobot){
          if (nobot)
            res.json(nobot);
          else //not found
            res.send(404);
        },
        function (err){
            res.status(500).sent({error : err});
        });
      }
      else {
          res.status(400).send({error : 'invalid captcha, try again' });
      }
  });
};

exports.newEmail = function (req, res) {
  var nobotEmail = req.body;

  if (!nobotEmail)
    res.send(400);

  var reName = /^[a-zA-Z0-9-_]+$/;
  var atpos = nobotEmail.email.indexOf("@");
  var dotpos = nobotEmail.email.lastIndexOf(".");

  if (nobotEmail.name && !reName.test(nobotEmail.name))
    res.status(400).send({error : 'invalid name'});

  else if (atpos< 1 || dotpos<atpos+2 || dotpos+2>= nobotEmail.email.length) {
    res.status(400).send({error : 'invalid email'});
  }
  else {
    nobotEmail.email = nobotEmail.email.trim();
    if (nobotEmail.name)
      nobotEmail.name = nobotEmail.name.trim();

    emailRepository.save(nobotEmail,
    function (data){
      //success
      res.json(data)
    },
    function(err){
      //error
      res.status(400).json(err);
    });
  }
};
