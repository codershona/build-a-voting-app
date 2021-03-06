(function() {

   var app = angular.module('app', ['ngRoute', 'angular-jwt']);

   app.run(function($http, $rootScope, $location, $window) {
    


      $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage.token;

    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if(nextRoute.access !== undefined && nextRoute.access.restricted === true && !window.localStorage.token) {
         event.preventDefault();
         $location.path('/login');



      }


      if($window.localStorage.token && nextRoute.access.restricted === true) {

       // $http.get('/api/verify')
        $http.post('/api/verify', {token: $window.localStorage.token})
         .then(function(response) {
            console.log('Your Token is Valid!')
         }, function(err) {
            delete $window.localStorage.token;
            $location.path('/login')

         })

      }

    });
     
   });

   app.config(function($routeProvider, $locationProvider) {

   	$locationProvider.html5Mode(true);

   	$routeProvider.when('/', {
   		templateUrl: './templates/main.html',
   		controller: 'MainController',
   		controllerAs: 'vm',
   		access: {
   			restricted: false
   		}

   	});


   	 	$routeProvider.when('/login', {
   		templateUrl: './templates/login.html',
   		controller: 'LoginController',
   		controllerAs: 'vm',
   		access: {
   			restricted: false
   		}

   	});

   	 	$routeProvider.when('/register', {
   		templateUrl: './templates/register.html',
   		controller: 'RegisterController',
   		controllerAs: 'vm',
   		access: {
   			restricted: false
   		}

   	});


   	 	$routeProvider.when('/polls', {
   		templateUrl: './templates/polls.html',
   		controller: 'PollsController',
   		controllerAs: 'vm',
   		access: {
   			restricted: false
   		}

   	});

   	 	 $routeProvider.when('/polls/:id', {
   		templateUrl: './templates/poll.html',
   		controller: 'PollController',
   		controllerAs: 'vm',
   		access: {
   			restricted: false
   		}

   	});

   	 	$routeProvider.when('/profile', {
   		templateUrl: './templates/profile.html',
   		controller: 'ProfileController',
   		controllerAs: 'vm',
   		access: {
   			restricted: true
   		}

   	});
   	 	$routeProvider.otherwise('/');



   });

   app.controller('MainController', MainController);

   function MainController($location, $window) {

   	var vm = this;
   	vm.title = "MainController";
   	console.log('in main ctrl');


   }


    app.controller('LoginController', LoginController);

   function LoginController($location, $window, $http) {

   	// body...

   	var vm = this;
   	vm.title = "LoginController";
      vm.error = '';

      vm.login = function() {
         if(vm.user) {
          $http.post('/api/login', vm.user)
            .then(function(response) {
               // console.log(response);
               // console.log('Success in Login In');
               $window.localStorage.token = response.data;
               $location.path('/profile');



            }, function(err) {
              vm.error = err;
            })

         }
         else {
            console.log('No Credentials supplied!')
         }
      }


   	}


   	app.controller('RegisterController', RegisterController);

   function RegisterController($location, $window, $http) {

   	// body...

   	  	var vm = this;
   	vm.title = "RegisterController";
   	vm.error = '';

   	vm.register = function() {
   		// console.log(vm.user);
   		if(!vm.user) {
   			console.log('Invalid credentials');
   			return;
   		}

   		$http.post('/api/register', vm.user)
   		.then(function(response) {
   			// console.log(response)
   			// $window
   			// console.log(response);
            $window.localStorage.token = response.data;
            $location.path('/profile');

   		}, function(err) {
   			// console.log(err)
   			vm.error = err.data.errmsg;
   		});
   	}

   	}


   	app.controller('ProfileController', ProfileController);

   function ProfileController($location, $window, jwtHelper) {

   	// body...
   	  	var vm = this;
   	vm.title = "ProfileController";
      vm.user = null;
      var token = $window.localStorage.token;

        var payload = jwtHelper.decodeToken(token).data;
        // console.log(payload);
        if(payload) {
         vm.user = payload;
         // console.log(vm.user);

        }

        vm.logOut = function() {

         delete $window.localStorage.token;
         vm.user = null;
         $location.path('/login');


        }

   	}

   	app.controller('PollsController', PollsController);

   function PollsController($location, $window, $http, jwtHelper) {

   	// body...

   	  	var vm = this;
        // vm.user = jwtHelper.decodeToken($window.localStorage.token)
     var user = jwtHelper.decodeToken($window.localStorage.token)
        // vm.id = vm.user.data._id;
    // vm.id = user.data._id;
     var id = user.data._id;

   	vm.title = "PollsController";
    vm.polls = [];
    

      vm.poll = {
         options: [],
         name: '',
         // user: ''
          user: id
      }

     vm.poll.options = [{
         name: '',
         votes: 0

      }]

      //  vm.poll.options

      vm.addOption = function() {
       vm.poll.options.push({
            name: '',
            votes: 0

         })
      }

      // console.log(vm.options);

      vm.getAllPolls = function () {

        $http.get('/api/polls')
          .then(function(response) {
            vm.polls = response.data;

          }, function(err) {
             console.log(err)
          })

    }


    vm.getAllPolls();




      vm.addPoll = function() {

    
        if(!vm.poll) {

         console.log('Invalid data supplied!');
         return;


        }

        
        $http.post('/api/polls', vm.poll)
          .then(function(response) {

            vm.poll = {};
            vm.getAllPolls();

            // console.log(response)
            // vm.polls = response.data;

          }, function(err) {

            vm.poll = {};

            console.log(err)

          });

       }

   }

   	app.controller('PollController', PollController);

   function PollController($location, $window) {

   	// body...

   	  	var vm = this;
   	vm.title = "PollController";

   	}




}());