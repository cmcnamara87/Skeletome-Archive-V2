angular.module('patient.genetic_reports', [])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/patient/:patient_id/genetic-reports', {
            templateUrl:'app/patients/patient/genetic_reports/genetic_reports.tpl.html',
            controller:'GeneticReportsCtrl',
            resolve:{
                reports: ['GeneticReportModel', '$route', '$q', function (GeneticReportModel, $route, $q) {
                    var defer = $q.defer();
                    var reports = GeneticReportModel.index({
                        patient_id: $route.current.params.patient_id
                    }, function() {
                        defer.resolve(reports);
                    }, function() {
                        defer.reject();
                    });

                    return defer.promise;
                }]
            }
        });
    }])

    .controller('GeneticReportsCtrl', ['$scope', '$q', '$location', '$routeParams', 'GeneMutationModel', 'GeneticReportModel', 'GeneModel', 'MutationTypeModel', 'reports', function ($scope, $q, $location, $routeParams, GeneMutationModel, GeneticReportModel, GeneModel, MutationTypeModel, reports) {
        $scope.reports = reports;

        $scope.addGeneticReport = function() {

            var newGeneticReport = new GeneticReportModel({
                patient_id: $routeParams.patient_id
            });

            $scope.reports.push(newGeneticReport);
        }
        $scope.findGene = function(value) {
            var defer = $q.defer();

            var genes = GeneModel.index({
                name: value
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

    }]);