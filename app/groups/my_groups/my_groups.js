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
                groups: ['GroupModel', '$q', function (GroupModel, $q) {
                    var defer = $q.defer();

                    var groups = GroupModel.index({
                    }, function(groups) {
                        defer.resolve(groups);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('MyGroupsCtrl', ['$scope', '$location', 'MembershipModel', 'AuthService', 'memberships', 'groups', function ($scope, $location, MembershipModel, AuthService, memberships, groups) {
        $scope.memberships = memberships;

        $scope.groups = groups;

        $scope.add = function() {
            var newMembership = new MembershipModel({
                user_id: AuthService.getUser().uid
            })
            $scope.memberships.unshift(newMembership);
        }

    }]);

