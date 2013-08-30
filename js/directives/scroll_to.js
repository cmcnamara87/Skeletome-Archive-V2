myApp.directives.directive('scrollTo', function() {
    return {
        restrict: 'A',
        controller: function ($scope, $location, $anchorScroll) {
            var that = this;

            $scope.scrollTo = function(id) {
                console.log("scrolling to" + id);
                $location.hash(id);
                $anchorScroll();
            }
        },
        link: function(scope, elem, attrs) {

            elem.bind('click', function(event) {
                event.stopPropagation();
                scope.scrollTo(attrs.scrollTo);
            });
        }
    };
});


