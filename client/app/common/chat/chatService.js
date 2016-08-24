(function() {
    'use strict';

    angular
        .module('projectManager')
        .factory('chatService', chatService);

    chatService.$inject = ['$http', 'BASE_URL', 'CONTENT_TYPE', 'identity', '$q'];

    function chatService($http, BASE_URL, CONTENT_TYPE, identity, $q) {

        var service = {
            history: history,
            getParticipants: getParticipants,
            getConverstationById: getConverstationById
        };

        // Cache data :)
        var conversations = [];
        var participants = [];

        return service;

        ////////////////////////////

        /**
         * Gets chat history
         * @param {id} String Conversation id
         * @return Promise if success returns the projects from the API call if error returns the error message
         */
        function history(id) {
            var deffered = $q.defer();
            for (var i = 0; i < conversations.length; i++) {
                if (conversations[i].id === id) {
                    deffered.resolve(conversations[i]);
                    return deffered.promise;
                }
            }
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + identity.getToken()
                },
                url: BASE_URL + '/chat/' + id
            }).success(function(history) {
                deffered.resolve(history);
                conversations.push({
                    id: id,
                    conversation: history.conversation
                });
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Gets all participants from the conversation
         * @param {id} String Conversation id
         * @return Promise if success returns all participants from the conversation by ID from the API call if error returns the error message
         */
        function getParticipants(id) {
            var deffered = $q.defer();
            for (var i = 0; i < participants.length; i++) {
                if (participants[i].id === id) {
                    deffered.resolve(participants[i].data);
                    return deffered.promise;
                }
            }
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + identity.getToken()
                },
                url: BASE_URL + '/chat/participants/' + id
            }).success(function(participants) {
                deffered.resolve(participants);
                participants.push({
                    id: id,
                    data: participants
                });
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Gets data about the conversation
         * @param {id} String Conversation id
         * @return Promise if success returns all the data about the conversation from the conversation by ID from the API call if error returns the error message
         */
        function getConverstationById(id) {
            var deffered = $q.defer();
            var token = identity.getToken();
            $http({
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                method: 'GET',
                url: BASE_URL + '/conversation/' + id
            }).success(function(conversation) {
                deffered.resolve(conversation);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

    }

})();
