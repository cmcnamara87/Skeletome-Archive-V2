angular.module('directives.ckeditor', [])

    .directive('ckEditor', [function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            var ck = null;

            elm.focus(function(ev) {

                if(!ck) {
                    ck = CKEDITOR.replace(elm[0]);

                    ck.on('blur', function( event ) {
                        var text = $(event.editor.getData()).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        if(text == "") {
                            console.log("trying to destroy instance");
//                            event.editor.removeAllListeners();
                            event.editor.setData("");
                            setTimeout(function() {
                                event.editor.destroy();
                            }, 0);
                            ck = null;
                        } else {
                            $('#'+ event.editor.id +'_top').hide();
                        }
                    });

                    ck.on('focus', function( event ) {
                        $('#'+ event.editor.id +'_top').show();
                    });


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
                }
            });

            ngModel.$render = function (value) {
                if(ck) {
                    ck.setData(ngModel.$modelValue);
                }
            };
        }
    };
}])