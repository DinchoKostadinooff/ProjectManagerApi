(function() {
    'use strict';

    angular
        .module('projectManager.editProfile', [])
        .controller('EditProfileController', EditProfileController)
        .config(function($routeProvider) {
            $routeProvider.when('/profile', {
                templateUrl: 'app/editProfile/editProfile.view.html',
                controller: 'EditProfileController',
                resolve: {
                    // Resolving current profile data
                    getCurrentProfile: function(usersService) {
                        return usersService.getCurrentProfile();
                    }
                }
            });
        });

    EditProfileController.$inject = ['$scope', 'usersService', '$location', 'getCurrentProfile'];

    function EditProfileController($scope, usersService, $location, getCurrentProfile) {
        // Assing function to scope
        $scope.update = update;
        // Assing the current user data to scope
        $scope.user = getCurrentProfile;

        function update(UpdateForm) {
            // Checking for valid form
            if (UpdateForm.$valid) {
                // Checking for password match
                if ($scope.user.newPasswordConfirm === $scope.user.newPassword) {
                    // Calling the API service to update the profile
                    usersService.updateProfile($scope.user).then(function(data) {
                        // Success callback, reseting fields, displaying success message and redirectiong back to dashboard
                        $scope.user.oldPassword = '';
                        $scope.user.newPassword = '';
                        $scope.user.newPasswordConfirm = '';
                        $location.path('/dashboard');
                        toastr.info('Profile Successfully updated!');
                    }, function(err) {
                        // Showing error message
                        console.log(err);
                        toastr.error('Wrong password');
                    });
                } else {
                    // Showing message if passwords dont match
                    toastr.error('New Password does not match with Confirm Password');
                }
            } else {
                // Showing message if form isn't correct
                toastr.error('Updating Profile failed!');
            }
        }

    }

})();
