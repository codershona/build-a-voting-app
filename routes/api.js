var express = require('express');
var router = express.Router({ caseSensitive: true });
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

// var Polls = require('../models/polls');
var Poll = require('../models/polls');

// Create a new poll & POST to polls:


router.post('/polls', authenticate, function(request, response) {
    
 // needs changes
 // console.log('in post polls');

 if(!request.body.poll) {

   return response.status(400).send('Noo Poll Data Found!');


 }
  
  var poll = new Poll();
  poll.name = request.body.poll.name;
  poll.options = request.body.poll.options;
  var token = request.headers.authorization.split(' ')[1];
  

})


// Verification:

// router.get('/verify', function(request, response) {
router.post('/verify', function(request, response) {
  // if(request.headers.authorization)
  // console.log(request.headers);
  // var token = request.headers.authorization.split(' ')[1];
  // var token = request.headers.authorization;
  // var token = request.headers

  // console.log('token' + token);
  // console.log(token);

  // console.log(request.body.token);

  if(!request.body.token) {
    return response.status(400).send('No token has been provided!')
  }

  jwt.verify(request.body.token, process.env.secret, function(err, decoded) {
     if(err) {

      return response.status(400).send('Error with Token')

     }

     return response.status(200).send(decoded)
  })



})

// Login :
router.post('/login', function(request, response) {

  if(request.body.name && request.body.password) {
    User.findOne({ name: request.body.name }, function(err, user) {
      if(err) {
        console.log('err with database')
        return response.status(400).send('An error has occured. Please try again');

      }
       if(!user) {
        console.log('no user found')
        return response.status(404).send('No user has been registered with these credentials');

       }

       if(bcrypt.compareSync(request.body.password, user.password)) {
        
        console.log('pasword match')
        var token = jwt.sign({
          data: user

        }, process.env.secret, { expiresIn: 3600 })
        // return response.status(200).send(user);
         return response.status(200).send(token);

       }
       console.log('invalid password')

       return response.status(400).send('Password is not correct!');


    })

  }
  else {
    return response.status(400).send('Please Enter valid credentials!');
  }

});

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

// Authentication middleware:

function authenticate(request, response, next) {
  console.log('in authentication middleware');
  // console.log(request.headers.authentication);
  console.log(request.headers);
  

  if(!request.headers.authorization) {
    return response.status(400).send('No token supplied')

  }

  if(request.headers.authorization.split(' ')[1]) {
    var token = request.headers.authorization.split(' ')[1]

    jwt.verify(token, process.env.secret, function(err, decoded) {
      if(err) {
        console.log('error with token');
        return response.status(400).send(err)

      }

      console.log('continuing with middleware chain!')

      next();


    })

  }


};




module.exports = router;




