(function() {

   var app = angular.module('app', ['ngRoute', 'angular-jwt']);

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
   		controller: 'loginController',
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

   function LoginController($location, $window) {

   	// body...

   	var vm = this;
   	vm.title = "LoginController";


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

   function ProfileController($location, $window) {

   	// body...
   	  	var vm = this;
   	vm.title = "ProfileController";

   	}

   	app.controller('PollsController', PollsController);

   function PollsController($location, $window) {

   	// body...

   	  	var vm = this;
   	vm.title = "PollsController";

   	}

   	app.controller('PollController', PollController);

   function PollController($location, $window) {

   	// body...

   	  	var vm = this;
   	vm.title = "PollController";

   	}




}());