angular.module('group.summary', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/group/:group_id/summary', {
            templateUrl:'app/groups/group/summary/summary.tpl.html',
            controller:'GroupSummaryCtrl',
            resolve:{
                group: ['GroupModel', '$route', '$q', function (GroupModel, $route, $q) {

                    var defer = $q.defer();

                    var group = GroupModel.get({
                        'id': $route.current.params.group_id
                    }, function() {
                        defer.resolve(group);
                    });

                    return defer.promise;
                }],
                currentUser: ['AuthService', function (Auth) {
                    return Auth.requireAuthenticated()
                }]
            }
        });
    }])

    .controller('GroupSummaryCtrl', ['$scope', '$location', 'group', function ($scope, $location, group) {
        $scope.group = group;
    }]);