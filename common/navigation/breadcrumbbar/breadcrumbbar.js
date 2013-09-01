angular.module('directives.navigation.breadcrumbbar', [])

// A simple directive to display a gravatar image given an email
    .directive('breadcrumbbar', ['md5', function (md5) {

        return {
            restrict: 'E',
            template: '<img ng-src="http://www.gravatar.com/avatar/{{hash}}{{getParams}}"/>',
            replace: true,
            scope: {
                email: '=',
                size: '=',
                defaultImage: '=',
                forceDefault: '='
            },
            link: function (scope, element, attrs) {
                scope.options = {};
                scope.$watch('email', function (email) {
                    if (email) {
                        scope.hash = md5(email.trim().toLowerCase());
                    }
                });
                scope.$watch('size', function (size) {
                    scope.options.s = (angular.isNumber(size)) ? size : undefined;
                    generateParams();
                });
                scope.$watch('forceDefault', function (forceDefault) {
                    scope.options.f = forceDefault ? 'y' : undefined;
                    generateParams();
                });
                scope.$watch('defaultImage', function (defaultImage) {
                    scope.options.d = defaultImage ? defaultImage : undefined;
                    generateParams();
                });
                function generateParams() {
                    var options = [];
                    scope.getParams = '';
                    angular.forEach(scope.options, function (value, key) {
                        if (value) {
                            options.push(key + '=' + encodeURIComponent(value));
                        }
                    });
                    if (options.length > 0) {
                        scope.getParams = '?' + options.join('&');
                    }
                }
            }
        };
    }])