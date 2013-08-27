myApp.contollers.controller('PatientCtrl', function ($scope,
                                                     patient,
                                                     IdentifierModel,
                                                     AddressModel,
                                                     ShareModel,
                                                     PostModel,
                                                     ReplyModel,
                                                     Param,
                                                     PostTypeModel,
                                                     DiagnosisModel,
                                                     DisorderModel,
                                                     VoteModel,
                                                     GeneMutationModel,
                                                     XRayModel
    ) {

    $scope.editing = {
        caseDetails: false
    }

    $scope.patient = patient;

    $scope.addresses = AddressModel.query(Param.makeParams({patient_id: patient.id}));
    $scope.identifiers = IdentifierModel.query(Param.makeParams({patient_id: patient.id}));
    $scope.geneMutations = GeneMutationModel.query(Param.makeParams({patient_id: patient.id}));
    $scope.xrays = XRayModel.query(Param.makeParams({patient_id: patient.id}));

    $scope.createIdentifier = function(identifier) {
        identifier.patient_id = $scope.patient.id;

        var newIdentifier = new IdentifierModel(identifier);
        newIdentifier.$save(function() {
            if(!angular.isDefined($scope.identifiers)) {
                $scope.identifiers = [];
            }
            console.log("id model", newIdentifier);
            $scope.identifiers.push(newIdentifier);
        });
    }

    $scope.shares = ShareModel.query(Param.makeParams({patient_id: patient.id}), function() {
            angular.forEach($scope.shares, function(share, shareIndex) {
                share.posts = PostModel.query(Param.makeParams({share_id: share.id}), function(posts) {
                    angular.forEach(posts, function(post, postIndex) {
                        post.replies = ReplyModel.query(Param.makeParams({post_id: post.id}));
                    });
                });
            });
        });
    $scope.disorders = DisorderModel.query();
    $scope.postTypes = PostTypeModel.query();


    $scope.addGeneMutation = function() {
        // Add gene mutation
        $scope.geneMutations.unshift(new GeneMutationModel({
            patient_id: $scope.patient.id
        }))
    }
    $scope.createGeneMutation = function(geneMutation) {
        geneMutation.$save();
    }

    $scope.addIdentifier = function() {
        var newIdentifier = new IdentifierModel();
        newIdentifier.patient_id = $scope.patient.id;
        $scope.identifiers.unshift(newIdentifier);
    }
    $scope.createIdentifier = function(identifier) {
        identifier.$save(function() {
            console.log("identifier saved");
        });
    }
    $scope.deleteIdentifier = function(identifier) {
        var index = $scope.identifiers.indexOf(identifier);
        $scope.identifiers.splice(index, 1);

        identifier.$delete(function() {
            console.log("identifier deleted");
        });
    }


    $scope.addAddress = function() {
        var newAddress = new AddressModel();
        newAddress.patient_id = $scope.patient.id;

        $scope.addresses.unshift(newAddress);
    }
    $scope.createAddress = function(address) {
        address.$save(function() {
            console.log("address saved");
        });
    }
    $scope.deleteAddress = function(address) {
        var index = $scope.addresses.indexOf(address);
        $scope.addresses.splice(index, 1);

        address.$delete(function() {
            console.log("address deleted");
        });
    }

    $scope.createDiagnosis = function(disorder, share) {
        var diagnosis = DiagnosisModel.addDiagnosisOfDisorderToShare(disorder, share);
    }
    $scope.createVote = function(diagnosis, vote) {
        var newVote = new VoteModel({
            diagnosis_id: diagnosis.id,
            vote: vote
        });
        newVote.$save(function() {
            console.log("adding vote ", newVote);
            diagnosis.votes.unshift(newVote);
        });
    }
    $scope.createPost = function(post, share) {
        post.share_id = share.id;
        post.type_id = post.type.id;

        var newPost = new PostModel(post);
        newPost.$save(function() {
            post.text = "";
            post.type = null;
            share.posts.unshift(newPost);
        });
    }
    $scope.createReply = function(reply, post) {
        var newReply = new ReplyModel({
            text: reply.text,
            post_id: post.id
        });
        newReply.$save(function() {
            reply.text = "";
            post.replies.push(newReply);
        });
    }



});