'use strict';


var myApp = angular.module('myApp', [
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'directives',
        'filters',
        'ngCookies',
        'patients',
        'groups',
        'feed',
        'user',
        'login',
        'directives.navigation',
        'directives.smodal',
        'directives.activities',
        'directives.input']).
    config(['$routeProvider', function ($routeProvider) {

        /**
         * User Page
         */
        $routeProvider.when('/user', {
            templateUrl: 'partials/user/user.html',
            controller: 'UserCtrl'
        });

        $routeProvider.when('/patients/community-patients', {
            templateUrl: 'partials/patients/community_patients.html',
            controller: 'PatientsCtrl',
            resolve: {
                patients: function ($q, $route, PatientModel, auth, Param, $location) {
                    console.log("resolving patients");
                    var defer = $q.defer();
                    auth.checkCurrentUser().then(function () {
                        console.log("got current user");
                        var patients = PatientModel.query(Param.makeParams({
                            'uid': auth.getUser().uid
                        }), function () {
                            defer.resolve(patients);
                        }, function () {
                            defer.reject();
                        });
                    }, function () {
                        $location.path("/splash");
                    });

                    return defer.promise;
                }
            }
        });

        /**
         * Group Pages
         */
        $routeProvider.when('/groups', {
            templateUrl: 'partials/group/groups.html',
            controller: 'GroupsCtrl',
            resolve: {
                memberships: function ($q, MembershipModel, Param, auth) {
                    var defer = $q.defer();
//
                    var memberships = MembershipModel.query(Param.makeParams({user_id: auth.getUser().uid }), function (data) {
                        console.log("user is", auth.getUser().uid);
                        console.log("memberships", memberships);
                        defer.resolve(memberships);
                    }, function (data) {
                        defer.reject();
                    });
                    return defer.promise;
                }
            }
        });

        $routeProvider.when('/group/:group_id', {
            templateUrl: 'partials/group/group.html',
            controller: 'GroupCtrl',
            resolve: {
                currentGroup: function ($q, $route, GroupModel) {
                    var defer = $q.defer();

                    var group = GroupModel.get({
                        'id': $route.current.params.group_id
                    }, function () {
                        defer.resolve(group);
                    });

                    return defer.promise;
                }
            }
        });
        $routeProvider.when('/group', {
            templateUrl: 'partials/group/new_group.html',
            controller: 'NewGroupCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/feed'
        });
    }]);



// Declare app level module which depends on filters, and services


