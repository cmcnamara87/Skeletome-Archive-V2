angular.module('directives.navigation.breadcrumbbar', [])

// A simple directive to display a gravatar image given an email
    .directive('breadcrumbbar', [function () {
        return {
            restrict: 'E',
            template: '<div class="breadcrumbbar"><a href="#">My Patients</a></div>',
            replace: true,
            link: function (scope, element, attrs) {
                console.log("linking breadcrumb bar");
            }
        };
    }])