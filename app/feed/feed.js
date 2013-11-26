angular.module('feed', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/feed', {
            templateUrl: 'app/feed/feed.tpl.html',
            controller: 'FeedCtrl'
        });
    }])

    .controller('FeedCtrl', ['$scope', '$location', '$rootScope', 'ActivityModel', 'SessionService',
        function ($scope, $location, $rootScope, ActivityModel, SessionService) {

        $scope.isLoading = true;

        // Load all patients
        if(SessionService.isAuthenticated) {
            ActivityModel.query({
                user_id: SessionService.currentUser.uid,
                embed: 1
            }).$promise.then(function(activities) {
                "use strict";
                $scope.activities = activities;
                $scope.isLoading = false;

                angular.forEach(activities, function(activity, activityIndex) {
                    if(activityIndex % 2) {
                        $scope.activitiesOdd.push(activity);
                    } else {
                        $scope.activitiesEven.push(activity);
                    }
                });
            });
        }


        // We need to split the activities into even and odd
        // just to fill in the 2 columns easily
        // todo: user masonry in the future

        $scope.activitiesOdd = [];
        $scope.activitiesEven = [];




//        console.log("activities are ", activities);

    }]);

