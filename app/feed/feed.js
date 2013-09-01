angular.module('feed', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/feed', {
            templateUrl:'app/feed/feed.tpl.html',
            controller:'FeedCtrl',
            resolve:{
//                patients: ['PatientModel', 'auth', '$q', 'Param', function (PatientModel, auth, $q, Param) {
//
//                    var defer = $q.defer();
//
//                    console.log("hello world");
//                    auth.checkCurrentUser().then(function() {
//                        console.log("got current user");
//                        var patients = PatientModel.index({
//                            'uid': auth.getUser().uid
//                        }, function() {
//                            defer.resolve(patients);
//                        }, function() {
//                            defer.reject();
//                        });
//
//                    }, function() {
//                        $location.path("/splash");
//                    });
//
//                    return defer.promise;
//                }]
            }
        });
    }])

    .controller('FeedCtrl', ['$scope', '$location', function ($scope, $location) {
//        $scope.patients = patients;
    }]);

