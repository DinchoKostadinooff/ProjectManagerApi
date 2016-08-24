(function() {
    'use strict';


    angular
        .module('projectManager.createProject', [])
        .controller('CreateProjectController', CreateProjectController)
        .config(function($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'app/createProject/createProject.view.html',
                controller: 'CreateProjectController',
                resolve: {
                    // Resovle that is going to be executed before the contorller and route load
                    getUsers: function(usersService) {
                        return usersService.getAllUsers();
                    }
                }
            });
        });

    CreateProjectController.$inject = ['$scope', 'projectService', '$filter', 'getUsers', '$location'];

    function CreateProjectController($scope, projectService, $filter, getUsers, $location) {
        // Getting the users from resolve
        var users = getUsers;
        // Assign function to scope
        $scope.createProject = createProject;
        // Assign users to scope
        $scope.users = users;

        function createProject(CreateProjectForm) {
            // Checking if form is valid
            if (CreateProjectForm.$valid) {
                projectService.createProject($scope.project).then(function(data) {
                    // Project is successfully created and redirected to dashboard page
                    toastr.success('Project created successfully');
                    $location.path('/dashboard');
                }, function(err) {
                    // Displaying the err
                    toastr.error(err);
                });
            } else {
                // Displaying if the form is invalid
                toastr.error('Fill in the form');
            }
        }

    }

})();
