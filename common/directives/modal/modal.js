angular.module('directives.modal', [])

    .factory('createModal', function($templateCache, $http, $timeout, $compile) {
        "use strict";

    })
    .directive('modal', function ($templateCache, $http, $timeout, $compile) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element, attrs) {
                "use strict";
                $scope.isShowing = false;

                // The defaults
                var defaults = {
                    type: "window"
                };

                var gotModal = false;

                // Extend the defaults with the params passed in
                var params = angular.extend(defaults, $scope.$eval(attrs.modal));

                element.click(function() {
                    console.log("element clicked?");
                    $scope.$apply(function() {
                        loadTemplate();
                        open();
                    })
                })

                /**
                 * Loads the modal template, and modal content templates
                 */
                var loadTemplate = function() {
                    if(!gotModal) {
                        $http.get('common/directives/modal/' + params.type + '.html', { cache: true }).then(function(response) {
                            console.log("got modal");
                            var modal = angular.element(response.data);

                            // Get the content html
                            $http.get(params.url, { cache: true }).then(function(response) {
                                var modalContent = angular.element(response.data);
                                modal.find('.mmodal-content').html(modalContent);

                                $('body').append(modal);
                                $compile(modal)($scope);
                            });
                        });
                        gotModal = true;
                    }
                }

                /**
                 * Sets the modal to visible
                 */
                var open = function() {
                    $scope.isShowing = true;
                }
                /**
                 * Sets the modal to hidden
                 */
                $scope.close = function() {
                    $scope.isShowing = false;
                }
            }
        };
    })


