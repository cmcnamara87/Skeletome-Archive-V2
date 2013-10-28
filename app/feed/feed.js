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

        console.log("activities are ", activities);

    }]);

