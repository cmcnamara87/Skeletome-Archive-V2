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

            var page = 0;
            $scope.isMoreToLoad = true;

            console.log("Session service is", $scope.SessionService);
        // Load all patients
        $scope.$watch('SessionService.isAuthenticated', function(authenticated) {
            "use strict";
            console.log("hello?");
            if(authenticated) {
                ActivityModel.query({
                    user_id: SessionService.currentUser.uid,
                    embed: 1,
                    page: page
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
        })

        // We need to split the activities into even and odd
        // just to fill in the 2 columns easily
        // todo: user masonry in the future

        $scope.activitiesOdd = [];
        $scope.activitiesEven = [];


            $scope.loadMore = function() {
                "use strict";
                page++;
                $scope.isLoadingMore = true;
                ActivityModel.query({
                    user_id: SessionService.currentUser.uid,
                    embed: 1,
                    page: page
                }).$promise.then(function(activities) {
                        "use strict";
                        $scope.isLoadingMore = false;
                    $scope.activities = $scope.activities.concat(activities);
                        if(activities.length == 0) {
                            $scope.isMoreToLoad = false;
                        }
                });
            }

    }]);

