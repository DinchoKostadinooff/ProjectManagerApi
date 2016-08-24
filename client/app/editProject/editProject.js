(function() {
    'use strict';

    angular
        .module('projectManager.editProject', [])
        .controller('EditProjectController', EditProjectController)
        .config(function($routeProvider) {
            $routeProvider.when('/project/:id', {
                templateUrl: 'app/editProject/editProject.view.html',
                controller: 'EditProjectController',
                resolve: {
                    // Getting data for users and the project the user want to edit
                    getAll: function(usersService, projectService, $q, $routeParams, $route) {
                        // Returning multiple promises
                        return $q.all({
                            users: usersService.getAllUsers(),
                            project: projectService.getProject($route.current.params.id)
                        });
                    }
                }
            });
        });

    EditProjectController.$inject = ['$scope', 'projectService', 'getAll', '$location', 'toastr', '$routeParams'];

    function EditProjectController($scope, projectService, getAll, $location, toastr, $routeParams) {
        // Storing the id from the route
        var id = $routeParams.id;
        // Assigning resolve data to scope variables
        $scope.users = getAll.users;
        $scope.project = getAll.project;
        $scope.project.admins = getAll.project.adminUsers;
        $scope.project.developers = getAll.project.standardUsers;

        // Assign function to scope
        $scope.updateProject = updateProject;

        function updateProject() {
            // Making API call through service with the params the user want to update
            projectService.updateProject(id, $scope.project).then(function(data) {
                // Displaying success message and redirection back to dashboard
                toastr.success('Project updated!');
                $location.path('/dashboard');
            }, function(err) {
                // Displaying error message
                toastr.error(err);
            });
        }
    }

})();
