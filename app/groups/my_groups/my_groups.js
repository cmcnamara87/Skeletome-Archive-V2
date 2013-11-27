angular.module('groups.my_groups', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/groups/my-groups', {
            templateUrl:'app/groups/my_groups/my_groups.tpl.html',
            controller:'MyGroupsCtrl',
            resolve:{
                memberships: ['MembershipModel', 'SessionService', '$q', 'AuthService', function (MembershipModel, SessionService, $q, AuthService) {
                    return AuthService.isAuthenticated().then(function() {
                        return MembershipModel.index({'user_id': SessionService.currentUser.uid}).$promise;
                    });
                }]
            }
        });
    }])

    .controller('MyGroupsCtrl', ['$scope', '$q', '$location', 'MembershipModel', 'GroupModel', 'UserModel', 'AuthService', 'SessionService', 'SmodalService', 'memberships',
        function ($scope, $q, $location, MembershipModel, GroupModel, UserModel, AuthService, SessionService,  SmodalService, memberships) {
        $scope.memberships = memberships;

        $scope.newGroup = new GroupModel({
            administrator_id: SessionService.currentUser.uid,
            administrator: SessionService.currentUser,
            members: [
            ]
        });

        $scope.showDeleteMembership = function(membership) {
            SmodalService.show("deleteMembership");
            $scope.membershipToDelete = membership;
        }
        $scope.deleteMembership = function(membership) {
            var index = $scope.memberships.indexOf(membership);
            $scope.memberships.splice(index, 1);
            membership.$remove();
        }


        $scope.showDeleteGroup = function(membership) {
            SmodalService.show("deleteGroup");
            $scope.membershipWithGroupToDelete = membership;
        }
        $scope.deleteGroupAndMembership = function(membership) {
            var groupToDelete = new GroupModel(membership.group);
            groupToDelete.$remove(function(group) {
                var index = $scope.memberships.indexOf(membership);
                $scope.memberships.splice(index, 1);
                membership.$remove();
            });
        }


        $scope.showCreateGroup = function() {
            SmodalService.show('createGroup');
        }
        $scope.createGroup = function(newGroup) {
            // Create a group and then, create the memberships
            var members = newGroup.members;
            newGroup.administrator_id = newGroup.administrator.uid;

            newGroup.$save(function(group) {
                // Do the sharing
                var promiseArray = [];
                angular.forEach(members, function(member) {
                    var newMembership = new MembershipModel({
                        user_id: member.uid,
                        group_id: group.id
                    })
                    promiseArray.push(newMembership.$save());
                });

                $q.all(promiseArray).then(function() {
                    $location.path('/group/' + group.id + '/summary');
                });
            })

            $scope.newGroup = new GroupModel({
                administrator_id: SessionService.currentUser.uid,
                administrator: SessionService.currentUser,
                members: [
                ]
            });
        }

        $scope.findUsers = function(value) {
            var defer = $q.defer();
            UserModel.index({name: value}, function(users) {
                defer.resolve(users);
            }, function() {
                defer.reject();
            });
            return defer.promise;
        }

    }]);

