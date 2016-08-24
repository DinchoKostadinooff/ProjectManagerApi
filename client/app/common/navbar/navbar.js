(function() {
    'use strict';

    angular
        .module('projectManager')
        .directive('navbar', navbar)
        .controller('NavbarController', NavbarController);

    // Injecting dependencies to navbar controller
    NavbarController.$inject = ['$scope', '$location', '$rootScope', 'authenticationService', 'toastr'];

    function navbar() {
        // Usage: ...
        var directive = {
            restrict: 'E',
            templateUrl: 'app/common/navbar/navbar.tpl.html',
            scope: {},
            link: link
        };
        return directive;

        ////////////////////////////

        function link(scope, element, attrs) {

        }
    }

    function NavbarController($scope, $location, $rootScope, authenticationService, toastr) {
        // Assigning function to scope
        $scope.showNavbar = showNavbar;
        $scope.logout = logout;
        $scope.isActive = isActive;

        /**
         * Shows the navbar if user is logged in
         * @return Boolean if user is logged true otherwise false
         */
        function showNavbar() {
            if ($location.path() === '/') {
                return false;
            }
            return true;
        }

        /**
         * Changes the active class on link elements in the view
         * @param {path} String Path
         * @return Boolean if the path is the current path true else it returns false
         */
        function isActive(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        }

        // Function to logoute the current user throught the service
        function logout() {
            authenticationService.logout();
            toastr.success('Goodbye!');
        }
    }

})();
