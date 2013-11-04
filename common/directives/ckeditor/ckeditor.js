angular.module('directives.ckeditor', [])

    .directive('ckEditor', [function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            elm.focus(function(ev) {
                console.log('text area got focus, make it a ckeditor');
                var ck = CKEDITOR.replace(elm[0]);

                ck.on( 'blur', function( e ) {
//                    console.log("the editor lost focus");
//                    e.editor.destroy();
//                    alert( 'The editor named ' + e.editor.name + ' lost the focus' );
                } );


                ck.on('pasteState', function () {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(ck.getData());
                    });
                });

                ck.on( 'instanceReady', function(){
                    console.log("CK instane ready");
                    ck.resize(elm.parent().width(), elm.parent().height() - 50, true);
                    ck.focus();
                })

                ngModel.$render = function (value) {
                    ck.setData(ngModel.$modelValue);
                };


            })



        }
    };
}])