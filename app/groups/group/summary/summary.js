angular.module('group.summary', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/group/:group_id/summary', {
            templateUrl:'app/groups/group/summary/summary.tpl.html',
            controller:'GroupSummaryCtrl',
            resolve:{
                group: ['GroupModel', '$route', '$q', function (GroupModel, $route, $q) {
                    return GroupModel.get({
                        id: $route.current.params.group_id
                    }).$promise;
                }],
                members: ['MembershipModel', '$route', function(MembershipModel, $route) {
                    return MembershipModel.index({
                        group_id: $route.current.params.group_id
                    })
                }]
            }
        });
    }])

    .controller('GroupSummaryCtrl', ['$scope', '$location', 'members', 'group', 'MembershipModel', 'UserModel', 'GroupModel', function ($scope, $location, members, group, MembershipModel, UserModel, GroupModel) {
        $scope.group = group;
        $scope.members = members;

//        $scope.group2 = GroupModel.get({id: 3});

        $scope.addMember = function() {
            var newMember = new MembershipModel({
                group_id: $scope.group.id
            });
            $scope.members.unshift(newMember);
        }
        $scope.findUser = function(name) {
            return UserModel.index({
                name: name
            }).$promise;
        }
        $scope.selectedUser = function(user, member) {
            member.user_id = user.uid;
        }
        $scope.removeMember = function(member) {
            var index = $scope.members.indexOf(member);
            $scope.members.splice(index, 1);
        }



    }]);