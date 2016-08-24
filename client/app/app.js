(function() {
    'use strict';
    // Creating app module and injection dependencies
    angular.module('projectManager', [
            'ngRoute',
            'btford.socket-io',
            'ngSanitize',
            'ipCookie',
            'ngStorage',
            'validation',
            'validation.rule',
            'ui.select',
            'ui.bootstrap',
            'ngTagsInput',
            'angular-web-notification',
            'projectManager.authentication',
            'projectManager.dashboard',
            'projectManager.editProfile',
            'projectManager.createProject',
            'projectManager.editProject'
        ])
        // Default route configuration function
        .config(function($routeProvider, $locationProvider) {
            // Removing # from the url without base tag
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            // Setting default page when user is not logged in
            $routeProvider
                .when('/', {
                    templateUrl: 'app/authentication/authentication.view.html',
                    controller: 'AuthenticationController'
                }).otherwise({
                    redirectTo: '/'
                });
        })
        // Injectiong non angular module as a variable
        .value('toastr', toastr)
        // Initializing constants for API calls from services
        .constant('BASE_URL', 'http://localhost:7777/api')
        .constant('CONTENT_TYPE', 'application/x-www-form-urlencoded; charset=UTF-8')
        // Starting function which is set to listen to route change and change route if user is not logged
        .run(function($rootScope, $location, authenticationService) {
            var requestedLocation = $location.path();
            // Checking if user is logged and redirecting the user to different paths
            authenticationService.checkProfile().then(function() {
                if (requestedLocation === '/' && authenticationService.getCurrentUser()) {
                    $location.path('/dashboard');
                } else if (requestedLocation !== '/' && !authenticationService.getCurrentUser()) {
                    $location.path('/');
                }
                init();
            }, function() {
                if (requestedLocation !== '/') {
                    $location.path('/dashboard');
                }
                init();
            });
            // Function that starts listening to location changes and redirectiong if there is an error
            function init() {
                $rootScope.$on('$locationChangeStart', function(event, next, current) {
                    if ($location.path() === '/' && authenticationService.getCurrentUser()) {
                        $location.path('/dashboard');
                    } else if ($location.path() !== '/' && !authenticationService.getCurrentUser()) {
                        $location.path('/');
                    }
                });
                $rootScope.$on('$locationChangeError', function(event, next, current) {
                    console.log("err");
                    if (authenticationService.getCurrentUser()) {
                        $location.path('/dashboard');
                    } else {
                        $location.path('/');
                    }
                });
            }
        });
    // Setting toastr options
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

})();
