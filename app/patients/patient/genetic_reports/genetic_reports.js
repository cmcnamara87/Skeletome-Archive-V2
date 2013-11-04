angular.module('patient.genetic_reports', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/genetic-reports', {
            templateUrl:'app/patients/patient/genetic_reports/genetic_reports.tpl.html',
            controller:'GeneticReportsCtrl',
            resolve:{
                geneMutations: ['GeneMutationModel', '$route', '$q', function (GeneMutationModel, $route, $q) {
                    var defer = $q.defer();
                    var geneMutations = GeneMutationModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(geneMutations);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('GeneticReportsCtrl', ['$scope', '$q', '$location', '$routeParams', 'GeneMutationModel', 'GeneticReportModel', 'GeneModel', 'MutationTypeModel', 'geneMutations', function ($scope, $q, $location, $routeParams, GeneMutationModel, GeneticReportModel, GeneModel, MutationTypeModel, geneMutations) {

        $scope.geneMutations = geneMutations;


        $scope.addGeneMutation = function() {

            var newGeneMutation = new GeneMutationModel({
                patient_id: $routeParams.patient_id,
                pathogenic: 'Low'
            });

            $scope.geneMutations.unshift(newGeneMutation);
        }
        $scope.removeGeneMutation = function(geneMutation) {
            var index = $scope.geneMutations.indexOf(geneMutation);
            $scope.geneMutations.splice(index, 1);
        }

        $scope.findGene = function(geneName) {
            var defer = $q.defer();

            var genes = GeneModel.index({
                name: geneName
            }, function() {
                defer.resolve(genes);
            }, function() {
                defer.reject();
            });

            return defer.promise;
        }
        $scope.geneChosen = function(gene, report) {
            // Find the gene mutations that match the gene
            report.geneMutations = GeneMutationModel.index({
                 gene_id: gene.id
            });
        }

        $scope.findMutationType = function(mutationTypeName) {
            var defer = $q.defer();

            var mutationTypes = MutationTypeModel.index({
                name: mutationTypeName
            }, function() {
                defer.resolve(mutationTypes);
            }, function() {
                defer.reject();
            });

            return defer.promise;
        }
        $scope.geneChosen = function(gene, geneMutation) {
            console.log("gene chosen?");
            geneMutation.gene_id = gene.id;
        }
        $scope.mutationTypeChosen = function(geneMutationType, geneMutation) {
            geneMutation.mutation_type_id = geneMutationType.id;
        }

    }]);