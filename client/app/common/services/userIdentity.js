(function() {
    'use strict';

    angular
        .module('projectManager')
        .factory('identity', identity);

    identity.$inject = ['$http', 'ipCookie', '$sessionStorage'];

    function identity($http, ipCookie, $sessionStorage) {

        var service = {
            getToken: getToken,
            setToken: setToken,
            updateToken: updateToken,
            getId: getId,
            setId: setId,
            clear: clear
        };

        return service;

        ////////////////////////////

        /**
         * Gets the token of the current user
         * @return String If there is token
         */
        function getToken() {
            return ipCookie('token') || $sessionStorage.token;
        }

        /**
         * Sets a token to the service
         * @param {token} String The user's token
         * @param {remember} Boolean If the token should be in a cookie or in session
         * @return Void
         */
        function setToken(token, remember) {
            if (remember === true) {
                ipCookie('token', token, {
                    expires: 30
                });
            } else {
                $sessionStorage.token = token;
            }
        }

        /**
         * Updates a token to the service
         * @param {token} String The user's token
         * @return Void
         */
        function updateToken(token) {
            if (ipCookie('token')) {
                ipCookie('token', token, {
                    expires: 30
                });
            } else {
                $sessionStorage.token = token;
            }
        }

        /**
         * Returns the user ID
         * @return The ID of the user
         */
        function getId() {
            return ipCookie('id') || $sessionStorage.id;
        }

        /**
         * Sets the user ID
         * @param {id} String The user's ID
         * @param {remember} Boolean If the ID should be in a cookie or in session
         * @return Void
         */
        function setId(id, remember) {
            if (remember === true) {
                ipCookie('id', id, {
                    expires: 30
                });
            } else {
                $sessionStorage.id = id;
            }
        }

        /**
         * Clears all the cookies and sessionStorage
         * @return Void
         */
        function clear() {
            ipCookie.remove('token');
            ipCookie.remove('id');
            $sessionStorage.$reset();
        }

    }

})();
