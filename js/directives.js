'use strict';

/* Directives */

myApp.directives = angular.module('myApp.directives', []);


myApp.directives.directive('appVersion', ['version', 'apiUrl', function(version, apiUrl) {
    return function(scope, elm, attrs) {
      elm.text(apiUrl);
    };
}]);

myApp.directives.directive('login', function() {
    return function(scope, elm, attrs) {
        elm.text(apiUrl);
    };
});

myApp.directives.directive('login', function() {
    return {
        restrict: 'E',
        scope: {
        },
        template: '<div>\n    <div ng-show="isLoading">\n        Loading...\n    </div>\n    <div ng-show="!isLoading">\n        <div ng-show="currentUser">\n            {{ currentUser.name }}\n            <button ng-click="logout()">Logout</button>\n        </div>\n\n        <form ng-show="!currentUser">\n            <label>\n                Username\n                <input type="type" ng-model="credentials.username"/>\n            </label>\n            <label >\n                Password\n                <input type="password" ng-model="credentials.password"/>\n            </label>\n\n            <input type="submit" ng-click="login(credentials)"/>\n        </form>\n    </div>\n    \n</div>',
        replace: true,
        controller: function ( $scope, auth) {
            $scope.credentials = {};

            $scope.isLoading = true;

            $scope.currentUser = auth.getUser();
            if(!$scope.currentUser) {
                $scope.isLoading = false;
            }

            console.log("current user is", auth.getUser());

            // check current user
            auth.checkCurrentUser().then(function(currentUser) {
                $scope.isLoading = false;
                $scope.currentUser = auth.getUser();
            });

            $scope.login = function(credentials) {
                auth.login(credentials).then(function(response) {
                    $scope.currentUser = auth.getUser();
                });
            }

            $scope.logout = function() {
                $scope.currentUser = null;
                auth.logout();
            }
        },
        link: function(scope, elem, attrs) {
        }
    };
});

myApp.directives.directive('lockToTop', function() {
    return {
        restrict: 'A',
        replace: true,
        controller: function ($scope) {
            $scope.removeItem = function(item) {
                var index = $scope.listModel.indexOf(item);
                $scope.listModel.splice(index, 1);
            }
        },
        link: function($scope, elem, attrs) {
            /**
             * Created with JetBrains PhpStorm.
             * User: uqcmcna1
             * Date: 11/07/13
             * Time: 3:44 PM
             * To change this template use File | Settings | File Templates.
             */
            var docked = false;
            var init = elem.offset().top;
            var $parent = elem.parent();

            var elemHeight = elem.outerHeight();
            var parentPaddingTop =  parseInt($parent.css('padding-top'));
            var cssClass = "locked-to-top";

            var offset = 0;
            var elemHeight = elem.outerHeight();
            console.log("elem height", elem.outerHeight());
            var scrollDownPast = init + offset;
//            var scrollDownPast = init + elemHeight + offset;
            var scrollUpPast = init + elemHeight;

            jQuery(window).scroll(function()
            {
                var top = 0;
                var $elementsWithClass = jQuery('.' + cssClass);
                $elementsWithClass.each(function(index, elem) {
                    top += jQuery(elem).outerHeight();
                });

                if (!docked && (scrollDownPast - top) < jQuery(document).scrollTop()) {
                    // Lock it to the top

                    $parent.css({
                        'padding-top': parentPaddingTop + elemHeight + "px"
                    });

                    console.log("parent padding top", parentPaddingTop, elemHeight, "px" )
                    var width = elem.width();
                    elem.css({
                        position : "fixed",
                        top: "-" + elemHeight + 'px',
                        width: width,
                        'z-index': '100' - $elementsWithClass.length
                    });

                    elem.animate({
                        top: top + "px"
                    }, 0, function() {
                        // Animation complete.
                    });

                    elem.addClass(cssClass);

                    docked = true;
                    console.log("docking");
                } else if(docked && (scrollUpPast - top) >= jQuery(document).scrollTop()) {

                    $parent.css({
                        'padding-top': parentPaddingTop
                    });
                    // Put it back where it belongs
                    elem.css({
                        position : "static",
                        width: 'auto'
                    });
                    elem.removeClass(cssClass);

                    docked = false;
                    console.log("undocking");
                }
            });

            jQuery(window).resize(function() {
                $parent.css({
                    'padding-top': parentPaddingTop
                });
                // Put it back where it belongs
                elem.css({
                    position : "static",
                    width: 'auto'
                });
                elem.removeClass(cssClass);

                docked = false;
            });
        }
    };
});







