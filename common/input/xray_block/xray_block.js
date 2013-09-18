angular.module('directives.input.xray_block', [])

// A simple directive to display a gravatar image given an email
    .directive('xrayBlock', [function () {
        return {
            restrict: 'E',
            require: '^field',
            templateUrl: 'common/input/xray_block/xray_block.tpl.html',
            scope: {
                xray: '='
            },
            controller: ['$scope', 'XRayModel', function ($scope, XRayModel) {
            }],
            link: function($scope, iElement, iAttrs, FieldCtrl) {
                $scope.$watch(function() {
                    return FieldCtrl.getIsEditing();
                }, function(isEditing) {
                    $scope.isEditing = isEditing;
                });

                $scope.fileUploaded = function(file) {
                    $scope.xray.file_url = file.full_url;
                    $scope.xray.thumb_url = file.thumb_url;
                    $scope.xray.name = file.name;
                    $scope.xray.fid = file.fid;

                    console.log("file uploaded", $scope.xray);
                }

            }
        };
    }]);