angular.module('groups.all_groups', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/groups/all-groups', {
            templateUrl:'app/groups/all_groups/all_groups.tpl.html',
            controller:'AllGroupsCtrl',
            resolve:{
                groups: ['GroupModel', 'AuthService', '$q', function (GroupModel, AuthService, $q) {

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

    .controller('AllGroupsCtrl', ['$scope', 'MembershipModel', 'SmodalService', 'AuthService', 'groups',
        function ($scope, MembershipModel, SmodalService, AuthService, groups) {
            $scope.groups = groups;

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


            $scope.joinGroup = function(group) {
                var newMembership = new MembershipModel({
                    group_id: group.id,
                    user_id: AuthService.getUser().uid
                });
                newMembership.$save();
                group.members.push(AuthService.getUser());
                group.membership = newMembership;
                group.isMember = 1;

                console.log("joining group", group);
            }

            $scope.showLeaveGroup = function(group) {
                // Get the membership
                SmodalService.show("leaveGroup");
                $scope.groupToLeave = group;
            }
            $scope.leaveGroup = function(group) {
                var index = -1;
                angular.forEach(group.members, function(member, memberIndex) {

                    if(member.uid == AuthService.getUser().uid) {
                        index = memberIndex;
                    }
                });
                group.members.splice(index, 1);

                var membership = new MembershipModel(group.membership);
                membership.$remove();

                group.membership = null;
            }

        }]);

