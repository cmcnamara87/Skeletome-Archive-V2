angular.module('directives.ckeditor', [])

    .directive('ckEditor', [function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            var ck = null;

            function destroyCKEditor(editor) {
                console.log("trying to destroy instance");
                editor.setData("");
                setTimeout(function() {
                    editor.destroy();
                }, 0);
                ck = null;
            }

            elm.focus(function(ev) {

                if(!ck) {
                    ck = CKEDITOR.replace(elm[0]);

                    ck.on('blur', function( event ) {
                        var text = $(event.editor.getData()).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                        if(text == "") {
                            destroyCKEditor(event.editor);
                        } else {
                            $('#'+ event.editor.id +'_top').hide();
                        }
                    });

                    ck.on('focus', function( event ) {
                        $('#'+ event.editor.id +'_top').show();
                    });

                    $scope.$watch(function() {
                        return ngModel.$modelValue
                    }, function(newValue, oldValue) {
                        if((oldValue && oldValue != "") && (!newValue || newValue == "")) {
                            destroyCKEditor(ck);
                        }
                    })

                    ck.on('pasteState', function () {
                        if(ck) {
                            $scope.$apply(function () {
                                ngModel.$setViewValue(ck.getData());
                            });
                        }
                    });

                    ck.on( 'instanceReady', function(){
                        console.log("CK instane ready");
                        ck.resize(elm.parent().width(), elm.parent().height() - 50, true);
                        ck.focus();
                    })
                }
            });

            $scope.$watch(function() {
                var count = 0;
                if(ngModel.$modelValue) {
                    count = ngModel.$modelValue.match(/ /g).length;
                }
                return count;
            }, function(count) {
                console.log("more spaces!", count);
            })

            ngModel.$render = function (value) {
                if(ck) {
                    ck.setData(ngModel.$modelValue);
                } else {
                    console.log("render the model now!", ngModel.$modelValue);
                    elm.css('border', '1px solid red').val(ngModel.$modelValue);

                }
            };
        }
    };
}])