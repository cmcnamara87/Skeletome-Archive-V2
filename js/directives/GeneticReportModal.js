myApp.directives.directive('geneticReportModal', function() {
    return {
        restrict: 'E',
        scope: {
        },
        template: '<div>\n\n    \n    <!-- Modal -->\n    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n        <div class="modal-dialog">\n            <div class="modal-content">\n                <div class="modal-header">\n                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n                    <h4 class="modal-title">Add Gene Mutation</h4>\n                </div>\n                <div class="modal-body">\n\n                    <input type="text" class="form-control" ng-model="geneMutationName" /><button ng-click="findGeneMutations(geneMutationName)">Search</button>\n\n                    <div ng-show="geneMutations && !geneMutations[0].id">\n                        no results add new gene mutation\n                    </div>\n                    \n                    \n                    <table class="table table-info">\n                        <tr>\n                            <th>Name</th>\n                            <th>Gene</th>\n                            <th>Mutation Type</th>\n                            <th>Pathogenicity</th>\n                            <th></th>\n                        </tr>\n                        <tr ng-repeat="geneMutation in geneMutations">\n                            <td><value-block value="geneMutation.name" model="geneMutation"></value-block></td>\n                            <td><value-block value="geneMutation.gene_id" model="geneMutation"></value-block></td>\n                            <td><value-block value="geneMutation.mutation_type_id" model="geneMutation"></value-block></td>\n                            <td><value-block value="geneMutation.pathogenic" model="geneMutation"></value-block></td>\n                            <td>\n                                <button ng-show="!geneMutation.id" ng-click="createGeneMutation(geneMutation)">\n                                    <i class="icon icon-save" ></i>\n                                </button>\n\n                                <button ng-click="deleteGeneMutation(geneMutation)" class="btn btn-action btn-action-remove">\n                                    <i class="icon icon-trash" ></i>\n                                </button>\n                            </td>\n                        </tr>\n                    </table>\n                    \n                </div>\n                <div class="modal-footer">\n                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n                    <button type="button" class="btn btn-primary">Save changes</button>\n                </div>\n            </div><!-- /.modal-content -->\n        </div><!-- /.modal-dialog -->\n    </div><!-- /.modal -->\n    \n</div>\n',
        replace: true,
        controller: function ($scope, auth, GeneMutationModel, Param, GeneticReportModel) {
            var that = this;


            $scope.findGeneMutations = function(name) {
                $scope.geneMutations = GeneMutationModel.query(Param.makeParams({
                    name: $scope.geneMutationName
                }), function(geneMutations) {
                    if(geneMutations.length == 0) {
                        var newGeneMutation = new GeneMutationModel();
                        $scope.geneMutations.unshift(newGeneMutation);
                    }
                });
            }

            $scope.createGeneMutation = function(geneMutation) {
                geneMutation.$save();
            }
            $scope.deleteGeneMutation = function(geneMutation) {
                var index = $scope.geneMutations.indexOf(geneMutation);
                $scope.geneMutations.splice(index, 1);
                geneMutation.$delete();
            }

            $scope.createGeneticReport = function(geneMutation) {
                var newGeneticReport = new GeneticReportModel();
                newGeneticReport.gene_mutation_id = geneMutation.id;
                newGeneticReport.patient_id = 12;
                newGeneticReport.$save();
            }
        },
        link: function(scope, elem, attrs) {
        }
    };
});