angular.module('feed', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/feed', {
            templateUrl: 'app/feed/feed.tpl.html',
            controller: 'FeedCtrl',
            resolve: {
                activities: ['ActivityModel', 'SessionService', '$q', function (ActivityModel, SessionService, $q) {
                    var defer = $q.defer();

                    var activities = ActivityModel.query({
                        user_id: SessionService.currentUser.uid
                    }, function () {
                        console.log("in here", activities);
                        defer.resolve(activities);
                    }, function (error) {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('FeedCtrl', ['$scope', '$location', 'activities', function ($scope, $location, activities) {
//        $scope.patients = patients;

        // Load all patients
        $scope.activities = activities;

        // We need to split the activities into even and odd
        // just to fill in the 2 columns easily
        // todo: user masonry in the future

        $scope.activitiesOdd = [];
        $scope.activitiesEven = [];
        angular.forEach($scope.activities, function(activity, activityIndex) {

            if(activityIndex % 2) {
                console.log("odd", activity);
                $scope.activitiesOdd.push(activity);
            } else {
                console.log("even", activity);
                $scope.activitiesEven.push(activity);
            }
        });

        console.log("activities are ", activities);

    }]);

