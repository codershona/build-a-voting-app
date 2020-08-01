var express = require('express');
var router = express.Router({ caseSensitive: true });
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

// Register:

router.post('/register', function(request, response) {
   // console.log(request.body);
   if(request.body.name && request.body.password) {
     var user = new User();
     user.name = request.body.name;
     // console.timeStart('bcryptHashing');
     console.time('bcryptHashing');

     user.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10))
     console.timeEnd('bcryptHashing');
      user.save(function(err, document) {
      	if(err) {
      		return response.status(400).send(err)
      	}
      	else {
      		// return response.status(201).send(document)
      		var token = jwt.sign({
      			data: document
      		}, process.env.secret, { expiresIn: 3600 })
      		return response.status(201).send(token);
      		
      	}
      })
      

   }
   else {
   	return response.status(400).send({
   		message: 'Invalid Credentials Supplied!'
   	})
   }

});




module.exports = router;




