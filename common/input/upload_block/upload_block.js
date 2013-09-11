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
                uploadedFn: '&'
            },
            link: function($scope, iElement, iAttrs, $timeout) {
                iAttrs.$observe('url', function(value) {
                    if(value && value != "") {

                        console.log("running upload block");

                        console.log("Dropdown url", iAttrs.url);

                        iElement.dropzone(
                            {
                                url: iAttrs.url,
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
                            console.log("success", file);
                            $scope.uploadedFn({
                                'file': angular.fromJson(response)
                            });
                            $timeout(function() {
                                myDropzone.removeFile(file);
                            }, 750);

                        });

                    }
                });
            }
        };
    }]);