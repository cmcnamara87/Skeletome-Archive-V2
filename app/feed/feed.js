angular.module('feed', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/feed', {
            templateUrl: 'app/feed/feed.tpl.html',
            controller: 'FeedCtrl',
            resolve: {
//                activities: ['ActivityModel', 'SessionService', '$q', function (ActivityModel, SessionService, $q) {
//                    var defer = $q.defer();
//
//                    if(angular.isDefined(SessionService.currentUser)) {
//                        ActivityModel.query({
//                            user_id: SessionService.currentUser.uid,
//                            embed: 1
//                        }).$promise.then(function(activities) {
//                                "use strict";
//                                defer.resolve(activities);
//                            });
//                    } else {
//                        defer.reject();
//                    }
//
//
//                    return defer.promise;
//                }]
            }
        });
    }])

    .controller('FeedCtrl', ['$scope', '$location', '$rootScope', 'ActivityModel', 'SessionService', function ($scope, $location, $rootScope, ActivityModel, SessionService) {
//        $scope.patients = patients;

        $scope.isLoading = true;

        // Load all patients
        $scope.activities = ActivityModel.query({
            user_id: SessionService.currentUser.uid,
            embed: 1
        }).$promise.then(function(activities) {
                "use strict";
                $scope.isLoading = false;

                angular.forEach(activities, function(activity, activityIndex) {
                    if(activityIndex % 2) {
                        $scope.activitiesOdd.push(activity);
                    } else {
                        $scope.activitiesEven.push(activity);
                    }
                });
            }); //[activities[0]];

        // We need to split the activities into even and odd
        // just to fill in the 2 columns easily
        // todo: user masonry in the future

        $scope.activitiesOdd = [];
        $scope.activitiesEven = [];


//        console.log("activities are ", activities);

    }]);

