'use strict';


var myApp = angular.module('myApp', [
        'ngRoute',
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
        'search',
        'directives.navigation',
        'directives.smodal',
        'directives.activities',
        'directives.input',
        'ngAnimate',
        'ngSanitize']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/feed'
        });
    }]);



// Declare app level module which depends on filters, and services


