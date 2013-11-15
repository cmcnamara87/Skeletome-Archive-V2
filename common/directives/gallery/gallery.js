angular.module('directives.gallery', [])

// A simple directive to display a gravatar image given an email
    .directive('galleryViewer', ['GalleryService', function (GalleryService) {

        return {
            restrict: 'E',
            scope: {
                gallery: '=',
                index: '@'
            },
            templateUrl: 'common/directives/gallery/gallery.tpl.html',
            link: function ($scope, element, attrs) {
                $scope.GalleryService = GalleryService;

                $scope.$watch('GalleryService.index', function(index) {
                    "use strict";
                    $scope.image = GalleryService.gallery[index];
                });

                $scope.$watch('GalleryService.isVisible', function(visible) {
                    "use strict";
                    if(visible) {
                        $('body').click(function() {
                            "use strict";
                            console.log("body clicked man");
                            $scope.$apply(function() {
                                GalleryService.isVisible = false;
                                GalleryService.gallery = [];
                            })
                        });
                        $('.gallery-content', element).click(function(event) {
                            event.stopPropagation();
                        });
                    } else {
                        $('body').unbind('click');
                    }
                })

            }
        };
    }])
    .directive('gallery', ['GalleryService', function(GalleryService) {
        "use strict";
        return {
            restrict: 'A',
            scope: {
                gallery: '=',
                galleryIndex: '@'
            },
            link: function ($scope, element, attrs) {
                element.click(function(event) {
                    $scope.$apply(function() {
                        // the element was clicked
                        console.log("gal", GalleryService);
                        GalleryService.isVisible = true;
                        GalleryService.gallery = $scope.gallery;
                        GalleryService.index = $scope.galleryIndex;
                    });
                    event.stopPropagation();
                })
            }
        }
    }])
    .factory('GalleryService', function() {
        return {
            isVisible: false,
            gallery: []
        };
    });