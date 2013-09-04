angular.module('group.members', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/group/:group_id/members', {
            templateUrl:'app/groups/group/members/members.tpl.html',
            controller:'GroupMembershipCtrl',
            resolve:{
                memberships: ['MembershipModel', 'UserModel', '$route', '$q', function (MembershipModel, UserModel, $route, $q) {
                    var defer = $q.defer();
//                    UserModel.get({'uid': 1});


                    var memberships = MembershipModel.index({
                        group_id: $route.current.params.group_id
                    }, function() {
//                        // todo: get this down to less requests
                        angular.forEach(memberships, function(membership, membershipsIndex) {
                            membership.user = UserModel.get({uid: membership.user_id});
                        });
                        defer.resolve(memberships);
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

    .controller('GroupMembershipCtrl', ['$scope', '$location', 'memberships', function ($scope, $location, memberships) {
        $scope.memberships = memberships;
    }]);