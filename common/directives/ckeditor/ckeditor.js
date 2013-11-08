angular.module('directives.ckeditor', [])

    .directive('ckEditor', [function () {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            var ck = null;

            function destroyCKEditor(editor) {
                console.log("trying to destroy instance");
                if(editor) {
                    editor.setData("");
                    setTimeout(function() {
                        editor.destroy();
                    }, 0);
                }

                ck = null;
            }

            function createCKEditor() {
                if(!ck) {
                    ck = CKEDITOR.replace(elm[0])

                    ck.on('pasteState', function () {
                        if(ck) {
                            $scope.$apply(function () {
                                ngModel.$setViewValue(ck.getData());
                            });
                        }
                    });

                    ck.on( 'instanceReady', function(){
                        console.log("CK instane ready");
//                        ck.resize(elm.width(), elm.height(), true);
//                        console.log("width height", elm.width(), elm.height());
                        ck.focus();
                    })
                }
            }

            // In focus mode or not?
            if(angular.isDefined(attr.ckEditorUsefocus)) {
                elm.focus(function(ev) {

                    if(!ck) {
                        createCKEditor();

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
                    }
                });
            } else {
                createCKEditor();
            }

            ngModel.$render = function (value) {
                if(ck) {
                    ck.setData(ngModel.$modelValue);
                } else {
                    elm.val(ngModel.$modelValue);
                }
            };
        }
    };
}])