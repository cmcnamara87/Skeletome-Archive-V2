angular.module('directives.input.upload_block', [])

// A simple directive to display a gravatar image given an email
    .directive('uploadBlock', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'common/input/upload_block/upload_block.tpl.html',
            scope: {
                url: '@',
                message: '@',
                uploadedFn: '&',
                autoremove: '='
            },
            link: function($scope, iElement, iAttrs, $timeout) {

                $scope.$watch('url', function(value) {
                    if(value && value != "") {

                        iElement.dropzone(
                            {
                                url: $scope.url,
                                parallelUploads: 2,
                                enqueueForUpload: true,
                                dictDefaultMessage: iAttrs.message
                            }
                        );

                        var myDropzone = Dropzone.forElement(iElement[0]);
                        myDropzone.on("addedfile", function(file) {
                            console.log("file added");
                        });
                        myDropzone.on('uploadprogress', function(file, progress) {
                            console.log("progress " + progress);
                        });

                        myDropzone.on('success', function(file, response) {

                            $scope.$apply(function() {
                                $scope.uploadedFn({
                                    'file': angular.fromJson(response)
                                });
                            });

                            if($scope.autoremove == true) {
                                setTimeout(function() {
                                    myDropzone.removeFile(file);
                                }, 750);
                            }

                        });

                    }
                });
            }
        };
    }]);