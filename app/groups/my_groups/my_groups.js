angular.module('groups.my_groups', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/groups/my-groups', {
            templateUrl:'app/groups/my_groups/my_groups.tpl.html',
            controller:'MyGroupsCtrl',
            resolve:{
                memberships: ['MembershipModel', 'AuthService', '$q', function (MembershipModel, AuthService, $q) {

                    var defer = $q.defer();

                    if(AuthService.getUser()) {
                        var patients = MembershipModel.index({
                            'user_id': AuthService.getUser().uid
                        }, function(memberships) {
                            defer.resolve(memberships);
                        }, function() {
                            defer.reject();
                        });
                    } else {
                        defer.reject();
                    }

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('MyGroupsCtrl', ['$scope', '$location', 'memberships', function ($scope, $location, memberships) {
        $scope.memberships = memberships;

    }]);

