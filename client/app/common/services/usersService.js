(function() {
    'use strict';

    angular
        .module('projectManager')
        .factory('usersService', usersService);

    usersService.$inject = ['$http', '$q', 'BASE_URL', 'CONTENT_TYPE', 'identity'];

    function usersService($http, $q, BASE_URL, CONTENT_TYPE, identity) {

        var service = {
            getAllUsers: getAllUsers,
            getCurrentProfile: getCurrentProfile,
            updateProfile: updateProfile,
        };
        // Cached users
        var users = {
            frontEnds: [],
            backEnds: [],
            fullStack: [],
            cached: false
        };
        // Cached user data
        var user = {
            name: '',
            email: '',
            position: ''
        };

        return service;

        ////////////////////////////

        /**
         * Gets all users
         * @return Void
         */
        function getAllUsers() {
            var deffered = $q.defer();
            if (users.cached) {
                deffered.resolve(users);
                return deffered.promise;
            }
            var token = identity.getToken();
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                url: BASE_URL + '/frontEnd',
            }).success(function(data) {
                users.frontEnds = data;
                $http({
                    method: 'GET',
                    headers: {
                        'Content-Type': CONTENT_TYPE,
                        'Authorization': 'Bearer ' + token
                    },
                    url: BASE_URL + '/backEnd',
                }).success(function(data) {
                    users.backEnds = data;
                    $http({
                        method: 'GET',
                        headers: {
                            'Content-Type': CONTENT_TYPE,
                            'Authorization': 'Bearer ' + token
                        },
                        url: BASE_URL + '/fullStack',
                    }).success(function(data) {
                        users.fullStack = data;
                        users.cached = true;
                        deffered.resolve(users);
                    }).error(function(err) {
                        console.log(err);
                        deffered.reject(err);
                    });
                }).error(function(err) {
                    console.log(err);
                });
            }).error(function(err) {
                console.log(err);
            });
            return deffered.promise;
        }

        /**
         * Gets all users's current profile data
         * @return Promise if success resolves the user's data if error returns the error message
         */
        function getCurrentProfile() {
            var deffered = $q.defer();
            if (user.name !== '') {
                deffered.resolve(user);
                return deffered.promise;
            }
            var token = identity.getToken();
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                url: BASE_URL + '/profile'
            }).success(function(data) {
                user.name = data.name;
                user.email = data.email;
                user.position = data.position;
                deffered.resolve(user);
            }).error(function(err) {
                deffered.reject(err);
            });
            return deffered.promise;
        }

        /**
         * Updates the user's profile
         * @param {credentials.email} String The user's emmail
         * @param {credentials.name} String The user's name
         * @param {credentials.oldPassword} String The user's old password
         * @param {credentials.newPassword} String The user's new password (optional)
         * @param {credentials.position} String The user's position
         * @return Updated user data
         */
        function updateProfile(credentials) {
            var deffered = $q.defer();
            var token = identity.getToken();
            // Checks for new password because it's optional
            if (credentials.newPassword) {
                http({
                    method: 'PUT',
                    headers: {
                        'Content-Type': CONTENT_TYPE,
                        'Authorization': 'Bearer ' + token
                    },
                    url: BASE_URL + '/profile',
                    data: 'email=' + credentials.email + '&name=' + credentials.name + '&position=' +
                        credentials.position + '&oldPassword=' + credentials.oldPassword + '&newPassword=' + credentials.newPassword
                }).success(function(user) {
                    identity.updateToken(user.token);
                    deffered.resolve(user);
                }).error(function(err) {
                    deffered.reject(err.message);
                });
            } else {
                $http({
                    method: 'PUT',
                    headers: {
                        'Content-Type': CONTENT_TYPE,
                        'Authorization': 'Bearer ' + token
                    },
                    url: BASE_URL + '/profile',
                    data: 'email=' + credentials.email + '&name=' + credentials.name + '&position=' +
                        credentials.position + '&oldPassword=' + credentials.oldPassword
                }).success(function(user) {
                    identity.updateToken(user.token);
                    deffered.resolve(user);
                }).error(function(err) {
                    deffered.reject(err.message);
                });
            }
            return deffered.promise;
        }

    }

})();
