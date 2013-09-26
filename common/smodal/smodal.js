angular.module('directives.smodal', [])

    // Display a modal
    .directive('smodal', ['GroupModel', function (GroupModel) {
        return {
            restrict: 'E',
            templateUrl: 'common/smodal/smodal.tpl.html',
            link: function ($scope, element, attrs) {

                $scope.shareChanged = function(group) {
                    GroupModel.index({name: group}, function(results) {
                        $scope.shareResults = results;
                    });
                }

                $scope.shareKeypressed = function(event) {
                    alert("alert");
                    console.log("event", event);

                }
//                scope.$watch(attrs.show, function(value) {
//                    if(value) {
//                        elem.modal('show');
//                    } else {
//                        elem.modal('hide');
//                    }
//                });
//
//                elem.on('hidden', function () {
//                    var toggle = scope.$eval(attrs.cmModal);
//
//                    if(toggle === true) {
//                        var toggleModel = $parse(attrs.cmModal);
//                        // This lets you SET the value of the 'parsed' model
//
//                        scope.$apply(function() {
//                            toggleModel.assign(scope, false);
//                        })
//
//                    }
//                })
            }
        };
    }]);
