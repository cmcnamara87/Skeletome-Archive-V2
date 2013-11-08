angular.module('patients.pinned_patients', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patients/pinned', {
            templateUrl:'app/patients/pinned_patients/pinned_patients.tpl.html',
            controller:'PinnedPatientsCtrl',
            resolve:{
                lists: ['ListModel', 'SessionService', '$q', function (ListModel, SessionService, $q) {

                    var defer = $q.defer();

                    var lists = ListModel.index({
                        'uid': SessionService.currentUser.uid
                    }, function() {
                        defer.resolve(lists);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });

    }])

    .controller('PinnedPatientsCtrl', ['$scope', 'lists', 'ListModel',
        function ($scope, lists, ListModel) {
            $scope.lists = lists;

            $scope.addList = function() {
                var newList = new ListModel({
                });
                $scope.lists.unshift(newList);
            }
            $scope.removeList = function(list) {
                var index = $scope.lists.indexOf(list);
                $scope.lists.splice(index, 1);
            }
        }]);

