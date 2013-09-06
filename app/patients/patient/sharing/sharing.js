angular.module('patient.sharing', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/sharing', {
            templateUrl:'app/patients/patient/sharing/sharing.tpl.html',
            controller:'SharingCtrl',
            resolve:{
                shares: ['ShareModel', '$route', '$q', function (ShareModel, $route, $q) {
                    var defer = $q.defer();
                    var shares = ShareModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(shares);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }],
                membershipGroups: ['MembershipModel', 'AuthService', '$route','$q', function(MembershipModel, AuthService, $route, $q) {
                    var defer = $q.defer();

                    if(AuthService.getUser()) {
                        var memberships = MembershipModel.index({
                            user_id: AuthService.getUser().uid
                        }, function() {
                            var groups = [];
                            angular.forEach(memberships, function(membership, membershipIndex) {
                                groups.push(membership.group);
                            });

                            defer.resolve(groups);
                        }, function() {
                            defer.resolve();
                        });
                    }

                    return defer.promise;
                }],
                currentUser: ['AuthService', function(AuthService) {
                    return AuthService.requireAuthenticated();
                }]
            }
        });
    }])

    .controller('SharingCtrl', ['$scope', '$location', '$routeParams', 'ShareModel', 'shares', 'membershipGroups', function ($scope, $location, $routeParams, ShareModel, shares, membershipGroups) {
        $scope.shares = shares;
        $scope.membershipGroups = membershipGroups;

        $scope.add = function() {
            var newShare = new ShareModel({
                patient_id: $routeParams.patient_id
            });

            $scope.shares.unshift(newShare);
        }
    }]);