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

    .controller('MyGroupsCtrl', ['$scope', '$q', '$location', 'MembershipModel', 'GroupModel', 'UserModel', 'AuthService', 'SmodalService', 'memberships',
        function ($scope, $q, $location, MembershipModel, GroupModel, UserModel, AuthService, SmodalService, memberships) {
        $scope.memberships = memberships;

        $scope.newGroup = new GroupModel({
            administrator_id: AuthService.getUser().uid,
            administrator: AuthService.getUser(),
            members: [
                AuthService.getUser()
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
                angular.forEach(members, function(member) {
                    var newMembership = new MembershipModel({
                        user_id: member.uid,
                        group_id: group.id
                    })
                    newMembership.$save();
                });

                $location.path('/group/' + group.id);
            })
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

