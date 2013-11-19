angular.module('groups.all_groups', [])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/groups/all-groups', {
            templateUrl:'app/groups/all_groups/all_groups.tpl.html',
            controller:'AllGroupsCtrl',
            resolve:{
                groups: ['GroupModel', 'AuthService', '$q', function (GroupModel, AuthService, $q) {
                    return GroupModel.index({}).$promise;
                }]
            }
        });
    }])

    .controller('AllGroupsCtrl', ['$scope', 'MembershipModel', 'SmodalService', 'AuthService', 'SessionService', 'groups',
        function ($scope, MembershipModel, SmodalService, AuthService, SessionService, groups) {
            $scope.groups = groups;

            $scope.joinGroup = function(group) {
                var newMembership = new MembershipModel({
                    group_id: group.id,
                    user_id: SessionService.currentUser.uid
                });
                newMembership.$save().then(function() {
                    "use strict";
                    // add the membership id
                    group.membership_id = newMembership.id;
                    group.member_count++;
                });
            }

            $scope.showLeaveGroup = function(group) {
                // Get the membership
                SmodalService.show("leaveGroup");
                $scope.groupToLeave = group;
            }
            $scope.leaveGroup = function(group) {
                var index = -1;
                $scope.is_member =
                group.members.splice(index, 1);

                var membership = new MembershipModel(group.membership);
                membership.$remove();

                group.membership = null;
            }

        }]);

