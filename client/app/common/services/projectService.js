(function() {
    'use strict';

    angular
        .module('projectManager')
        .factory('projectService', projectService);

    projectService.$inject = ['$http', '$q', 'BASE_URL', 'CONTENT_TYPE', 'identity'];

    function projectService($http, $q, BASE_URL, CONTENT_TYPE, identity) {

        var service = {
            createProject: createProject,
            updateProject: updateProject,
            getProject: getProject,
            getProjects: getProjects,
            deleteProject: deleteProject
        };

        return service;

        ////////////////////////////


        /**
         * Creats project if data is valid
         * @param {data.title} String Project title
         * @param {data.description} String Project description
         * @param {credentials.admins} Array Project admin users IDs
         * @param {data.developers} Array Project developer users IDs
         * @return Promise if success returns the project object from the API call if error returns the error message
         */
        function createProject(data) {
            var deffered = $q.defer();
            var developers,
                admins;
            var token = identity.getToken();
            var req = 'title=' + data.title + '&description=' + data.description;
            if (data.admins !== undefined) {
                req += '&adminUsers=' + data.admins.join();
            }
            if (data.developers !== undefined) {
                req += '&standardUsers=' + data.developers.join();
            }
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                url: BASE_URL + '/project',
                data: req
            }).success(function(project) {
                deffered.resolve(project);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Updates the project data if valid
         * @param {id} String Project ID
         * @param {data.title} String Project title
         * @param {data.description} String Project description
         * @param {credentials.admins} Array Project admin users IDs
         * @param {data.developers} Array Project developer users IDs
         * @return Promise if success returns the UPDATED project object from the API call if error returns the error message
         */
        function updateProject(id, data) {
            var token = identity.getToken();
            var deffered = $q.defer();
            var req = 'title=' + data.title + '&description=' + data.description;
            if (data.admins !== undefined) {
                req += '&adminUsers=' + data.admins.join();
            }
            if (data.developers !== undefined) {
                req += '&standardUsers=' + data.developers.join();
            }
            $http({
                method: 'PUT',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                url: BASE_URL + '/project/' + id,
                data: req
            }).success(function(project) {
                deffered.resolve(project);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Gets a project with the ID provided
         * @param {id} String Project ID
         * @return Promise if success returns the project by the provided ID from the API call if error returns the error message
         */
        function getProject(id) {
            var token = identity.getToken();
            var deffered = $q.defer();
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                url: BASE_URL + '/project/' + id
            }).success(function(project) {
                deffered.resolve(project);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

        /**
         * Gets all project that the user is participation in
         * @return Promise if success returns the project by the provided ID from the API call if error returns the error message
         */
        function getProjects() {
            var deffered = $q.defer();
            var token = identity.getToken();
            var projects = [];
            $http({
                method: 'GET',
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                url: BASE_URL + '/myProjects'
            }).success(function(data) {
                projects.owner = data;
                $http({
                    method: 'GET',
                    headers: {
                        'Content-Type': CONTENT_TYPE,
                        'Authorization': 'Bearer ' + token
                    },
                    url: BASE_URL + '/admin/projects'
                }).success(function(data) {
                    projects.admin = data;
                    $http({
                        method: 'GET',
                        headers: {
                            'Content-Type': CONTENT_TYPE,
                            'Authorization': 'Bearer ' + token
                        },
                        url: BASE_URL + '/developer/projects'
                    }).success(function(data) {
                        projects.developer = data;
                        deffered.resolve(projects);
                    }).error(function(err) {
                        console.log(err);
                        deffered.reject(err);
                    });
                }).error(function(err) {
                    console.log(err);
                    deffered.reject(err);
                });
            }).error(function(err) {
                console.log(err);
                deffered.reject(err);
            });
            return deffered.promise;
        }

        /**
         * Deletes a project by ID if the user have permission
         * @param {id} String Project ID
         * @return Promise if success returns success message from the API call if error returns the error message
         */
        function deleteProject(id) {
            var deffered = $q.defer();
            var token = identity.getToken();
            $http({
                headers: {
                    'Content-Type': CONTENT_TYPE,
                    'Authorization': 'Bearer ' + token
                },
                method: 'DELETE',
                url: BASE_URL + '/myProject/' + id
            }).success(function(res) {
                deffered.resolve(res);
            }).error(function(err) {
                deffered.reject(err.message);
            });
            return deffered.promise;
        }

    }

})();
