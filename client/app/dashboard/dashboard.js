(function() {
    'use strict';

    angular
        .module('projectManager.dashboard', [])
        .controller('DashboardController', DashboardController)
        .config(function($routeProvider) {
            $routeProvider.when('/dashboard', {
                templateUrl: 'app/dashboard/dashboard.view.html',
                controller: 'DashboardController',
                resolve: {
                    // Resolve for getting all projects that the user is assigned to
                    getProjects: function(projectService) {
                        return projectService.getProjects();
                    }
                }
            });
        });

    DashboardController.$inject = ['$scope', 'getProjects', '$route', 'chatSocket'];

    function DashboardController($scope, getProjects, $route, chatSocket) {
        // Creating empty scope array to hold the projects
        $scope.projects = [];
        // Scope variables to set pagination options
        $scope.pageSize = 6;
        $scope.currentPage = 1;
        // Perambulate all projects and adding the position for the current user
        angular.forEach(getProjects.owner, function(val, key) {
            val.position = 'owner';
            $scope.projects.push(val);
        });
        angular.forEach(getProjects.admin, function(val, key) {
            val.position = 'admin';
            $scope.projects.push(val);
        });
        angular.forEach(getProjects.developer, function(val, key) {
            val.position = 'developer';
            $scope.projects.push(val);
        });
    }

})();
