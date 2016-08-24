(function() {
    'use strict';

    angular
        .module('projectManager.authentication')
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', 'BASE_URL', 'CONTENT_TYPE', '$q', 'identity'];

    function authenticationService($http, BASE_URL, CONTENT_TYPE, $q, identity) {
        // Private variable to save if user is logged or nah
        var currentUser = false;
        // Service object to return
        var service = {
            login: login,
            register: register,
            logout: logout,
            checkProfile: checkProfile,
            getCurrentUser: getCurrentUser
        };

        return service;

        /**
         * Check if user's credentials are correct and sets the session
         * @param {credentials.email} String User's email
         * @param {credentials.password} String User's password
         * @param {credentials.remember} Boolean if true the user's session is set into a cookie
         * @return Promise if success returns the user object from the API call if error returns the error message
         */
        function login(credentials) {
            var deffered = $q.defer();
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': CONTENT_TYPE
                },
                url: BASE_URL + '/login',
                data: 'email=' + credentials.email + '&password=' + credentials.password
            }).success(function(user) {
                currentUser = true;
                if (credentials.remember) {
                    identity.setToken(user.token, true);
                    identity.setId(user.userId, true);
                } else {
                    identity.setToken(user.token, false);
                    identity.setId(user.userId, false);
                }
                deffered.resolve(user);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Create a registration if user's credentials are correctly formed
         * @param {credentials.name} String User's name
         * @param {credentials.position} String User's postion
         * @param {credentials.email} String User's email
         * @param {credentials.password} String User's password
         * @return Promise if success returns the user object from the API call if error returns the error message
         */
        function register(credentials) {
            var deffered = $q.defer();
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': CONTENT_TYPE
                },
                url: BASE_URL + '/register',
                data: 'name=' + credentials.name + '&position=' + credentials.position + '&email=' + credentials.email +
                    '&password=' + credentials.password
            }).success(function(user) {
                currentUser = true;
                // By default when you register your identity is set to the current session which expires when you close the browser
                identity.setToken(user.token, false);
                identity.setId(user.userId, false);
                deffered.resolve(user);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Logges out the current user
         * @return void
         */
        function logout() {
            identity.clear();
            currentUser = false;
        }

        /**
         * Checks if there is a user in the current session
         * @return Promise if success returns current user's object else the error message
         */
        function checkProfile() {
            var deffered = $q.defer();
            // Getting the token
            var token = identity.getToken();
            // Without token users can't be in the session
            if (!token) {
                deffered.reject();
            } else {
                $http({
                    method: 'GET',
                    headers: {
                        'Content-Type': CONTENT_TYPE,
                        'Authorization': 'Bearer ' + token
                    },
                    url: BASE_URL + '/profile'
                }).success(function(user) {
                    currentUser = true;
                    deffered.resolve(user);
                }).error(function(err) {
                    deffered.reject(err.message);
                });
            }
            return deffered.promise;
        }

        /**
         * Getting the current user
         * @return Boolean if there is user true otherwise false
         */
        function getCurrentUser() {
            return currentUser;
        }

    }

})();
