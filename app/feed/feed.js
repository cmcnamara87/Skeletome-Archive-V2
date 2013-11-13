angular.module('feed', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/feed', {
            templateUrl: 'app/feed/feed.tpl.html',
            controller: 'FeedCtrl',
            resolve: {
                activities: ['ActivityModel', 'SessionService', '$q', function (ActivityModel, SessionService, $q) {
                    var defer = $q.defer();

                    if(angular.isDefined(SessionService.currentUser)) {
                        var activities = ActivityModel.query({
                            user_id: SessionService.currentUser.uid,
                            embed: 1
                        }, function () {
                            console.log("in here", activities);
                            defer.resolve(activities);
                        }, function (error) {
                            defer.reject();
                        });
                    } else {
                        defer.reject();
                    }


                    return defer.promise;
                }]
            }
        });
    }])

    .controller('FeedCtrl', ['$scope', '$location', 'activities', '$rootScope', function ($scope, $location, activities, $rootScope) {
//        $scope.patients = patients;

        $scope.isFeed = true;

        // Load all patients
        $scope.activities = activities; //[activities[0]];

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

