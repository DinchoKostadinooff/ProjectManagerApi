(function() {
    'use strict';

    angular
        .module('projectManager.authentication', [])
        .controller('AuthenticationController', AuthenticationController);

    AuthenticationController.$inject = ['$scope', 'authenticationService', '$location', 'toastr', '$route'];

    function AuthenticationController($scope, authenticationService, $location, toastr, $route) {

        // Initializing the scope models
        $scope.loginUser = {
            password: '',
            email: '',
            remember: false
        };

        $scope.registerUser = {
            name: '',
            password: '',
            position: '',
            email: ''
        };

        // Hooking scope with the controller functions
        $scope.login = login;
        $scope.register = register;

        function login(LoginForm) {
            // Checking if login form is filled correct
            if (LoginForm.$valid) {
                // Making an API call through the service
                authenticationService.login($scope.loginUser).then(function(user) {
                    // Login success , showing welcome message and redirection to dashboard page
                    toastr.success('Welcome!');
                    $location.path('/dashboard');
                }, function(err) {
                    // Showing the error from the API call
                    toastr.error(err.message);
                });
            } else {
                // Showing message if form is not filled correct
                toastr.error("Login Failed!");
            }
        }

        function register(RegisterForm) {
            // Checking if registration form is filled correct
            if (RegisterForm.$valid) {
                // Checking for password match
                if ($scope.registerUser.passwordConfirm === $scope.registerUser.password) {
                    // Making an API call through the service
                    authenticationService.register($scope.registerUser).then(function(data) {
                        // Registration success , showing welcome message and redirection to dashboard page
                        toastr.success('Welcome!');
                        $location.path('/dashboard');
                    }, function(err) {
                        // Showing the error from the API call
                        toastr.error(err);
                    });
                } else {
                    // Showing message if passwords not match
                    toastr.error('Passwords does not match!');
                }
            } else {
                // Showing message if form is not filled correct
                toastr.error("Register Failed!");
            }
        }

        /////////////////////////////////////////////

        // jQuery code to make switching login and register panels
        $('#login-form-link').click(function(e) {
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });

    }

})();
