(function() {
    'use strict';

    angular
        .module('projectManager')
        .factory('chatSocket', chatSocket);

    chatSocket.$inject = ['socketFactory'];
    // From github how to use sockets best practice
    function chatSocket(socketFactory) {

        return socketFactory();

    }

})();
